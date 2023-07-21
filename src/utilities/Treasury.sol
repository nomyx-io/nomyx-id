// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ITreasury } from "../interfaces/ITreasury.sol";
import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Treasury is ITreasury, Initializable, ReentrancyGuard {
    address private erc721aAddress;
    address private yieldTokenAddress;
    struct User {
        uint256 shares;
        uint256 balance;
        uint256 lastProfitPerShare;
    }

    mapping(address => User) public users;
    uint256 public totalShares = 0;
    uint256 public totalDeposited = 0;
    uint256 public profitPerShare = 0;

    function initialize(address _erc721aAddress, address _yieldTokenAddress) public initializer {
        erc721aAddress = _erc721aAddress;
        yieldTokenAddress = _yieldTokenAddress;
    }

    function deposit(uint256 amount) public payable override {
        // we need to withdraw the yield token from the user
        require(IERC20(yieldTokenAddress).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        totalDeposited += amount;
        if(totalShares > 0) {
            profitPerShare += amount / totalShares;
        }
    }

    function _join(uint256 shares) internal {
        User storage user = users[msg.sender];
        user.shares += shares;
        totalShares += shares;
        user.lastProfitPerShare = profitPerShare;
    }

    function _leave() internal {
        User storage user = users[msg.sender];
        totalShares -= user.shares;
        user.balance += user.shares * (profitPerShare - user.lastProfitPerShare);
        user.lastProfitPerShare = profitPerShare;
        user.shares = 0;
        // we need to transfer the yield token to the user
        require(IERC20(yieldTokenAddress).transfer(msg.sender, user.balance), "Transfer failed");
        user.balance = 0;
    }

    function claim() public override nonReentrant {
        User storage user = users[msg.sender];
        uint256 balanceOfERC721A = IERC721(erc721aAddress).balanceOf(msg.sender);
        require(balanceOfERC721A > 0, "You need to own ERC721A to claim");
        if(balanceOfERC721A != user.shares) {
            _leave();
            _join(balanceOfERC721A);
        }
        user.balance += user.shares * (profitPerShare - user.lastProfitPerShare);
        user.lastProfitPerShare = profitPerShare;
        // we need to transfer the yield token to the user
        require(IERC20(yieldTokenAddress).transfer(msg.sender, user.balance), "Transfer failed");
        user.balance = 0;
    }
}