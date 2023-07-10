import { task } from "hardhat/config";

// get the sddress of the first available account
task("get-account-address", "get account address")
    .setAction(async (taskArgs, hre) => {
        // get the first account
        const accounts = await hre.ethers.getSigners();
        const account = accounts[0];
        // get the balance of the address
        const balance = await account.getBalance();
        // log the address
        console.log(account.address + " has a balance of " + balance.toString());
    });
