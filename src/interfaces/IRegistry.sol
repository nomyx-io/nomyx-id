// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRegistry {
    function addIdentity(address _identity) external returns (bool success);
    function removeIdentity(address _identity) external returns (bool success);
    function checkIdentity(address _identity) external view returns (bool exists);
}