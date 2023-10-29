const {ethers} = require("hardhat");

async function deployScript(){
    console.log("Deploying the NFT Contract...");
    const baseC = await ethers.getContractFactory("contracts/Nft.sol:IncubeDeFi");
    const deployC = await baseC.deploy();
    await deployC.deployed();
    console.log("The deployed NFT Contract address is =>  ", deployC.address);
}

deployScript();