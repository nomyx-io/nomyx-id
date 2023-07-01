// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IClaimIssuer } from "../interfaces/IClaimIssuer.sol";
import { ITrustedIssuersRegistry } from "../interfaces/ITrustedIssuersRegistry.sol";

import "../libraries/TrustedIssuerLib.sol";

contract TrustedIssuersFacet is ITrustedIssuersRegistry {
	using TrustedIssuerLib for TrustedIssuerContract;

	address public owner;
	IClaimIssuer[] public trustedIssuers;
	mapping(IClaimIssuer => uint[]) public trustedIssuerClaimTopics;

	modifier onlyOwner() {
		require(msg.sender == owner, "Caller is not the owner");
		_;
	}

	constructor() {
		owner = msg.sender;
	}

	function getTrustedIssuer(address issuerAddress) external view returns (TrustedIssuer memory) {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		return _contract._getTrustedIssuer(issuerAddress);
	}

	function setTrustedIssuer(address issuerAddress, TrustedIssuer memory trustedIssuer) external {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		_contract._setTrustedIssuer(issuerAddress, trustedIssuer);
	}

	function addTrustedIssuer(IClaimIssuer _trustedIssuer, uint[] calldata _claimTopics) external override onlyOwner {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		_contract._addTrustedIssuer(_trustedIssuer, _claimTopics);
	}

	function removeTrustedIssuer(IClaimIssuer _trustedIssuer) external override onlyOwner {
		TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
		_contract.removeTrustedIssuer(_trustedIssuer);
	}

	function updateIssuerClaimTopics(IClaimIssuer _trustedIssuer, uint[] calldata _claimTopics) external override {
        TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
        _contract.updateIssuerClaimTopics(_trustedIssuer, _claimTopics);
    }

	function getTrustedIssuers() external view override returns (IClaimIssuer[] memory) {
        TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
        return _contract.getTrustedIssuers();
    }

	function isTrustedIssuer(address _issuer) external view override returns (bool) {
        TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
        return _contract.isTrustedIssuer(_issuer);
    }

	function getTrustedIssuerClaimTopics(IClaimIssuer _trustedIssuer) external view override returns (uint[] memory) {
        TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
        return _contract.getTrustedIssuerClaimTopics(_trustedIssuer);
    }

	function hasClaimTopic(address _issuer, uint _claimTopic) external view override returns (bool) {
        TrustedIssuerContract storage _contract = TrustedIssuerLib.trustedIssuerStorage().trustedIssuerContract;
        return _contract.hasClaimTopic(_issuer, _claimTopic);
    }
}
