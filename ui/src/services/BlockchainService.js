import { ethers } from "ethers";

import * as ClaimTopicsRegistry from "../abi/IClaimTopicsRegistry.json";
import * as IdentityRegistry from "../abi/IIdentityRegistry.json";
import * as TrustedIssuersRegistry from '../abi/ITrustedIssuersRegistry.json';

class BlockchainService {
    claimTopicsAbi = ClaimTopicsRegistry;
    identityRegistryAbi = IdentityRegistry;
    trustedIssuersRegistryAbi = TrustedIssuersRegistry;

    constructor(provider, contractAddress) {
        this.provider = new ethers.providers.JsonRpcProvider(provider);
        this.signer = this.provider.getSigner();

        this.claimTopicRegistryService = new ethers.Contract(contractAddress, this.claimTopicsAbi, this.provider);
        this.identityRegistryService = new ethers.Contract(contractAddress, this.identityRegistryAbi, this.provider);
        this.trustedIssuersRegistryService = new ethers.Contract(contractAddress, this.trustedIssuersRegistryAbi, this.provider);

        // Claim Topics Registry
        this.addClaimTopic = this.addClaimTopic.bind(this);
        this.removeClaimTopic = this.removeClaimTopic.bind(this);
        this.getClaimTopics = this.getClaimTopics.bind(this);

        // Identity Registry
        this.addIdentity = this.addIdentity.bind(this);
        this.batchAddIdentity = this.batchAddIdentity.bind(this);
        this.removeIdentity = this.removeIdentity.bind(this);
        this.addClaim = this.addClaim.bind(this);
        this.removeClaim = this.removeClaim.bind(this);
        this.contains = this.contains.bind(this);
        this.isVerified = this.isVerified.bind(this);
        this.identity = this.identity.bind(this);
        this.getRegistryUsers = this.getRegistryUsers.bind(this);
        this.isRegistryUser = this.isRegistryUser.bind(this);
        this.getClaims = this.getClaims.bind(this);
        this.getClaim = this.getClaim.bind(this);
        this.hasClaim = this.hasClaim.bind(this);
        this.getOnchainIDFromWallet = this.getOnchainIDFromWallet.bind(this);
        this.walletLinked = this.walletLinked.bind(this);
        this.unlinkWallet = this.unlinkWallet.bind(this);
        this.unlinkWalletAddress = this.unlinkWalletAddress.bind(this);
        this.walletAddressLinked = this.walletAddressLinked.bind(this);

        // Trusted Issuers Registry
        this.addTrustedIssuer = this.addTrustedIssuer.bind(this);
        this.removeTrustedIssuer = this.removeTrustedIssuer.bind(this);
        this.updateIssuerClaimTopics = this.updateIssuerClaimTopics.bind(this);
        this.getTrustedIssuers = this.getTrustedIssuers.bind(this);
        this.isTrustedIssuer = this.isTrustedIssuer.bind(this);
        this.getTrustedIssuerClaimTopics = this.getTrustedIssuerClaimTopics.bind(this);
        this.hasClaimTopic = this.hasClaimTopic.bind(this);
    }

    // Event listeners
    onClaimTopicAdded(callback) {
        this.claimTopicRegistryService.on("ClaimTopicAdded", (claimTopic) => {
            callback(claimTopic);
        });
    }

    onClaimTopicRemoved(callback) {
        this.claimTopicRegistryService.on("ClaimTopicRemoved", (claimTopic) => {
            callback(claimTopic);
        });
    }

    onTrustedIssuerAdded(callback) {
        this.trustedIssuersRegistryService.on("TrustedIssuerAdded", (trustedIssuer, claimTopics) => {
            callback(trustedIssuer, claimTopics);
        });
    }

    onTrustedIssuerRemoved(callback) {
        this.trustedIssuersRegistryService.on("TrustedIssuerRemoved", (trustedIssuer) => {
            callback(trustedIssuer);
        });
    }

    onClaimTopicsUpdated(callback) {
        this.trustedIssuersRegistryService.on("ClaimTopicsUpdated", (trustedIssuer, claimTopics) => {
            callback(trustedIssuer, claimTopics);
        });
    }

    onClaimRequested(callback) {
        this.trustedIssuersRegistryService.on("ClaimRequested", (claimRequestId, topic, scheme, issuer, signature, data, uri) => {
            callback(claimRequestId, topic, scheme, issuer, signature, data, uri);
        });
    }

    onClaimAdded(callback) {
        this.identityRegistryService.on("ClaimAdded", (claimId, topic, scheme, issuer, signature, data, uri) => {
            callback(claimId, topic, scheme, issuer, signature, data, uri);
        });
    }

    onClaimRemoved(callback) {
        this.identityRegistryService.on("ClaimRemoved", (claimId, topic, scheme, issuer, signature, data, uri) => {
            callback(claimId, topic, scheme, issuer, signature, data, uri);
        });
    }

    onIdentityAdded(callback) {
        this.trustedIssuersRegistryService.on("IdentityAdded", (address, identity) => {
            callback(address, identity);
        });
    }

    onIdentityRemoved(callback) {
        this.trustedIssuersRegistryService.on("IdentityRemoved", (address, identity) => {
            callback(address, identity);
        });
    }

    onIdentityCountryUpdated(callback) {
        this.trustedIssuersRegistryService.on("IdentityCountryUpdated", (identity, country) => {
            callback(identity, country);
        });
    }

