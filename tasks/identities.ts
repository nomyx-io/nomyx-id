// hardhat tasks for working with identities
import { task } from "hardhat/config";
import { getContractDeployment, getContractDeploymentAt, getDiamondToken } from "../utils/deploy";
import { BigNumber } from "ethers";

// getters
task("identities", "get identities")
    .addParam("symbol", "symbol of diamond token")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.symbol);
        // get the identities
        const identities = await diamondToken.getRegistryUsers();
        // console.log the identities
        console.log(identities);
    });

// add an identity
task("add-identity", "add an identity")
    .addParam("symbol", "symbol of diamond token")
    .addParam("identity", "user address to add")
    .setAction(async (taskArgs, hre) => {
        // step 1 - deploy the identity
        const identityFactory = await getContractDeployment(hre, 'IdentityFactory');
        const existingIdentity = await identityFactory.getIdentity(taskArgs.identity);
        let identity;
        if (!existingIdentity || BigNumber.from(existingIdentity).isZero()) {
            let receipt = (await identityFactory.createIdentity(taskArgs.identity)).wait();
            identity = await identityFactory.getIdentity(taskArgs.identity);
        } else {
            identity = existingIdentity;
        }

        // console.log the identity
        console.log(identity);

        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.symbol);
        // add the identity
        const tx = await diamondToken.addIdentity(taskArgs.identity, identity);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
        // get the identities
        const identities = await diamondToken.getRegistryUsers();
        // console.log the identities
        console.log(identities);
    });

// remove an identity
task("remove-identity", "remove an identity")
    .addParam("symbol", "symbol of diamond token")
    .addParam("identity", "identity to remove")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // remove the identity
        const tx = await diamondToken.removeIdentity(taskArgs.identity);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
        // get the identities
        const identities = await diamondToken.getRegistryUsers();
        // console.log the identities
        console.log(identities);
    });

// add a claim
task("add-claim", "add a claim")
    .addParam("symbol", "symbol of diamond token")
    .addParam("identity", "user address of identity to add claim to")
    .addParam("claimtopic", "claim topic to add")
    .addParam("claim", "claim to add")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const identityFactory = await getContractDeployment(hre, 'IdentityFactory');
        const identity = await identityFactory.getIdentity(taskArgs.identity);
        const accountAddress = await hre.ethers.provider.getSigner().getAddress();

        const identityContract = await getContractDeploymentAt(hre, 'Identity', identity);

        // add the claim
        const tx = await identityContract.addClaim(
            taskArgs.claimtopic,
            taskArgs.claimtopic,
            accountAddress,
            [],
            [],
            "");
        // wait for the tx to be mined
        const receipt = await tx.wait();

        // console.log the receipt
        console.log(receipt);

        // get the identities
        const identities = await identityFactory.getIdentityUsers();
        // console.log the identities
        console.log(identities);
    });

// remove a claim
// remove a claim
task("remove-claim", "remove a claim")
    .addParam("symbol", "symbol of diamond token")
    .addParam("identity", "identity to remove claim from")
    .addParam("claimTopic", "claim topic to remove")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // remove the claim
        const tx = await diamondToken.removeClaim(taskArgs.identity, taskArgs.claimTopic);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
        // get the identities
        const identities = await diamondToken.getRegistryUsers();
        // console.log the identities
        console.log(identities);
    });

// get a claim
task("get-claim", "get a claim")
    .addParam("symbol", "symbol of diamond token")
    .addParam("identity", "identity to get claim from")
    .addParam("claimTopic", "claim topic to get")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // get the claim
        const claim = await diamondToken.getClaim(taskArgs.identity, taskArgs.claimTopic);
        // console.log the claim
        console.log(claim);
    });

// get claims
task("get-claims", "get claims")
    .addParam("symbol", "symbol of diamond token")
    .addParam("identity", "identity to get claims from")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // get the claims
        const claims = await diamondToken.getClaims(taskArgs.identity);
        // console.log the claims
        console.log(claims);
    });

// get claim topics
task("get-claim-topics", "get claim topics")
    .addParam("symbol", "symbol of diamond token")
    .addParam("identity", "identity to get claim topics from")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // get the claim topics
        const claimTopics = await diamondToken.getClaimTopics(taskArgs.identity);
        // console.log the claim topics
        console.log(claimTopics);
    });

// get onchain id from wallet
// get onchain id from wallet
task("get-onchain-id-from-wallet", "get onchain id from wallet")
    .addParam("symbol", "symbol of diamond token")
    .addParam("wallet", "wallet to get onchain id from")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // get the onchain id from wallet
        const onchainId = await diamondToken.getOnchainIDFromWallet(taskArgs.wallet);
        // console.log the onchain id from wallet
        console.log(onchainId);
    });

// wallet linked
task("wallet-linked", "wallet linked")
    .addParam("symbol", "symbol of diamond token")
    .addParam("onchainId", "onchain id to check if linked")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // check if wallet is linked
        const linked = await diamondToken.walletLinked(taskArgs.onchainId);
        // console.log the wallet linked
        console.log(linked);
    });

// unlink wallet
task("unlink-wallet", "unlink wallet")
    .addParam("symbol", "symbol of diamond token")
    .addParam("onchainId", "onchain id to unlink")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // unlink the wallet
        const tx = await diamondToken.unlinkWallet(taskArgs.onchainId);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
    });

// unlink wallet address
task("unlink-wallet-address", "unlink wallet address")
    .addParam("symbol", "symbol of diamond token")
    .addParam("wallet", "wallet to unlink")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // unlink the wallet address
        const tx = await diamondToken.unlinkWalletAddress(taskArgs.wallet);
        // wait for the tx to be mined
        const receipt = await tx.wait();
        // console.log the receipt
        console.log(receipt);
    });

// wallet address linked
task("wallet-address-linked", "wallet address linked")
    .addParam("symbol", "symbol of diamond token")
    .addParam("wallet", "wallet to check if linked")
    .setAction(async (taskArgs, hre) => {
        // get the diamond token
        const diamondToken = await getDiamondToken(hre, taskArgs.address);
        // check if wallet address is linked
        const linked = await diamondToken.walletAddressLinked(taskArgs.wallet);
        // console.log the wallet address linked
        console.log(linked);
    });
