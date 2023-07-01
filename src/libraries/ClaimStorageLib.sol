// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import { Claim } from "../interfaces/IClaimIssuer.sol";

struct ClaimStorage {
    mapping(bytes32 => Claim) claims;
}

library ClaimStorageLib {

    using Strings for uint256;
    using Address for address;

    bytes32 internal constant DIAMOND_STORAGE_POSITION = keccak256("diamond.nomyx.app.Claim.storage");

    function claimStorage() internal pure returns (ClaimStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function getClaim(bytes32 _claimId) internal view returns (Claim memory) {
        return claimStorage().claims[_claimId];
    }

}