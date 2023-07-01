//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IThing } from "./IThing.sol";

struct Thing {
//...
}

struct ThingContract {
    mapping(uint256 => Thing) things;
}

struct ThingStorage {
    ThingContract thingContract;
}

library ThingLib {

    event ThingSet(address indexed address, Thing thing);

    bytes32 internal constant DIAMOND_STORAGE_POSITION = keccak256("diamond.nomyx.lenderlabs.ThingStorage.storage");

    function thingStorage() internal pure returns (ThingStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    /// @notice set an Thing for a tokenid keyed by string
    function _getThing(
        ThingContract storage self,
        uint256 thingId
    ) internal view returns (Thing memory) {
        return metadataStorage().thingContract.things[thingId];
    }

    /// @notice set an Thing for a tokenid keyed by string
    function _setThing(
        ThingContract storage self,
        uint256 thingId,
        Thing memory thing
    ) internal {
        self.things[thingId] = thing;
        emit ThingSet(address(this), thing);
    }

}

contract ThingFacet is Modifiers {

    using ThingLib for MetadataContract;

    function getThing(uint256 thingId) external view returns (Thing memory) {
        ThingContract storage contract = ThingLib.thingStorage().things;
        return contract._getThing(thingId);
    }

    function setThing(uint256 thingId, Thing memory thing) external {
        ThingContract storage contract = ThingLib.thingStorage().things;
        contract._setThing(thingId, thing);
    }

}