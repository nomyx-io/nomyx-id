# Application Components

The application consists of a number of components implemented using a number of Solidity smart contracts. The components are:

IdentityDiamond.sol

facets/ERC735Facet.sol
facets/ERC734Facet.sol
facets/SVGTemplatesFacet.sol
facets/DiamondFacet.sol
facets/IdentityRegistryFacet.sol
facets/IdentityRegistryStorageFacet.sol
facets/ClaimIssuerFacet.sol
facets/ClaimTopicsRegistryFacet.sol

interfaces/IERC721Enumerable.sol
interfaces/IClaimTopicsRegistry.sol
interfaces/IToken.sol
interfaces/ITrustedIssuersRegistry.sol
interfaces/IDiamondFacetInit.sol
interfaces/ISVGFactory.sol
interfaces/IAttribute.sol
interfaces/IIdentityRegistryStorage.sol
interfaces/IMultiPart.sol
interfaces/IDiamondFactory.sol
interfaces/IDiamondInit.sol
interfaces/IDiamondCut.sol
interfaces/ISVG.sol
interfaces/IERC734.sol
interfaces/IERC735.sol
interfaces/IIdentity.sol
interfaces/IERC721Mint.sol
interfaces/IClaimIssuer.sol
interfaces/IRegistry.sol
interfaces/IMetadata.sol
interfaces/IDiamondLoupe.sol
interfaces/IIdentityRegistry.sol
interfaces/IDiamond.sol
interfaces/IControllable.sol
interfaces/IERC721A.sol
interfaces/IERC165.sol
interfaces/IERC173.sol
interfaces/IStrings.sol

libraries/ClaimStorageLib.sol
libraries/LibDiamond.sol
libraries/MetadataLib.sol
libraries/DiamondLib.sol
libraries/ERC721AEnumerationLib.sol
libraries/ERC721ALib.sol
libraries/UInt256Set.sol
libraries/StringsLib.sol
libraries/DiamondFactoryLib.sol
libraries/AttributeLib.sol
libraries/SVGTemplatesLib.sol

tokens/ERC721/ERC721AReceiverFacet.sol
tokens/ERC721/ERC721AAttributesFacet.sol
tokens/ERC721/ERC721AMetadataFacet.sol
tokens/ERC721/ERC721MinterFacet.sol
tokens/ERC721/ERC721EnumerableFacet.sol
tokens/ERC721/ERC721AFacet.sol

upgradeInitializers/DiamondInit.sol
upgradeInitializers/DynamicDiamondInit.sol

utilities/ReentrancyGuard.sol
utilities/MultipartData.sol
utilities/SVGManager.sol
utilities/SVGTemplate.sol
utilities/Controllable.sol
utilities/Modifiers.sol