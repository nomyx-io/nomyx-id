//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IClaimIssuer } from "../interfaces/IClaimIssuer.sol";
import { ITrustedIssuersRegistry, TrustedIssuer } from "../interfaces/ITrustedIssuersRegistry.sol";

struct TrustedIssuerContract {
    mapping(address => TrustedIssuer) trustedIssuers;
    address[] trustedIssuerAddresses;
    address owner;
}

struct TrustedIssuerStorage {
    TrustedIssuerContract trustedIssuerContract;
}

/// 
library TrustedIssuerLib {

    event TrustedIssuerUpdated(address indexed issuerAddress, TrustedIssuer trustedIssuer);

    bytes32 internal constant DIAMOND_STORAGE_POSITION = keccak256("diamond.nomyx.lenderlabs.TrustedIssuerStorage.storage");

    modifier onlyOwner() {
        require(msg.sender == trustedIssuerStorage().trustedIssuerContract.owner, "Caller is not the owner");
        _;
    }

    /// @notice Get the storage struct for the TrustedIssuerRegistry
    /// @return ds TrustedIssuerStorage struct for the TrustedIssuerRegistry
    function trustedIssuerStorage() internal pure returns (TrustedIssuerStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    /// @notice Get the trusted issuer struct given the trusted issuer address 
    /// @param issuerAddress The address of the trusted issuer
    /// @return trustedIssuer The trusted issuer struct
    function _getTrustedIssuer(
        TrustedIssuerContract storage,
        address issuerAddress
    ) internal view returns (TrustedIssuer memory trustedIssuer) {
        return trustedIssuerStorage().trustedIssuerContract.trustedIssuers[issuerAddress];
    }

    /// @notice Set the trusted issuer struct given the trusted issuer address
    /// @param self The TrustedIssuerContract storage struct
    /// @param issuerAddress The address of the trusted issuer
    /// @param trustedIssuer The trusted issuer struct
    function _setTrustedIssuer(
        TrustedIssuerContract storage self,
        address issuerAddress,
        TrustedIssuer memory trustedIssuer
    ) internal {
        if(self.trustedIssuers[issuerAddress].claimIssuer == address(0)) {
            self.trustedIssuerAddresses.push(issuerAddress);
        }
        self.trustedIssuers[issuerAddress] = trustedIssuer; 
        emit TrustedIssuerUpdated(issuerAddress, trustedIssuer);
    }

    /// @notice Add a trusted issuer
    /// @param _trustedIssuer The address of the trusted issuer
    /// @param _claimTopics The claim topics that the trusted issuer is allowed to issue
    function _addTrustedIssuer(
        TrustedIssuerContract storage,
        address _trustedIssuer, 
        uint[] calldata _claimTopics) internal {

        TrustedIssuer memory trustedIssuer = TrustedIssuer({
            claimIssuer: _trustedIssuer,
            claimTopics: _claimTopics
        });

        _setTrustedIssuer(
            trustedIssuerStorage().trustedIssuerContract,
            address(_trustedIssuer),
            trustedIssuer
        );
    }

    /// @notice Remove a trusted issuer
    /// @param self The TrustedIssuerContract storage struct
    /// @param _trustedIssuer The address of the trusted issuer
    function removeTrustedIssuer(TrustedIssuerContract storage self, address _trustedIssuer) internal {
        delete self.trustedIssuers[address(_trustedIssuer)];
    }

    /// @notice Update the claim topics that a trusted issuer is allowed to issue
    /// @param self The TrustedIssuerContract storage struct
    /// @param _trustedIssuer The address of the trusted issuer
    /// @param _claimTopics The claim topics that the trusted issuer is allowed to issue
    function updateIssuerClaimTopics(TrustedIssuerContract storage self, address _trustedIssuer, uint[] calldata _claimTopics) internal {
        TrustedIssuer memory trustedIssuer = _getTrustedIssuer(
            self,
            address(_trustedIssuer)
        );
        trustedIssuer.claimTopics = _claimTopics;
        _setTrustedIssuer(
            self,
            address(_trustedIssuer),
            trustedIssuer
        );
    }

    /// @notice Get the trusted issuers
    /// @param self The TrustedIssuerContract storage struct
    /// @return trustedIssuers The trusted issuers
    function getTrustedIssuers(TrustedIssuerContract storage self) internal view  returns (TrustedIssuer[] memory trustedIssuers) {
        trustedIssuers = new TrustedIssuer[](self.trustedIssuerAddresses.length);
        for (uint i = 0; i < self.trustedIssuerAddresses.length; i++) {
            trustedIssuers[i] = self.trustedIssuers[self.trustedIssuerAddresses[i]];
        }
    }

    /// @notice is the issuer trusted
    /// @param _issuer The address of the issuer
    /// @return isTrusted True if the issuer is trusted
    function isTrustedIssuer(address _issuer) internal view returns(bool isTrusted) {
        isTrusted = trustedIssuerStorage().trustedIssuerContract.trustedIssuers[_issuer].claimIssuer != address(0);
    }

    /// @notice Get the trusted issuer
    /// @param _trustedIssuer The trusted issuer
    /// @return trustedIssuer The trusted issuer
    function getTrustedIssuerClaimTopics(address _trustedIssuer) external view returns(uint[] memory) {
        return trustedIssuerStorage().trustedIssuerContract.trustedIssuers[address(_trustedIssuer)].claimTopics;
    }

    /// @notice Does this issuer have this claim topic
    /// @param _issuer The address of the issuer
    /// @param _claimTopic The claim topic
    /// @return hasTopic True if the issuer has this claim topic
    function hasClaimTopic(address _issuer, uint _claimTopic) external view returns(bool hasTopic) {
        uint[] memory claimTopics = trustedIssuerStorage().trustedIssuerContract.trustedIssuers[_issuer].claimTopics;
        for (uint i = 0; i < claimTopics.length; i++) {
            if (claimTopics[i] == _claimTopic) {
                return true;
            }
        }
        return false;
    }
}
