// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./identity/Identity.sol";
import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";


contract IdentityFactory is Initializable, Ownable {
    address private _template;
    address private _trustedIssuerRegistry;
    address private _identityRegistry;

    mapping(address => address) private _identities;
    address[] private _identityList;

    event IdentityCreated(address indexed owner, address indexed identity);

    constructor() {
        _template = address(new Identity());
    }

    /**
     * init the fdactory with the registries
     * @param identityRegistry the identity registry
     * @param trustedIssuerRegistry the trusted issuer registry
     */
    function initialize(address identityRegistry, address trustedIssuerRegistry) external initializer {
		_identityRegistry = identityRegistry;
		_trustedIssuerRegistry = trustedIssuerRegistry;
	}

    /** 
     * create a new identity
     */
    function createIdentity(address ownerAddress) public onlyOwner {
        require(ownerAddress != address(0), "Invalid owner address");
        require(address(_identities[ownerAddress]) == address(0), "Identity already exists");
        address addr = Clones.clone(_template);
        Identity(addr).initialize(ownerAddress, _identityRegistry, _trustedIssuerRegistry);
        _identities[ownerAddress] = addr;
        _identityList.push(addr);
        emit IdentityCreated(ownerAddress, addr);
    }

    /**
     * get the identity of an owner
     * @param owner the owner of the identity
     * @return the identity
     */
    function getIdentity(address owner) public view returns (address) {
        return _identities[owner];
    }

    /**
     * get the list of identities
     * @return the list of identities
     */
    function getIdentityUsers() public view returns (address[] memory) {
        return _identityList;
    }
}