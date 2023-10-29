const {ethers} = require("hardhat");

async function deployScript(){
    console.log("Deploying the Escrow Contract...");
    const baseC = await ethers.getContractFactory("contracts/Escrow.sol:Escrow");
    const deployC = await baseC.deploy("0x8dAC7778CC061A84329d58C96177f53A16789630","0xE7295C6569dDF883edF0B5a667d13dda955CB197");
    await deployC.deployed();
    console.log("The deployed Escrow Contract address is =>  ", deployC.address);
}

deployScript();