// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IDiamondCut.sol";
import "./interfaces/IDiamondLoupe.sol";
import "./interfaces/IIdentity.sol";
import "./facets/IdentityRegistryFacet.sol";
import "./facets/ClaimIssuerFacet.sol";
import "./facets/ERC734Facet.sol";
import "./facets/ERC735Facet.sol";
import "./libraries/LibDiamond.sol";

contract IdentityDiamond {
    constructor(IDiamondCut.FacetCut[] memory _diamondCut) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.contractOwner = msg.sender;

        // Adding facets to diamond
        IDiamondCut.FacetCut[] memory facetCuts = new IDiamondCut.FacetCut[](4);
        
        facetCuts[0] = IDiamondCut.FacetCut({
            facetAddress: address(new IdentityRegistryFacet()),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: IdentityRegistryFacet.interfaceID.getSelectors()
        });
        
        facetCuts[1] = IDiamondCut.FacetCut({
            facetAddress: address(new ClaimIssuerFacet()),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: ClaimIssuerFacet.interfaceID.getSelectors()
        });

        facetCuts[2] = IDiamondCut.FacetCut({
            facetAddress: address(new ERC734Facet()),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: ERC734Facet.interfaceID.getSelectors()
        });

        facetCuts[3] = IDiamondCut.FacetCut({
            facetAddress: address(new ERC735Facet()),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: ERC735Facet.interfaceID.getSelectors()
        });

        LibDiamond.diamondCut(facetCuts, address(0), new bytes(0));
    }

    // Fallback function to execute delegated calls to the facets
    fallback() external payable {
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
        
        address facet = address(bytes20(ds.facets[bytes4(msg.data)]));
        require(facet != address(0), "Function does not exist");

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), facet, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)

            switch result
            case 0 {revert(ptr, size)}
            default {return(ptr, size)}
        }

        // LibDiamond.diamondStorage().fallbackDelegatecall();
    }
    // Other function implementations of IdentityDiamond (Ex: diamondCut, etc.)   
}
