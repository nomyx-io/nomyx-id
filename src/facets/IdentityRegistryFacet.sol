// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IIdentityRegistry.sol";
import "../libraries/IdentityLib.sol";
import "../libraries/TrustedIssuerLib.sol";
import "../utilities/Modifiers.sol";

import "../interfaces/ITrustedIssuersRegistry.sol";
import "../interfaces/IClaimTopicsRegistry.sol";

import { IIdentityRegistry, IIdentity } from "../interfaces/IIdentityRegistry.sol";

// insert previous contract structure
/*

struct Identity {
    IIdentity identityData;
    uint16 country;
    mapping(uint256 => bytes) claims;
    mapping(uint256 => bool) claimTopics;
}

struct IdentityContract {
    mapping(address => Identity) identities;
    address[] identityOwners;
    address[] identityAddresses;
    mapping(address => bytes32) addressToOnchainID;
}

struct IdentityStorage {
    IdentityContract identityContract;
}
*/

contract IdentityRegistryFacet is IIdentityRegistry, Modifiers {
	using IdentityLib for IdentityContract;
    using TrustedIssuerLib for TrustedIssuerContract;

	address private issuersRegistry;
	address private topicsRegistry;

	event ContractAddressesSet(address indexed _trustedIssuersRegistry, address indexed _claimTopicsRegistry);

	function setClaimTopicsRegistry(address _claimTopicsRegistry) external onlyOwner {
		topicsRegistry = address(_claimTopicsRegistry);
		emit ContractAddressesSet(address(issuersRegistry), _claimTopicsRegistry);
	}

	function setTrustedIssuersRegistry(address _trustedIssuersRegistry) external onlyOwner {
		issuersRegistry = address(_trustedIssuersRegistry);
		emit ContractAddressesSet(_trustedIssuersRegistry, address(topicsRegistry));
	}

    function _addIdentity(address _identity, IIdentity identityData) internal {
        IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
        Identity storage idObj = _contract._getIdentity(_identity);
        require(idObj.identityData == IIdentity(address(0)), "Identity already exists");
        idObj.identityData = identityData;
        _contract.identityOwners.push(_identity);
        emit IdentityAdded(_identity, identityData);
    }

	function addIdentity(address _identity, IIdentity identityData) external override {
       _addIdentity(_identity, identityData);
    }

	function removeIdentity(address _identity) external override {
        IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
        Identity storage idObj = _contract._getIdentity(_identity);
        require(idObj.identityData != IIdentity(address(0)), "Identity does not exist");
        delete _contract.identities[_identity];
        emit IdentityRemoved(_identity, idObj.identityData);
    }

	function identity(address _userAddress) external view override returns (IIdentity) {
        IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
        return _contract._getIdentity(_userAddress).identityData;
    }

	function batchAddIdentity(address[] calldata _identities, IIdentity[] calldata identityDatas) external override {
        require(_identities.length == identityDatas.length, "Arrays length mismatch");
        for (uint256 i = 0; i < _identities.length; i++) {
            _addIdentity(_identities[i], identityDatas[i]);
        }
	}

	function addClaim(address _identity, uint256 _claimTopic, bytes calldata _claim) external override {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
        TrustedIssuerContract storage _ticontract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_identity);
		require(_contract.isTrustedIssuer(msg.sender), "Not issuer");
        require(ITrustedIssuersRegistry(issuersRegistry).isTrustedIssuer(msg.sender), "Not trusted issuer");
        require(IClaimTopicsRegistry(topicsRegistry).isTrustedClaimTopic(_claimTopic), "Not trusted claim topic");
        idObj.claims[_claimTopic] = _claim;
	}

	function removeClaim(address _identity, uint256 _claimTopic) external override {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_identity);
		require(idObj.identityData.isIssuer(msg.sender), "Not issuer");
		delete idObj.claims[_claimTopic];
		delete idObj.claimTopics[_claimTopic];
		emit ClaimRemoved(_identity, _claimTopic);
	}

	function contains(address _userAddress) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract._getIdentity(_userAddress).identityData != IIdentity(address(0));
	}

	function isVerified(address _userAddress) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract._getIdentity(_userAddress).identityData.isVerified();
	}

	function getRegistryUsers() external view override returns (address[] memory) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract.identityOwners;
	}

	function isRegistryUser(address _registryUser) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract._getIdentity(_registryUser).identityData != IIdentity(address(0));
	}

	function getClaims(address _registryUser) external view override returns (uint256[] memory) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_registryUser);
		uint256[] memory claims = new uint256[](idObj.identityData.getClaimTopics().length);
		for (uint256 i = 0; i < idObj.identityData.getClaimTopics().length; i++) {
			claims[i] = idObj.identityData.getClaimTopics()[i];
		}
		return claims;
	}

	function getClaim(address _registryUser, uint256 _claimTopic) external view override returns (bytes memory) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_registryUser);
		return idObj.claims[_claimTopic];
	}

	function hasClaim(address _registryUser, uint256 _claimTopic) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_registryUser);
		return idObj.claimTopics[_claimTopic];
	}

	function getOnchainIDFromWallet(address _userAddress) external view override returns (bytes32) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract.addressToOnchainID[_userAddress];
	}

	function walletLinked(bytes32 _onchainID) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract.identityAddresses.length > 0;
	}

	function unlinkWallet(bytes32 _onchainID) external override {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		require(_contract.identityAddresses.length > 0, "No linked wallet");
		address _walletAddress = _contract.identityAddresses[_contract.identityAddresses.length - 1];
		_contract.addressToOnchainID[_walletAddress] = bytes32(0);
		_contract.identityAddresses.pop();
		emit WalletUnlinked(_walletAddress, _onchainID);
	}

	function unlinkWalletAddress(address _walletAddress) external override {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		require(_contract.identityAddresses.length > 0, "No linked wallet");
		bytes32 _onchainID = _contract.addressToOnchainID[_walletAddress];
		_contract.addressToOnchainID[_walletAddress] = bytes32(0);
		_contract.identityAddresses.pop();
		emit WalletUnlinked(_walletAddress, _onchainID);
	}

	function walletAddressLinked(address _walletAddress) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract.addressToOnchainID[_walletAddress] != bytes32(0);
	}

}
