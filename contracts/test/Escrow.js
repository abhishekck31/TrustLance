const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Escrow", function () {
    async function deployEscrowFixture() {
        const [owner, client, freelancer] = await ethers.getSigners();
        const Escrow = await ethers.getContractFactory("Escrow");
        const escrow = await Escrow.deploy();
        return { escrow, owner, client, freelancer };
    }

    describe("Job Creation and Funding", function () {
        it("Should allow a client to create and fund a job", async function () {
            const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

            const milestones = [ethers.parseEther("1.0"), ethers.parseEther("2.0")];
            const totalAmount = ethers.parseEther("3.0");

            await expect(escrow.connect(client).createJob(freelancer.address, "metaHash", milestones))
                .to.emit(escrow, "JobCreated")
                .withArgs(0, client.address, freelancer.address, totalAmount);

            await expect(escrow.connect(client).fundEscrow(0, { value: totalAmount }))
                .to.emit(escrow, "EscrowFunded")
                .withArgs(0, client.address, totalAmount);
        });
    });

    describe("Milestone Submission", function () {
        it("Should allow freelancer to submit a milestone", async function () {
            const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

            const milestones = [ethers.parseEther("1.0")];
            const totalAmount = ethers.parseEther("1.0");

            await escrow.connect(client).createJob(freelancer.address, "metaHash", milestones);
            await escrow.connect(client).fundEscrow(0, { value: totalAmount });

            await expect(escrow.connect(freelancer).submitMilestone(0, 0, "submissionHash"))
                .to.emit(escrow, "MilestoneSubmitted")
                .withArgs(0, 0, "submissionHash");
        });
    });

    describe("Milestone Approval", function () {
        it("Should allow client to approve a milestone and release funds", async function () {
            const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

            const milestones = [ethers.parseEther("1.0")];
            const totalAmount = ethers.parseEther("1.0");

            await escrow.connect(client).createJob(freelancer.address, "metaHash", milestones);
            await escrow.connect(client).fundEscrow(0, { value: totalAmount });
            await escrow.connect(freelancer).submitMilestone(0, 0, "submissionHash");

            // Check for event emission
            await expect(escrow.connect(client).approveMilestone(0, 0))
                .to.emit(escrow, "MilestoneApproved")
                .withArgs(0, 0, milestones[0]);

            // Verify job completion (since it has 1 milestone)
            const job = await escrow.jobs(0);
            expect(job.status).to.equal(3); // JobStatus.Completed = 3
        });

        it("Should fail if not client", async function () {
            const { escrow, client, freelancer, owner } = await loadFixture(deployEscrowFixture);

            const milestones = [ethers.parseEther("1.0")];
            const totalAmount = ethers.parseEther("1.0");

            await escrow.connect(client).createJob(freelancer.address, "metaHash", milestones);
            await escrow.connect(client).fundEscrow(0, { value: totalAmount });
            await escrow.connect(freelancer).submitMilestone(0, 0, "submissionHash");

            await expect(escrow.connect(freelancer).approveMilestone(0, 0))
                .to.be.revertedWith("Only client can approve");
        });
    });

    describe("Dispute Handling", function () {
        it("Should allow client/freelancer to raise a dispute and freeze approvals", async function () {
            const { escrow, client, freelancer } = await loadFixture(deployEscrowFixture);

            const milestones = [ethers.parseEther("1.0")];
            const totalAmount = ethers.parseEther("1.0");

            await escrow.connect(client).createJob(freelancer.address, "metaHash", milestones);
            await escrow.connect(client).fundEscrow(0, { value: totalAmount });
            await escrow.connect(freelancer).submitMilestone(0, 0, "submissionHash");

            // Client raises dispute
            await expect(escrow.connect(client).raiseDispute(0))
                .to.emit(escrow, "DisputeRaised")
                .withArgs(0, client.address);

            const job = await escrow.jobs(0);
            expect(job.status).to.equal(4); // JobStatus.Disputed = 4

            // Attempt to approve milestone should fail
            await expect(escrow.connect(client).approveMilestone(0, 0))
                .to.be.revertedWith("Job under dispute");
        });
    });
});
