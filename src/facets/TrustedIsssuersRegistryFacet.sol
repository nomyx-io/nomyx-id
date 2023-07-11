// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IClaimIssuer } from "../interfaces/IClaimIssuer.sol";
import { ITrustedIssuersRegistry } from "../interfaces/ITrustedIssuersRegistry.sol";
import { Modifiers } from "../utilities/Modifiers.sol";

import "../libraries/TrustedIssuerLib.sol";

/// @title TrustedIssuersRegistryFacet
/// @notice This contract is used to manage the trusted issuers registry
contract TrustedIssuersRegistryFacet is ITrustedIssuersRegistry, Modifiers {
	using TrustedIssuerLib for TrustedIssuerContract;

	/// @notice get the trusted issuer struct given the trusted issuer address
	/// @param issuerAddress The address of the trusted issuer
	/// @return trustedIssuer The trusted issuer struct
	function getTrustedIssuer(address issuerAddress) external view returns (TrustedIssuer memory) {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		return _contract._getTrustedIssuer(issuerAddress);
	}

	function setTrustedIssuer(address issuerAddress, TrustedIssuer memory trustedIssuer) external {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		_contract._setTrustedIssuer(issuerAddress, trustedIssuer);
	}

	function addTrustedIssuer(address _trustedIssuer, uint[] calldata _claimTopics) external onlyOwner {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		_contract._addTrustedIssuer(_trustedIssuer, _claimTopics);
	}

	function removeTrustedIssuer(address _trustedIssuer) external onlyOwner {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		_contract.removeTrustedIssuer(_trustedIssuer);
	}

	function updateIssuerClaimTopics(address _trustedIssuer, uint[] calldata _claimTopics) external {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		_contract.updateIssuerClaimTopics(_trustedIssuer, _claimTopics);
	}

	function getTrustedIssuers() external view override returns (TrustedIssuer[] memory) {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		return _contract.getTrustedIssuers();
	}

	function isTrustedIssuer(address _issuer) external view override returns (bool) {
		return TrustedIssuerLib.isTrustedIssuer(_issuer);
	}

	function getTrustedIssuerClaimTopics(address _trustedIssuer) external view returns (uint[] memory) {
		return TrustedIssuerLib.getTrustedIssuerClaimTopics(_trustedIssuer);
	}

	function hasClaimTopic(address _issuer, uint _claimTopic) external view override returns (bool) {
		return TrustedIssuerLib.hasClaimTopic(_issuer, _claimTopic);
	}
}
