// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IClaimIssuer } from "./IClaimIssuer.sol";

struct TrustedIssuer {
    address claimIssuer;
    uint[] claimTopics;
}

interface ITrustedIssuersRegistry {

    // events
    event TrustedIssuerAdded(address indexed trustedIssuer, uint[] claimTopics);
    event TrustedIssuerRemoved(address indexed trustedIssuer);
    event ClaimTopicsUpdated(address indexed trustedIssuer, uint[] claimTopics);

    // functions
    // setters
    function addTrustedIssuer(address _trustedIssuer, uint[] calldata _claimTopics) external;
    function removeTrustedIssuer(address _trustedIssuer) external;
    function updateIssuerClaimTopics(address _trustedIssuer, uint[] calldata _claimTopics) external;

    // getters
    function getTrustedIssuers() external view returns (TrustedIssuer[] memory);
    function isTrustedIssuer(address _issuer) external view returns(bool);
    function getTrustedIssuerClaimTopics(address _trustedIssuer) external view returns(uint[] memory);
    function hasClaimTopic(address _issuer, uint _claimTopic) external view returns(bool);

}