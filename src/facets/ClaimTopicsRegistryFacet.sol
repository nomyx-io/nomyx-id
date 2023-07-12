// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IClaimTopicsRegistry.sol";
import "../libraries/ClaimTopicLib.sol";
import "../utilities/Modifiers.sol";

/// @title ClaimTopicsRegistryFacet
/// @notice This contract is used to manage the claim topics registry
contract ClaimTopicsRegistryFacet is IClaimTopicsRegistry, Modifiers {

    using ClaimTopicLib for ClaimTopicContract;

    constructor() {
        ClaimTopicStorage storage _contract = ClaimTopicLib.claimTopicStorage();
        _contract.owner = msg.sender;
    }

    /// @notice Add a claim topic
    /// @param _claimTopic The claim topic to add
    /// @dev Only the owner can call this function
    function addClaimTopic(uint256 _claimTopic) external override onlyOwner {
        ClaimTopicContract storage _contract = ClaimTopicLib.claimTopicStorage()._contract;
        require(!_contract.hasClaimTopic(_claimTopic), "Claim topic already exists");
        _contract.addClaimTopic(_claimTopic);
    }

    /// @notice Remove a claim topic
    /// @param _claimTopic The claim topic to remove
    /// @dev Only the owner can call this function
    function removeClaimTopic(uint256 _claimTopic) external override onlyOwner {
        ClaimTopicContract storage _contract = ClaimTopicLib.claimTopicStorage()._contract;
        require(_claimTopic != 0, "Cannot remove claim topic 0");
        require(_contract.hasClaimTopic(_claimTopic), "Claim topic does not exist");
        _contract.removeClaimTopic(_claimTopic);
    }

    /// @notice Get the claim topics
    /// @return claimTopics The claim topics
    function getClaimTopics() external view override returns (uint256[] memory) {
        ClaimTopicContract storage _contract = ClaimTopicLib.claimTopicStorage()._contract;
        return _contract.getClaimTopics();
    }

    function hasClaimTopic(uint256 _claimTopic) external view returns (bool) {
        ClaimTopicContract storage _contract = ClaimTopicLib.claimTopicStorage()._contract;
        return _contract.hasClaimTopic(_claimTopic);
    }

}