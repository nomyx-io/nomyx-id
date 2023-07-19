// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITreasury {
    function deposit(uint256 amount) external payable;
    function claim() external;
}