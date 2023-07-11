// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./identity/Identity.sol";

contract IdentityFactory {
    address private _template;

    event IdentityCreated(address indexed identity, address indexed owner);

    constructor() {
        _template = address(new Identity());
    }

    function createIdentity() public  {
        address addr = Clones.clone(_template);
        emit IdentityCreated(addr, msg.sender);
    }
}