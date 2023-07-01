// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IIdentity.sol";

struct Claim {
    uint256 topic;
    uint256 scheme;
    address issuer;
    bytes signature;
    bytes data;
    string uri;
    bool isRemoved;
}

interface IClaimIssuer is IIdentity {

    event ClaimRevoked(bytes indexed signature);

    function revokeClaim(bytes32 _claimId, address _identity) external returns(bool);
    function revokeClaimBySignature(bytes calldata signature) external;
    function isClaimRevoked(bytes calldata _sig) external view returns (bool);
    function isClaimValid(
        IIdentity _identity,
        uint256 claimTopic,
        bytes calldata sig,
        bytes calldata data)
    external view returns (bool);
    function getRecoveredAddress(bytes calldata sig, bytes32 dataHash) external pure returns (address);
    
}