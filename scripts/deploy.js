const fs = require("fs");
const hre = require("hardhat");

async function main() {
  // Deploy SVG.sol
  const SVG = await hre.ethers.getContractFactory("SVG");
  const svg = await SVG.deploy();
  await svg.deployed();
  console.log("SVG deployed to:", svg.address);

  // Deploy FLIP.sol
  const FLIP = await hre.ethers.getContractFactory("FLIP");
  const flip = await FLIP.deploy();
  await flip.deployed();
  console.log("FLIP deployed to:", flip.address);

  // Deploy Flippando.sol
  const FlippandoBundler = await hre.ethers.getContractFactory("FlippandoBundler");
  const flippandoBundler = await FlippandoBundler.deploy();
  await flippandoBundler.deployed();
  console.log("FlippandoBundler deployed to:", flippandoBundler.address);

  // Deploy Flippando.sol
  const Flippando = await hre.ethers.getContractFactory("Flippando");
  const flippando = await Flippando.deploy(svg.address, flip.address, flippandoBundler.address);
  await flippando.deployed();
  console.log("Flippando deployed to:", flippando.address);

  // Change owner to Flippando
  await flip.changeOwner(flippando.address);
  console.log("Changed owner of FLIP to:", flippando.address);

  // Change owner to Flippando
  await flippandoBundler.changeOwner(flippando.address);
  console.log("Changed owner of FlippandoBundler to:", flippando.address);
  

  // Write the addresses to config.js
  fs.writeFileSync("./config.js", `
    module.exports = {
      svgAddress: "${svg.address}",
      flippandoAddress: "${flippando.address}",
      flipAddress: "${flip.address}",
      flippandoBundlerAddress: "${flippandoBundler.address}",
    }`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
