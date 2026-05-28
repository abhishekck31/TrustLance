const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Contract", function () {
  let Escrow;
  let escrow;
  let owner;
  let client;
  let freelancer;
  let resolver;
  let addr1;

  beforeEach(async function () {
    [owner, client, freelancer, resolver, addr1] = await ethers.getSigners();

    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();
    await escrow.waitForDeployment();
  });

  describe("Job Creation", function () {
    it("should create a job successfully", async function () {
      const tx = await escrow.connect(client).createJob(
        freelancer.address,
        "ipfs://test-hash",
        [ethers.parseEther("1"), ethers.parseEther("2")]
      );
      
      await expect(tx).to.emit(escrow, "JobCreated")
        .withArgs(0, client.address, freelancer.address, ethers.parseEther("3"));

      const job = await escrow.jobs(0);
      expect(job.client).to.equal(client.address);
      expect(job.freelancer).to.equal(freelancer.address);
      expect(job.totalAmount).to.equal(ethers.parseEther("3"));
      expect(job.milestoneCount).to.equal(2);
      expect(job.status).to.equal(0); // Open
    });
  });

  describe("Job Flow (Fund -> Submit -> Approve -> Withdraw)", function () {
    beforeEach(async function () {
      await escrow.connect(client).createJob(
        freelancer.address,
        "ipfs://test-hash",
        [ethers.parseEther("1")]
      );
    });

    it("should allow client to fund escrow", async function () {
      await expect(
        escrow.connect(client).fundEscrow(0, { value: ethers.parseEther("1") })
      ).to.emit(escrow, "EscrowFunded")
       .withArgs(0, client.address, ethers.parseEther("1"));
      
      const job = await escrow.jobs(0);
      expect(job.status).to.equal(1); // Funded
    });

    it("should allow freelancer to submit milestone", async function () {
      await escrow.connect(client).fundEscrow(0, { value: ethers.parseEther("1") });
      
      await expect(
        escrow.connect(freelancer).submitMilestone(0, 0, "ipfs://proof-hash")
      ).to.emit(escrow, "MilestoneSubmitted")
       .withArgs(0, 0, "ipfs://proof-hash");
    });

    it("should allow client to approve milestone and freelancer to withdraw", async function () {
      await escrow.connect(client).fundEscrow(0, { value: ethers.parseEther("1") });
      await escrow.connect(freelancer).submitMilestone(0, 0, "ipfs://proof-hash");
      
      await expect(
        escrow.connect(client).approveMilestone(0, 0)
      ).to.emit(escrow, "MilestoneApproved")
       .withArgs(0, 0, ethers.parseEther("1"));

      const job = await escrow.jobs(0);
      expect(job.status).to.equal(3); // Completed

      // Check balance updated (Pull pattern)
      const balance = await escrow.balances(freelancer.address);
      expect(balance).to.equal(ethers.parseEther("1"));

      // Freelancer withdraws
      await expect(
        escrow.connect(freelancer).withdraw()
      ).to.changeEtherBalances(
        [freelancer, escrow],
        [ethers.parseEther("1"), -ethers.parseEther("1")]
      );
    });
  });

  describe("Dispute Resolution", function () {
    beforeEach(async function () {
      await escrow.connect(client).createJob(
        freelancer.address,
        "ipfs://test-hash",
        [ethers.parseEther("2")]
      );
      await escrow.connect(client).fundEscrow(0, { value: ethers.parseEther("2") });
    });

    it("should allow client to raise dispute", async function () {
      await expect(
        escrow.connect(client).raiseDispute(0)
      ).to.emit(escrow, "DisputeRaised")
       .withArgs(0, client.address);
    });

    it("should allow resolver to resolve dispute in favor of freelancer", async function () {
      await escrow.connect(client).raiseDispute(0);
      
      await expect(
        escrow.connect(owner).resolveDispute(0, true) // owner is default resolver
      ).to.emit(escrow, "DisputeResolved")
       .withArgs(0, true);

      const balance = await escrow.balances(freelancer.address);
      expect(balance).to.equal(ethers.parseEther("2"));
    });
  });
});
