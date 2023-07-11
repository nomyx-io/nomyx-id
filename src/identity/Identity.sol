// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IIdentity } from "../interfaces/IIdentity.sol";
import { Controllable } from "../utilities/Controllable.sol";

/// @title Identity
/// @notice This contract represents an identity of a user
/// @dev This contract is used to store the claims of a user
contract Identity is IIdentity, Controllable {
	
	mapping(bytes32 => Key) keys;
	mapping(uint256 => bytes32[]) keysByPurpose;

	constructor() Controllable() {
		_addController(msg.sender);
	}

	struct Key {
		uint256[] purposes;
		uint256 keyType;
		bytes32 key;
	}

	function addKey(bytes32 _key, uint256 _purpose, uint256 _keyType) external override onlyController {
		require(keys[_key].key != _key, "Key already exists");

		keys[_key].key = _key;
		keys[_key].purposes.push(_purpose);
		keys[_key].keyType = _keyType;

		keysByPurpose[_purpose].push(_key);

		emit KeyAdded(_key, _purpose, _keyType);
	}

	function removeKey(bytes32 _key, uint256 _purpose) external override onlyController {
		require(keys[_key].key == _key, "No such key");
		for (uint i = 0; i < keys[_key].purposes.length; i++) {
			if (keys[_key].purposes[i] == _purpose) {
				delete keys[_key].purposes[i];
			}
		}

		emit KeyRemoved(_key, _purpose, keys[_key].keyType);

		delete keys[_key];
	}

	function getKey(
		bytes32 _key
	) external view override returns (uint256[] memory purposes, uint256 keyType, bytes32 key) {
		return (keys[_key].purposes, keys[_key].keyType, keys[_key].key);
	}

	function getKeyPurposes(bytes32 _key) external view override returns (uint256[] memory _purposes) {
		return (keys[_key].purposes);
	}

	function getKeysByPurpose(uint256 _purpose) external view override returns (bytes32[] memory _keys) {
		return (keysByPurpose[_purpose]);
	}

	function _keyHasPurpose(bytes32 _key, uint256 _purpose) internal view returns (bool exists) {
		if (keys[_key].key == 0) return false;
		for (uint i = 0; i < keys[_key].purposes.length; i++) {
			if (keys[_key].purposes[i] == _purpose) {
				return true;
			}
		}
		return false;
	}

	function keyHasPurpose(bytes32 _key, uint256 _purpose) external view returns (bool exists) {
		return _keyHasPurpose(_key, _purpose);
	}

	function execute(address _to, uint256 _value, bytes calldata _data) external payable onlyController returns (uint256 executionId) {
		require(_keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1), "Sender does not have rights");
		(bool success, ) = _to.call{value: _value}(_data);
		if (success) {
			emit Executed(executionId, _to, _value, _data);
		} else {
			emit ExecutionFailed(executionId, _to, _value, _data);
		}
		return executionId;
	}

	function approve(uint256 _id, bool _approve) external override onlyController {
		require(_keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 2), "Sender does not have rights");
		if (_approve) {
			emit Approved(_id, true);
		} else {
			emit Approved(_id, false);
		}
	}

	struct Claim {
		uint256 topic;
		uint256 scheme;
		address issuer;
		bytes signature;
		bytes data;
		string uri;
	}

	mapping(bytes32 => Claim) internal claims;
	bytes32[] internal claimIds;

	mapping(uint256 => bytes32[]) internal claimsByTopic;
	bytes32[] internal claimTopics;

	function getClaim(bytes32 _claimId)
		external
		view
		override
		returns (
			uint256 topic,
			uint256 scheme,
			address issuer,
			bytes memory signature,
			bytes memory data,
			string memory uri
		) {
		Claim storage claim = claims[_claimId];
		return (claim.topic, claim.scheme, claim.issuer, claim.signature, claim.data, claim.uri);
	}

	function getClaimIdsByTopic(uint256 _topic) external view override returns (bytes32[] memory claimIds_) {
		claimIds_ = claimsByTopic[_topic];
	}

	function addClaim(
		uint256 _topic,
		uint256 _scheme,
		address _issuer,
		bytes memory _signature,
		bytes memory _data,
		string memory _uri
	) external override onlyController returns (uint256 claimRequestId) {
		bytes32 claimId = keccak256(abi.encodePacked(_issuer, _topic));

		Claim storage claim = claims[claimId];
		claim.topic = _topic;
		claim.scheme = _scheme;
		claim.issuer = _issuer;
		claim.signature = _signature;
		claim.data = _data;
		claim.uri = _uri;

		claimsByTopic[_topic].push(claimId);
		claimTopics.push(claimId);

		claims[claimId] = claim;
		claimIds.push(claimId);

		emit ClaimAdded(claimId, _topic, _scheme, _issuer, _signature, _data, _uri);

		return _topic;
	}

	function changeClaim(
		bytes32,
		uint256,
		uint256,
		address,
		bytes memory,
		bytes memory,
		string memory
	) external pure override returns (bool) {
		require(false, "Not implemented");
	}

	function removeClaim(bytes32 _claimId) external override onlyController returns (bool success) {
		Claim storage claim = claims[_claimId];
		require(claim.issuer != address(0), "Claim does not exist");
		delete claims[_claimId];
		emit ClaimRemoved(_claimId, claim.topic, claim.scheme, claim.issuer, claim.signature, claim.data, claim.uri);
		return true;
	}

	function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
		return interfaceId == type(IIdentity).interfaceId;
	}

	function getExecution(
		uint256
	)
		external
		pure
		override
		returns (address, uint256, bytes memory, bool, uint256)
	{
		require(false, "Not implemented");
	}

	 function getClaimTopics() external view override returns (uint256[] memory) {
		 uint256[] memory _claimTopics = new uint256[](claimTopics.length);
		 for (uint256 i = 0; i < claimTopics.length; i++) {
			 _claimTopics[i] = claims[claimTopics[i]].topic;
		 }
		 return _claimTopics;
	 }

	 function isVerified() external view returns (bool) {}
}