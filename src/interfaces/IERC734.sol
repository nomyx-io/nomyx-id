// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IERC165 } from "./IERC165.sol";

interface IERC734 is IERC165 {
    // events
    event KeyAdded(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);
    event KeyRemoved(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);
    event ExecutionRequested(
        uint256 indexed executionId,
        address indexed to,
        uint256 indexed value,
        bytes data
    );
    event Executed(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
    event ExecutionFailed(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
    event Approved(uint256 indexed executionId, bool approved);

    // functions
    // setters
    function addKey(bytes32 _key, uint256 _purpose, uint256 _keyType) external;
    function removeKey(bytes32 _key, uint256 _purpose) external;
    function approve(uint256 _id, bool _approve) external;

    // getters
    function getKey(bytes32 _key) external view returns(uint256[] memory purposes, uint256 keyType, bytes32 key);
    function getKeyPurposes(bytes32 _key) external view returns(uint256[] memory);
    function getKeysByPurpose(uint256 _purpose) external view returns(bytes32[] memory);
    function getExecution(uint256 _id) external view returns(address to, uint256 value, bytes memory data, bool approved, uint256 executionType);
}
