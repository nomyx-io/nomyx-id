//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

struct Claim {
    uint256 topic;
    uint256 scheme;
    address issuer;
    bytes signature;
    bytes data;
    string uri;
}