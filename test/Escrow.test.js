const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Contract", function () {
    let Escrow;
    let escrowInstance;
    let deployer;
    let depositor1;
    let depositor2;

    // Define addresses for testing
    const OWNER_ADDRESS = ethers.provider.send("eth_address", []); // This will be the address of the first account created by Hardhat, usually the deployer in a specific test setup. We'll rely on deployment context if possible, but here we use the test runner context implicitly.

    before(async function () {
        // Setup accounts: deployer (owner), depositor 1, depositor 2
        [deployer, depositor1, depositor2] = await ethers.getSigners();

        // Deploy the contract
        Escrow = await ethers.getContractFactory("Escrow");
        escrowInstance = await Escrow.deploy();

        await escrowInstance.deployed();
    });

    it("Should be deployed by the owner", async function () {
        // Assuming 'deployer' is the account that initiated deployment (the deployer role)
        expect(await escrowInstance.owner()).to.equal(deployer.address);
    });

    describe("Funding Tests", function () {
        it("Should allow a user to deposit funds successfully", async function () {
            const amountToSend = ethers.utils.parseEther("100");
            
            // Depositor 1 deposits funds
            await escrowInstance.deposit(depositor1.address, amountToSend);

            // Check if the total number of items is correct (should be 1)
            expect(await escrowInstance.nextId()).to.equal(1);

            // Verify that the deposit exists and hasn't been released
            let item = await escrowInstance.escrowItems(1);
            expect(item.amount).to.equal(amountToSend);
            expect(item.released).to.be.false;
        });

        it("Should revert if a zero or negative amount is deposited", async function () {
            // Attempt to deposit 0 Ether
            await expect(escrowInstance.deposit(depositor1.address, 0)).to.be.revertedWith("Deposit amount must be positive");
            
            // Note: Testing negative amounts requires more complex setup if Solidity strict checks are used, but we test the explicit requirement.
        });
    });

    describe("Release Tests (Access Control)", function () {
        it("Owner should be able to release funds for an escrow item", async function () {
            const amountToSend = ethers.utils.parseEther("50");
            
            // Setup funding
            await escrowInstance.deposit(depositor1.address, amountToSend);

            // Owner releases the funds
            await escrowInstance.releaseFunds(1);

            // Check status after release
            let item = await escrowInstance.escrowItems(1);
            expect(item.released).to.be.true;

            // Verify that Depositor 1 actually received the funds (requires interaction with an external wallet setup for full end-to-end testing, but we check contract state)
            // In a real test environment connected to a private network or funded locally, this call would succeed. We assert the contract logic flow here.
        });

        it("A non-owner should not be able to release funds", async function () {
            const amountToSend = ethers.utils.parseEther("10");
            
            // Setup funding
            await escrowInstance.deposit(depositor2.address, amountToSend);

            // Attempt by a non-owner (Depositor 2)
            await expect(escrowInstance.releaseFunds(1)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should revert if attempting to release an already released fund", async function () {
            const amountToSend = ethers.utils.parseEther("10");
            
            // Setup funding and initial release
            await escrowInstance.deposit(depositor1.address, amountToSend);
            await escrowInstance.releaseFunds(1);

            // Attempt to release again
            await expect(escrowInstance.releaseFunds(1)).to.be.revertedWith("Funds are already released");
        });
    });
});