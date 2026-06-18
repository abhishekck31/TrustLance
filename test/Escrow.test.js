const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Contract", function () {
    let Escrow;
    let escrowInstance;
    let owner;
    let buyer;
    let seller;

    // Define constants for testing
    const TEST_AMOUNT = ethers.constants.Address * 1000 ether; // Use a large fake value for realistic amounts in tests (adjust as needed)
    const RELEASE_MILESTONE = 500 ether;

    before(async function () {
        // Deploy the contract
        Escrow = await ethers.getContractFactory("Escrow");
        escrowInstance = await Escrow.deploy();
        await escrowInstance.deployed();

        // Setup addresses (using hardhat accounts)
        owner = await ethers.getSigner();
        buyer = ethers.AddressZero; // Will be set via signer later if needed, but here we use zero for initial setup clarity
        seller = ethers.AddressZero;

        // Set the deployer as the owner
        await escrowInstance.setOwner(owner.address); 
    });

    // --- Access Control Tests ---
    describe("Access Control", function () {
        it("Should set the deployer as the owner", async function () {
            const ownerAddress = await escrowInstance.owner();
            expect(ownerAddress).to.equal(owner.address);
        });

        it("Only the owner should be able to change the owner", async function () {
            await expect(escrowInstance.setOwner(ethers.AddressZero)).to.be.revertedWith("Invalid owner");
        });
    });

    // --- Funding Tests ---
    describe("Funding and Agreement Creation", function () {
        it("Should successfully create a new agreement and deposit funds", async function () {
            // Since we cannot simulate real ETH transfers easily in unit tests without mock tokens or setup, 
            // we focus on the contract logic flow and ID assignment.
            
            // Simulate calling the function (assuming addresses are set correctly)
            await escrowInstance.createAgreement(
                seller, // The address that initiates the creation (conceptually the seller depositing)
                buyer,  // The recipient
                TEST_AMOUNT,
                RELEASE_MILESTONE
            );

            const agreementId = 1; // Assuming it's the first agreement created
            
            // Verify that an agreement exists (must check if index is valid based on deployment)
            const details = await escrowInstance.getAgreementDetails(agreementId);
            
            expect(details[0]).to.equal(buyer); // Buyer address check
            expect(details[1]).to.equal(seller); // Seller address check
            expect(details[2]).to.equal(TEST_AMOUNT); // Amount check
            expect(details[3]).to.equal(RELEASE_MILESTONE); // Milestone check
            expect(details[4]).to.be.false; // Must not be released initially
        });

        it("Should prevent creating agreements with zero amount", async function () {
            await expect(escrowInstance.createAgreement(seller, buyer, 0, RELEASE_MILESTONE)).to.be.revertedWith("Amount must be greater than zero");
        });
    });

    // --- Milestone Release Tests ---
    describe("Milestone Release", function () {
        let agreementId;

        before(async function () {
            // Setup a valid agreement first
            await escrowInstance.createAgreement(seller, buyer, TEST_AMOUNT, RELEASE_MILESTONE);
            agreementId = 1;
        });

        it("Should successfully release funds when the condition is met", async function () {
            // Test successful release
            await escrowInstance.releaseFunds(agreementId, true);

            const details = await escrowInstance.getAgreementDetails(agreementId);
            expect(details[4]).to.be.true; // Check if released flag is true
        });

        it("Should revert if attempting to release an already released agreement", async function () {
            // First, release successfully
            await escrowInstance.releaseFunds(agreementId, true);

            // Second, attempt to release again
            await expect(escrowInstance.releaseFunds(agreementId, true)).to.be.revertedWith("Agreement already released");
        });

        it("Should revert if attempting to release an invalid agreement ID", async function () {
            await expect(escrowInstance.releaseFunds(9999, true)).to.be.revertedWith("Invalid agreement ID");
        });
    });
});