const hre = require("hardhat");

async function main() {
  // Deploy the Escrow contract
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();

  await escrow.deployed();

  console.log("Escrow contract deployed to:", escrow.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });