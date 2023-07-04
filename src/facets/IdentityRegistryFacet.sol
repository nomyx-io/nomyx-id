// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IIdentityRegistry.sol";
import "../libraries/IdentityLib.sol";
import "../libraries/TrustedIssuerLib.sol";
import "../utilities/Modifiers.sol";

import "../interfaces/ITrustedIssuersRegistry.sol";
import "../interfaces/IClaimTopicsRegistry.sol";

import { IIdentityRegistry, IIdentity } from "../interfaces/IIdentityRegistry.sol";

/// @title IdentityRegistryFacet
/// @notice This contract manages the identity registry
/// @dev This contract is meant to be used via diamond proxy
contract IdentityRegistryFacet is IIdentityRegistry, Modifiers {
	using IdentityLib for IdentityContract;
    using TrustedIssuerLib for TrustedIssuerContract;

	event ContractAddressesSet();

	modifier isTrustedIssuer() {
		require(ITrustedIssuersRegistry(address(this)).isTrustedIssuer(msg.sender), "Not trusted issuer");
		_;
	}

	constructor() {}

	/// @notice add an identity to the registry
	/// @param _identity address of the identity
	/// @param identityData address of the identity data contract
    function _addIdentity(address _identity, IIdentity identityData) internal {
        IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
        Identity storage idObj = _contract._getIdentity(_identity);
        require(idObj.identityData == IIdentity(address(0)), "Identity already exists");
        idObj.identityData = identityData;
        _contract.identityOwners.push(_identity);
        emit IdentityAdded(_identity, identityData);
    }

	/// @notice add an identity to the registry
	/// @param _identity address of the identity contract
	/// @param identityData address of the identity data contract
	/// @dev this function can only be called by a trusted issuer
	function addIdentity(address _identity, IIdentity identityData) external override isTrustedIssuer {
       _addIdentity(_identity, identityData);
    }

	/// @notice remove an identity from the registry
	/// @param _identity address of the identity contract
	/// @dev this function can only be called by a trusted issuer
	function removeIdentity(address _identity) external override isTrustedIssuer {
        IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
        Identity storage idObj = _contract._getIdentity(_identity);
        require(idObj.identityData != IIdentity(address(0)), "Identity does not exist");
        delete _contract.identities[_identity];
        emit IdentityRemoved(_identity, idObj.identityData);
    }

	/// @notice get the identity data contract address of an identity
	/// @param _userAddress address of the identity user
	/// @return identityData address of the identity data contract
	function identity(address _userAddress) external view override returns (IIdentity) {
        IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
        return _contract._getIdentity(_userAddress).identityData;
    }

	/// @notice batch add identities to the registry
	/// @param _identities array of addresses of the identities
	/// @param identityDatas array of addresses of the identity data contracts
	/// @dev this function can only be called by a trusted issuer
	function batchAddIdentity(address[] calldata _identities, IIdentity[] calldata identityDatas) external override isTrustedIssuer {
        require(_identities.length == identityDatas.length, "Arrays length mismatch");
        for (uint256 i = 0; i < _identities.length; i++) {
            _addIdentity(_identities[i], identityDatas[i]);
        }
	}

	/// @notice add claim to an identity
	/// @param _identity address of the identity contract
	/// @param _claimTopic claim topic
	/// @param _claim claim data
	/// @dev this function can only be called by a trusted issuer
	function addClaim(address _identity, uint256 _claimTopic, bytes calldata _claim) external override isTrustedIssuer {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_identity);
		require(!idObj.claimTopics[_claimTopic], "Claim already exists");
		idObj.claims[_claimTopic] = _claim;
		idObj.claimTopics[_claimTopic] = true;
		emit ClaimAdded(_identity, _claimTopic, _claim);
	}

	/// @notice remove claim from an identity
	/// @param _identity address of the identity contract
	/// @param _claimTopic claim topic
	/// @dev this function can only be called by a trusted issuer
	function removeClaim(address _identity, uint256 _claimTopic) external override isTrustedIssuer {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_identity);
		require(idObj.claimTopics[_claimTopic], "Claim does not exist");
		delete idObj.claims[_claimTopic];
		delete idObj.claimTopics[_claimTopic];
		emit ClaimRemoved(_identity, _claimTopic);
	}

	/// @notice does an identity exist
	/// @param _userAddress address of the identity user
	/// @return bool
	function contains(address _userAddress) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract._getIdentity(_userAddress).identityData != IIdentity(address(0));
	}

	/// @notice is an identity verified
	/// @param _userAddress address of the identity user
	/// @return bool
	function isVerified(address _userAddress) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract._getIdentity(_userAddress).identityData.isVerified();
	}

	/// @notice get the users of the registry
	/// @return array of addresses of the users
	function getRegistryUsers() external view override returns (address[] memory) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract.identityOwners;
	}

	/// @notice is the user a registry user
	/// @param _registryUser address of the registry user
	/// @return bool
	function isRegistryUser(address _registryUser) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract._getIdentity(_registryUser).identityData != IIdentity(address(0));
	}

	/// @notice get the claims of an identity
	/// @param _registryUser address of the registry user
	/// @return array of claim topics
	function getClaims(address _registryUser) external view override returns (uint256[] memory) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_registryUser);
		uint256[] memory claims = new uint256[](idObj.identityData.getClaimTopics().length);
		for (uint256 i = 0; i < idObj.identityData.getClaimTopics().length; i++) {
			claims[i] = idObj.identityData.getClaimTopics()[i];
		}
		return claims;
	}

	/// @notice get the claim of an identity
	/// @param _registryUser address of the registry user
	/// @param _claimTopic claim topic
	/// @return claim data
	function getClaim(address _registryUser, uint256 _claimTopic) external view override returns (bytes memory) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_registryUser);
		return idObj.claims[_claimTopic];
	}

	/// @notice does an identity have a claim
	/// @param _registryUser address of the registry user
	/// @param _claimTopic claim topic
	/// @return bool
	function hasClaim(address _registryUser, uint256 _claimTopic) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		Identity storage idObj = _contract._getIdentity(_registryUser);
		return idObj.claimTopics[_claimTopic];
	}

	/// @notice get the onchain ID of an identity
	/// @param _userAddress address of the registry user
	/// @return onchainID onchain ID
	function getOnchainIDFromWallet(address _userAddress) external view override returns (bytes32) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract.addressToOnchainID[_userAddress];
	}

	/// @notice is the wallet linked to an onchain ID
	/// @return bool
	function walletLinked(bytes32) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract.identityAddresses.length > 0;
	}

	/// @notice get the wallet addresses of an onchain ID
	/// @param _onchainID onchain ID
	/// @dev this function can only be called by a trusted issuer
	function unlinkWallet(bytes32 _onchainID) external override isTrustedIssuer {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		require(_contract.identityAddresses.length > 0, "No linked wallet");
		address _walletAddress = _contract.identityAddresses[_contract.identityAddresses.length - 1];
		_contract.addressToOnchainID[_walletAddress] = bytes32(0);
		_contract.identityAddresses.pop();
		emit WalletUnlinked(_walletAddress, _onchainID);
	}

	/// @notice unlink a wallet address from an onchain ID
	/// @param _walletAddress address of the wallet
	/// @dev this function can only be called by a trusted issuer
	function unlinkWalletAddress(address _walletAddress) external override isTrustedIssuer {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		require(_contract.identityAddresses.length > 0, "No linked wallet");
		bytes32 _onchainID = _contract.addressToOnchainID[_walletAddress];
		_contract.addressToOnchainID[_walletAddress] = bytes32(0);
		_contract.identityAddresses.pop();
		emit WalletUnlinked(_walletAddress, _onchainID);
	}

	/// @notice link a wallet address to an onchain ID
	/// @param _walletAddress address of the wallet
	function walletAddressLinked(address _walletAddress) external view override returns (bool) {
		IdentityContract storage _contract = IdentityLib.identityStorage().identityContract;
		return _contract.addressToOnchainID[_walletAddress] != bytes32(0);
	}

}
