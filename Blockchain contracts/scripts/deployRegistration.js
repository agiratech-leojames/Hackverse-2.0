const {ethers} = require("hardhat");

async function deployScript(){
    console.log("Deploying the Loan Registration Contract...");
    const baseC = await ethers.getContractFactory("contracts/Registration.sol:Registration");
    const deployC = await baseC.deploy();
    await deployC.deployed();
    console.log("The deployed Loan Registration Contract address is =>  ", deployC.address);
}

deployScript();