    onClaimAdded(callback) {
        this.trustedIssuersRegistryService.on("ClaimAdded", (identity, claimTopic, claim) => {
            callback(identity, claimTopic, claim);
        });
    }

    onClaimRemoved(callback) {
        this.trustedIssuersRegistryService.on("ClaimRemoved", (identity, claimTopic) => {
            callback(identity, claimTopic);
        });
    }

    onWalletLinked(callback) {
        this.trustedIssuersRegistryService.on("WalletLinked", (walletAddress, onchainID) => {
            callback(walletAddress, onchainID);
        });
    }

    onWalletUnlinked(callback) {
        this.trustedIssuersRegistryService.on("WalletUnlinked", (walletAddress, onchainID) => {
            callback(walletAddress, onchainID);
        });
    }

    // Setters
    async addClaimTopic(claimTopic) {
        const contractWithSigner = this.claimTopicRegistryService.connect(this.signer);
        const tx = await contractWithSigner.addClaimTopic(claimTopic);
        await tx.wait();
    }

    async removeClaimTopic(claimTopic) {
        const contractWithSigner = this.claimTopicRegistryService.connect(this.signer);
        const tx = await contractWithSigner.removeClaimTopic(claimTopic);
        await tx.wait();
    }

    // Getter
    async getClaimTopics() {
        return await this.claimTopicRegistryService.getClaimTopics();
    }


    async addIdentity(identity, identityData) {
        const contract = this.identityRegistryService.connect(this.signer);
        const tx = await contract.addIdentity(identity, identityData);
        await tx.wait();
        return tx;
    }

    async batchAddIdentity(identities, identityDatas) {
        const contract = this.identityRegistryService.connect(this.signer);
        const tx = await contract.batchAddIdentity(identities, identityDatas);
        await tx.wait();
        return tx;
    }

    async removeIdentity(identity) {
        const contract = this.identityRegistryService.connect(this.signer);
        const tx = await contract.removeIdentity(identity);
        await tx.wait();
        return tx;
    }

    async addClaim(identity, claimTopic, claim) {
        const contract = this.identityRegistryService.connect(this.signer);
        const tx = await contract.addClaim(identity, claimTopic, claim);
        await tx.wait();
        return tx;
    }

    async removeClaim(identity, claimTopic) {
        const contract = this.identityRegistryService.connect(this.signer);
        const tx = await contract.removeClaim(identity, claimTopic);
        await tx.wait();
        return tx;
    }

    async contains(userAddress) {
        return await this.identityRegistryService.contains(userAddress);
    }

    async isVerified(userAddress) {
        return await this.identityRegistryService.isVerified(userAddress);
    }

    async identity(userAddress) {
        return await this.identityRegistryService.identity(userAddress);
    }

    async getRegistryUsers() {
        return await this.identityRegistryService.getRegistryUsers();
    }

    async isRegistryUser(registryUser) {
        return await this.identityRegistryService.isRegistryUser(registryUser);
    }

    async getClaims(registryUser) {
        return await this.identityRegistryService.getClaims(registryUser);
    }

    async getClaim(registryUser, claimTopic) {
        return this.identityRegistryService && await this.identityRegistryService.getClaim(registryUser, claimTopic);
    }

    async hasClaim(registryUser, claimTopic) {
        return await this.identityRegistryService.hasClaim(registryUser, claimTopic);
    }

    async getOnchainIDFromWallet(userAddress) {
        return await this.identityRegistryService.getOnchainIDFromWallet(userAddress);
    }

    async walletLinked(onchainID) {
        return await this.identityRegistryService.walletLinked(onchainID);
    }

    async unlinkWallet(onchainID) {
        const contract = this.identityRegistryService.connect(this.signer);
        const tx = await contract.unlinkWallet(onchainID);
        await tx.wait();
        return tx;
    }

    async unlinkWalletAddress(walletAddress) {
        const contract = this.identityRegistryService.connect(this.signer);
        const tx = await contract.unlinkWalletAddress(walletAddress);
        await tx.wait();
        return tx;
    }

    async walletAddressLinked(walletAddress) {
        return await this.identityRegistryService.walletAddressLinked(walletAddress);
    }

    async addTrustedIssuer(trustedIssuer, claimTopics) {
        const tx = await this.trustedIssuersRegistryService.addTrustedIssuer(trustedIssuer, claimTopics);
        await tx.wait();
        return tx;
    }

    async removeTrustedIssuer(trustedIssuer) {
        const tx = await this.trustedIssuersRegistryService.removeTrustedIssuer(trustedIssuer);
        await tx.wait();
        return tx;
    }

    async updateIssuerClaimTopics(trustedIssuer, claimTopics) {
        const tx = await this.trustedIssuersRegistryService.updateIssuerClaimTopics(trustedIssuer, claimTopics);
        await tx.wait();
        return tx;
    }

    async getTrustedIssuers() {
        return await this.trustedIssuersRegistryService.getTrustedIssuers();
    }

    async isTrustedIssuer(issuer) {
        return await this.trustedIssuersRegistryService.isTrustedIssuer(issuer);
    }

    async getTrustedIssuerClaimTopics(trustedIssuer) {
        return await this.trustedIssuersRegistryService.getTrustedIssuerClaimTopics(trustedIssuer);
    }

    async hasClaimTopic(issuer, claimTopic) {
        return await this.trustedIssuersRegistryService.hasClaimTopic(issuer, claimTopic);
    }
}

export default BlockchainService;
