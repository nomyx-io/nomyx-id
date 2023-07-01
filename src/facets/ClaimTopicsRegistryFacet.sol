// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IClaimTopicsRegistry.sol";
import "../libraries/ClaimTopicLib.sol";

contract ClaimTopicsRegistryFacet is IClaimTopicsRegistry {

    using ClaimTopicLib for ClaimTopicContract;

    modifier onlyOwner() {
        require(msg.sender == ClaimTopicLib.claimTopicStorage().owner, "Caller is not the owner");
        _;
    }

    constructor() {
        ClaimTopicStorage storage _contract = ClaimTopicLib.claimTopicStorage();
        _contract.owner = msg.sender;
    }

    function addClaimTopic(uint256 _claimTopic) external override onlyOwner {
        ClaimTopicContract storage _contract = ClaimTopicLib.claimTopicStorage()._contract;
        _contract.addClaimTopic(_claimTopic, msg.sender);
    }

    function removeClaimTopic(uint256 _claimTopic) external override onlyOwner {
        ClaimTopicContract storage _contract = ClaimTopicLib.claimTopicStorage()._contract;
        _contract.removeClaimTopic(_claimTopic, msg.sender);
    }

    function getClaimTopics() external view override returns (uint256[] memory) {
        ClaimTopicContract storage _contract = ClaimTopicLib.claimTopicStorage()._contract;
        return _contract.getClaimTopics();
    }

    function transferOwnershipOnClaimTopicsRegistryContract(address _newOwner) external override
    onlyOwner {
        require(_newOwner != address(0), "New owner is the zero address");
        ClaimTopicStorage storage _contract = ClaimTopicLib.claimTopicStorage();
        _contract.owner = _newOwner;
    }
}