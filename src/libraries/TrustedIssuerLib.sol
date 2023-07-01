//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IClaimIssuer } from "../interfaces/IClaimIssuer.sol";
import { ITrustedIssuersRegistry } from "../interfaces/ITrustedIssuersRegistry.sol";

struct TrustedIssuer {
    IClaimIssuer claimIssuer;
    uint[] claimTopics;
}

struct TrustedIssuerContract {
    mapping(address => TrustedIssuer) trustedIssuers;
    address owner;
}

struct TrustedIssuerStorage {
    TrustedIssuerContract trustedIssuerContract;
}

library TrustedIssuerLib {

    event TrustedIssuerUpdated(address indexed issuerAddress, TrustedIssuer trustedIssuer);

    bytes32 internal constant DIAMOND_STORAGE_POSITION = keccak256("diamond.nomyx.lenderlabs.TrustedIssuerStorage.storage");

    modifier onlyOwner() {
        require(msg.sender == trustedIssuerStorage().trustedIssuerContract.owner, "Caller is not the owner");
        _;
    }

    function trustedIssuerStorage() internal pure returns (TrustedIssuerStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function _getTrustedIssuer(
        TrustedIssuerContract storage,
        address issuerAddress
    ) internal view returns (TrustedIssuer memory) {
        return trustedIssuerStorage().trustedIssuerContract.trustedIssuers[issuerAddress];
    }

    function _setTrustedIssuer(
        TrustedIssuerContract storage self,
        address issuerAddress,
        TrustedIssuer memory trustedIssuer
    ) internal {
        self.trustedIssuers[issuerAddress] = trustedIssuer;
        emit TrustedIssuerUpdated(issuerAddress, trustedIssuer);
    }

    function _addTrustedIssuer(
        TrustedIssuerContract storage,
        IClaimIssuer _trustedIssuer, 
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

    function removeTrustedIssuer(TrustedIssuerContract storage self, IClaimIssuer _trustedIssuer) internal {
        delete self.trustedIssuers[address(_trustedIssuer)];
    }

    function updateIssuerClaimTopics(TrustedIssuerContract storage self, IClaimIssuer _trustedIssuer, uint[] calldata _claimTopics) internal {

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

    function getTrustedIssuers(TrustedIssuerContract storage self) internal view  returns (IClaimIssuer[] memory) {
        IClaimIssuer[] memory trustedIssuers = new IClaimIssuer[](self.trustedIssuers.length);
        for (uint i = 0; i < self.trustedIssuers.length; i++) {
            trustedIssuers[i] = self.trustedIssuers[i].claimIssuer;
        }
        return trustedIssuers;
    }

    function isTrustedIssuer(address _issuer) internal view returns(bool) {
        return trustedIssuerStorage().trustedIssuerContract.trustedIssuers[_issuer].claimIssuer != IClaimIssuer(address(0));
    }

    function getTrustedIssuerClaimTopics(IClaimIssuer _trustedIssuer) external view returns(uint[] memory) {
        return trustedIssuerStorage().trustedIssuerContract.trustedIssuers[address(_trustedIssuer)].claimTopics;
    }

    function hasClaimTopic(address _issuer, uint _claimTopic) external view returns(bool) {
        uint[] memory claimTopics = trustedIssuerStorage().trustedIssuerContract.trustedIssuers[_issuer].claimTopics;
        for (uint i = 0; i < claimTopics.length; i++) {
            if (claimTopics[i] == _claimTopic) {
                return true;
            }
        }
        return false;
    }
}
