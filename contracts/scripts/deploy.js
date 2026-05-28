const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy Escrow
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("Escrow deployed to:", escrowAddress);

  // 2. Deploy DAO Token
  const Token = await hre.ethers.getContractFactory("TrustLanceGovernanceToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TrustLanceGovernanceToken deployed to:", tokenAddress);

  // 3. Deploy DAO
  const DAO = await hre.ethers.getContractFactory("TrustLanceDAO");
  const dao = await DAO.deploy(tokenAddress, escrowAddress);
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  console.log("TrustLanceDAO deployed to:", daoAddress);

  // 4. Update Escrow Resolver to DAO
  const tx = await escrow.updateResolver(daoAddress);
  await tx.wait();
  console.log("Escrow resolver updated to DAO:", daoAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
