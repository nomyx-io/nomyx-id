// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IClaimTopicsRegistry.sol";

struct ClaimTopicContract {
    uint256[] claimTopics;
    mapping(uint256 => bool) claimTopicIndex;
}

struct ClaimTopicStorage {
    ClaimTopicContract _contract;
    address owner;
}

library ClaimTopicLib {

    event ClaimTopicAdded(uint256 indexed claimTopic);
    event ClaimTopicRemoved(uint256 indexed claimTopic);

    bytes32 internal constant DIAMOND_STORAGE_POSITION = 
        keccak256("diamond.standard.claimTopics.facet.contract");

    function claimTopicStorage() internal pure returns (ClaimTopicStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function addClaimTopic(
        ClaimTopicContract storage self,
        uint256 _claimTopic
    ) internal {
        self.claimTopics.push(_claimTopic);
        self.claimTopicIndex[_claimTopic] = true;
        emit ClaimTopicAdded(_claimTopic);
    }

    function removeClaimTopic(
        ClaimTopicContract storage self,
        uint256 _claimTopic
    ) internal {
        for (uint256 i; i < self.claimTopics.length; i++) {
            if (self.claimTopics[i] == _claimTopic) {
                self.claimTopics[i] = self.claimTopics[self.claimTopics.length - 1];
                self.claimTopics.pop();
                emit ClaimTopicRemoved(_claimTopic);
                return;
            }
        }
        self.claimTopicIndex[_claimTopic] = false;
        revert("Claim topic not found.");
    }

    function getClaimTopics(ClaimTopicContract storage self) internal view returns (uint256[] memory) {
        return self.claimTopics;
    }

    function hasClaimTopic(ClaimTopicContract storage self, uint256 _claimTopic) internal view returns (bool) {
        return self.claimTopicIndex[_claimTopic];
    }
}
