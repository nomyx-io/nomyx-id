pragma solidity ^0.8.16;

import "./ERC735.sol";

interface IControlContract {
    
    struct Identity {
        uint256 userID;
        address wallet;
    }

    function addTrustedIssuer(IClaimIssuer _trustedIssuer, uint[] calldata _claimTopics) external override;


    // Administration/Management addition:
    function addTrustedIssuer(uint256 _TIID, address _trustedIssuer) public {
        trustedIssuers[_TIID] = _trustedIssuer;
    }

    function deleteTrustedIssuer(uint256 _TIID) public {
        delete trustedIssuers[_TIID];
    }

    function updateTrustedIssuer(uint256 _TIID, address _newTrustedIssuerAddress) public {
        trustedIssuers[_TIID] = _newTrustedIssuerAddress;
    }

    function getTrustedIssuers(uint256 _TIID) public view returns (address) {
        return trustedIssuers[_TIID];
    }

    mapping(address => Identity) public identities;
    mapping(uint256 => address) public trustedIssuers;

    // Investor Registration:
    function registerIdentity(uint256 _userID, address _wallet) public {
        identities[_wallet] = Identity(_userID, _wallet);
    }

    function updateIdentity(uint256 _userID, address _wallet) public {
        identities[_wallet].userID = _userID;
    }

    function deleteIdentity(address _wallet) public {
        delete identities[_wallet];
    }

    function viewIdentity(address _wallet) public view returns (uint256, address) {
        return (identities[_wallet].userID, identities[_wallet].wallet);
    }

    function isVerified(address _wallet) public view returns (bool) {
        // This function will require the implementation of a verification mechanism using ERC735 claims
        // For simplicity, this is left as a placeholder
    }

}