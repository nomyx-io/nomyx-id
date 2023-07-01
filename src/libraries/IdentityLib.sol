// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import {IIdentity} from "../interfaces/IIdentity.sol";
import {IIdentityRegistry} from "../interfaces/IIdentityRegistry.sol";

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

library IdentityLib {

    bytes32 internal constant DIAMOND_STORAGE_POSITION = keccak256("diamond.nomyx.IdentityRegistryFacet.IdentityStorage");

    event IdentityAdded(address indexed _address, IIdentity identity);
    event IdentityRemoved(address indexed _address, IIdentity identity);

    function identityStorage() internal pure returns (IdentityStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    /// @notice get an Identity for an address
    function _getIdentity(
        IdentityContract storage,
        address _identityAddress
    ) internal view returns (Identity storage) {
        return identityStorage().identityContract.identities[_identityAddress];
    }

    /// @notice set an Identity for a tokenid keyed by string
    function _setIdentity(
        IdentityContract storage self,
        address _identityAddress,
        Identity storage identity
    ) internal {
        self.identities[_identityAddress].identityData = identity.identityData;
        self.identities[_identityAddress].country = identity.country;
        self.identityAddresses.push(_identityAddress);
        emit IdentityAdded(_identityAddress, identity.identityData);
    }

    /// @notice remove an Identity for an address
    function _removeIdentity(
        IdentityContract storage self,
        address _identityAddress
    ) internal {
        delete self.identities[_identityAddress];
        
        uint256 index;
        for (uint256 i = 0; i < self.identityAddresses.length; i++) {
            if (self.identityAddresses[i] == _identityAddress) {
                index = i;
                break;
            }
        }
        if (index != self.identityAddresses.length - 1) {
            self.identityAddresses[index] = self.identityAddresses[self.identityAddresses.length - 1];
        }
        self.identityAddresses.pop();
        emit IdentityRemoved(_identityAddress, self.identities[_identityAddress].identityData);
    }

}
