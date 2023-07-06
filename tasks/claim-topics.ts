// hardhat tasks for working with claim topics
import { task } from "hardhat/config";
import { getDiamondToken } from "../utils/deploy";

// // functions
// // setters
// function addClaimTopic(uint256 _claimTopic) external;
// function removeClaimTopic(uint256 _claimTopic) external;

// // getter
// function getClaimTopics() external view returns (uint256[] memory);

// getters
task("claim-topics", "get claim topics")
    .addParam("symbol", "symbol of diamond token")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // get the claim topics
        const claimTopics = await diamondToken.getClaimTopics();
        // console.log the claim topics
        console.log(claimTopics);
    });

// add a claim topic
task("add-claim-topic", "add a claim topic")
    .addParam("symbol", "symbol of diamond token")
    .addParam("topic", "claim topic to add")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // add the claim topic
        const tx = await diamondToken.addClaimTopic(taskArgs.claimTopic);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
        // get the claim topics
        const claimTopics = await diamondToken.getClaimTopics();
        // console.log the claim topics
        console.log(claimTopics);
    });

// remove a claim topic
task("remove-claim-topic", "remove a claim topic")
    .addParam("symbol", "symbol of diamond token")
    .addParam("claimTopic", "claim topic to remove")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // remove the claim topic
        const tx = await diamondToken.removeClaimTopic(taskArgs.claimTopic);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
        // get the claim topics
        const claimTopics = await diamondToken.getClaimTopics();
        // console.log the claim topics
        console.log(claimTopics);
    });