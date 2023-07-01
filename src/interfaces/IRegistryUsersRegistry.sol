// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRegistryUsersRegistry {

    // events
    event RegistryUserAdded(address indexed registryUser);
    event RegistryUserRemoved(address indexed registryUser);
    event ClaimAdded(address indexed registryUser, uint256 indexed claimTopic, bytes claim);
    event ClaimRemoved(address indexed registryUser, uint256 indexed claimTopic);

    // functions
    // setters
    function addRegistryUser(address _registryUser) external;
    function removeRegistryUser(address _registryUser) external;
    function addClaim(address _registryUser, uint256 _claimTopic, bytes calldata _claim) external;
    function removeClaim(address _registryUser, uint256 _claimTopic) external;

    // getters
    function getRegistryUsers() external view returns (address[] memory);
    function isRegistryUser(address _registryUser) external view returns(bool);
    function getClaims(address _registryUser) external view returns(uint256[] memory);
    function getClaim(address _registryUser, uint256 _claimTopic) external view returns(bytes memory);
    function hasClaim(address _registryUser, uint256 _claimTopic) external view returns(bool);

}