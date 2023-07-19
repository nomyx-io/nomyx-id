// hardhat tasks for working with trusted issuers
import { task } from "hardhat/config";
import { getDiamondToken } from "../utils/deploy";

import { BigNumber } from "ethers";

// functions
// setters
// function addTrustedIssuer(address _trustedIssuer, uint[] calldata _claimTopics) external;
// function removeTrustedIssuer(address _trustedIssuer) external;
// function updateIssuerClaimTopics(address _trustedIssuer, uint[] calldata _claimTopics) external;

// // getters
// function getTrustedIssuers() external view returns (TrustedIssuer[] memory);
// function isTrustedIssuer(address _issuer) external view returns(bool);
// function getTrustedIssuerClaimTopics(address _trustedIssuer) external view returns(uint[] memory);
// function hasClaimTopic(address _issuer, uint _claimTopic) external view returns(bool);

// getters
task("trusted-issuers", "get trusted issuers")
    .addParam("symbol", "symbol of diamond token")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.symbol);
        // get the trusted issuers
        const trustedIssuers = await diamondToken.getTrustedIssuers();
        // console.log the trusted issuers
        console.log(trustedIssuers);
    });

// add a trusted issuer
task("add-trusted-issuer", "add a trusted issuer")
    .addParam("symbol", "symbol of diamond token")
    .addParam("trustedissuer", "trusted issuer to add")
    .addParam("claimtopics", "claim topics to add")
    .setAction(async (taskArgs, hre) => {
        // get the diamond tokens
        const diamondToken = await getDiamondToken(hre, taskArgs.symbol);
        const claimTopics = [BigNumber.from(taskArgs.claimtopics)];
        // add the trusted issuer
        const tx = await diamondToken.addTrustedIssuer(taskArgs.trustedissuer, claimTopics);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
        // get the trusted issuers
        const trustedIssuers = await diamondToken.getTrustedIssuers();
        // console.log the trusted issuers
        console.log(trustedIssuers);
    });

// remove a trusted issuer
task("remove-trusted-issuer", "remove a trusted issuer")
    .addParam("symbol", "symbol of diamond token")
    .addParam("trustedIssuer", "trusted issuer to remove")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.symbol);
        // remove the trusted issuer
        const tx = await diamondToken.removeTrustedIssuer(taskArgs.trustedIssuer);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
        // get the trusted issuers
        const trustedIssuers = await diamondToken.getTrustedIssuers();
        // console.log the trusted issuers
        console.log(trustedIssuers);
    });

// update a trusted issuer's claim topics
task("update-trusted-issuer-claim-topics", "update a trusted issuer's claim topics")
    .addParam("symbol", "symbol of diamond token")
    .addParam("trustedIssuer", "trusted issuer to update")
    .addParam("claimTopics", "claim topics to update")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.symbol);
        // update the trusted issuer's claim topics
        const tx = await diamondToken.updateIssuerClaimTopics(taskArgs.trustedIssuer, taskArgs.claimTopics);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
        // get the trusted issuers
        const trustedIssuers = await diamondToken.getTrustedIssuers();
        // console.log the trusted issuers
        console.log(trustedIssuers);
    });

// is a trusted issuer
task("is-trusted-issuer", "is a trusted issuer")
    .addParam("symbol", "symbol of diamond token")
    .addParam("trustedissuer", "trusted issuer to check")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.symbol);
        // is the trusted issuer
        const isTrustedIssuer = await diamondToken.isTrustedIssuer(taskArgs.trustedissuer);
        // console.log the isTrustedIssuer
        console.log(isTrustedIssuer);
    });

// get a trusted issuer's claim topics
task("get-trusted-issuer-claim-topics", "get a trusted issuer's claim topics")
    .addParam("symbol", "symbol of diamond token")
    .addParam("trustedissuer", "trusted issuer to get claim topics for")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.symbol);
        // get the trusted issuer's claim topics
        const trustedIssuerClaimTopics = await diamondToken.getTrustedIssuerClaimTopics(taskArgs.trustedissuer);
        // console.log the trusted issuer's claim topics
        console.log(trustedIssuerClaimTopics);
    });

// has a claim topic
task("has-claim-topic", "has a claim topic")
    .addParam("symbol", "symbol of diamond token")
    .addParam("trustedIssuer", "trusted issuer to check")
    .addParam("claimTopic", "claim topic to check")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.symbol);
        // has the claim topic
        const hasClaimTopic = await diamondToken.hasClaimTopic(taskArgs.trustedIssuer, taskArgs.claimTopic);
        // console.log the hasClaimTopic
        console.log(hasClaimTopic);
    });