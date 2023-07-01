// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import { IIdentity } from "./IIdentity.sol";

interface IIdentityRegistry {
    // events
    event IdentityAdded(address indexed _address, IIdentity identity);
    event IdentityRemoved(address indexed _address, IIdentity identity);
    event IdentityCountryUpdated(address indexed identity, uint16 indexed country);
    event ClaimAdded(address indexed identity, uint256 indexed claimTopic, bytes claim);
    event ClaimRemoved(address indexed identity, uint256 indexed claimTopic);
    event WalletLinked(address indexed walletAddress, bytes32 indexed onchainID);
    event WalletUnlinked(address indexed walletAddress, bytes32 indexed onchainID);

    // functions
    function addIdentity(address _identity, IIdentity identityData) external;
    function batchAddIdentity(address[] calldata _identities, IIdentity[] calldata identityDatas) external;
    function removeIdentity(address _identity) external;
    function addClaim(address _identity, uint256 _claimTopic, bytes calldata _claim) external;
    function removeClaim(address _identity, uint256 _claimTopic) external;

    // registry consultation
    function contains(address _userAddress) external view returns (bool);
    function isVerified(address _userAddress) external view returns (bool);
    function identity(address _userAddress) external view returns (IIdentity);

    // getters
    function getRegistryUsers() external view returns (address[] memory);
    function isRegistryUser(address _registryUser) external view returns(bool);
    function getClaims(address _registryUser) external view returns(uint256[] memory);
    function getClaim(address _registryUser, uint256 _claimTopic) external view returns(bytes memory);
    function hasClaim(address _registryUser, uint256 _claimTopic) external view returns(bool);

    function getOnchainIDFromWallet(address _userAddress) external view returns (bytes32);
    function walletLinked(bytes32 _onchainID) external view returns (bool);
    function unlinkWallet(bytes32 _onchainID) external;
    function unlinkWalletAddress(address _walletAddress) external;
    function walletAddressLinked(address _walletAddress) external view returns (bool);
}