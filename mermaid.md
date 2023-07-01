1. IdentityDiamond.sol: The main contract for managing identity attributes using the diamond structure.
2. facets/*: A collection of contracts for different functionalities of the identity diamond, including ERC735 for managing claims and ERC734 for managing key-value data.
3. interfaces/*: Includes abstract contracts defining specific functionalities or standards they follow like ERC721 (for non-fungible tokens), ERC735 and ERC734 (for claims and keys), and diamond standards. 
4. libraries/*: Libraries include reusable pieces of code dealing with data structures, contract storage, NFT metadata and attribute management. 
5. tokens/ERC721/*: A collection of contracts implementing ERC721 token standard with additional functionalities like attribute management and metadata.
6. upgradeInitializers/*: Responsible for initializing the upgrade of the diamond, including defining how to add, replace, or remove a diamonds functions. 
7. utilities/*: Contains helper contracts providing utility functionalities like reentrancy protection, multipart data handling, and SVG management.

1. IdentityDiamond.sol: A Solidity smart contract that forms the core of the identity management system.
2. facets/ERC735Facet.sol: Implements the ERC735 standard, dealing with the management of identity claims.
3. facets/ERC734Facet.sol: Implements the ERC734 standard, dealing with the management of key-value data related to identities.
4. facets/SVGTemplatesFacet.sol: Responsible for handling vector graphics templates associated with identities.
5. facets/DiamondFacet.sol: Implements features specific to the diamond structure of smart contracts in the application.
6. facets/IdentityRegistryFacet.sol: Manages the registry of identities in the system.
7. facets/IdentityRegistryStorageFacet.sol: Manages data storage related to the identity registry.
8. facets/ClaimIssuerFacet.sol: Handles the issuance of claim certificates for identities.
9. facets/ClaimTopicsRegistryFacet.sol: Manages the registry of topic-specific claims.
10. interfaces/IERC721Enumerable.sol: Interface for the ERC-721 standard for non-fungible tokens, with enumeration related functions.
11. interfaces/IClaimTopicsRegistry.sol: Specifies functionalities related to the registry of claim topics.
12. interfaces/IToken.sol: Outlines the basic functionalities expected from a token in the system.
13. interfaces/ITrustedIssuersRegistry.sol: Specifies functionalities related to the registry of trusted claim issuers.
14. interfaces/IDiamondFacetInit.sol: Interface that outlines the initial setting up functionalities of diamond facets in the system.
15. interfaces/ISVGFactory.sol: Specifies functions to facilitate SVG object creation.
16. interfaces/IAttribute.sol: Outlines functions related to attributes of an identity.
17. interfaces/IIdentityRegistryStorage.sol: Specifies functionalities related to identity registry storage.
18. interfaces/IMultiPart.sol: Outlines functionalities for handling multipart data.
19. interfaces/IDiamondFactory.sol: Specifies functionalities for diamond factory.
20. interfaces/IDiamondInit.sol: Specifies functions for initial setting up of a diamond.
21. interfaces/IDiamondCut.sol: Outlines functions related to diamond cut.
22. interfaces/ISVG.sol: Specifies functions related to SVG.
23. interfaces/IERC734.sol: Interface for the ERC734 standard.
24. interfaces/IERC735.sol: Interface for the ERC735 standard.
25. interfaces/IIdentity.sol: Specifies basic functions for an identity.
26. interfaces/IERC721Mint.sol: Interface for mint function of ERC721 tokens.
27. interfaces/IClaimIssuer.sol: Outlines functionalities for issuing a claim.
28. interfaces/IRegistry.sol: Outlines a standard registry functionality. 
29. interfaces/IMetadata.sol: Outlines set of functions dealing with metadata.
30. interfaces/IDiamondLoupe.sol: Specifies diamond loupe functions.
31. interfaces/IIdentityRegistry.sol: Outlines functions related to identity registry.
32. interfaces/IDiamond.sol: Specifies functionalities of a diamond system.
33. interfaces/IControllable.sol: Specifies functionalities for controlling a contract.
34. interfaces/IERC721A.sol: Outlines functions related to ERC721A standard.
35. interfaces/IERC165.sol: Interface for the ERC-165 standard for better contract inspection and interaction.
36. interfaces/IERC173.sol: Interface for the ERC-173 standard for ownership of contracts.
37. interfaces/IStrings.sol: Specifies string operations.
38. libraries/ClaimStorageLib.sol: Library offering utility functions related to claim storage.
39. libraries/LibDiamond.sol: Utilities for managing Diamond Pattern based contracts.
40. libraries/MetadataLib.sol: Provides functionalities for dealing with metadata.
41. libraries/DiamondLib.sol: Additional library with tools for managing Diamond structure.
42. libraries/ERC721AEnumerationLib.sol: Directory with utilities for enumerating ERC721A tokens.
43. libraries/ERC721ALib.sol: Library for ERC-721 standard tokens.
44. libraries/UInt256Set.sol: Provides utilities for managing sets of unsigned integer (uint256) data.
45. libraries/StringsLib.sol: Utilities for handling string data.
46. libraries/DiamondFactoryLib.sol: Provides utility functions for diamond factory management.
47. libraries/AttributeLib.sol: Provides utility functions for attribute management.
48. libraries/SVGTemplatesLib.sol: Provides utility functions for managing SVG templates.
49. tokens/ERC721/ERC721AReceiverFacet.sol: Handles the receiving mechanism for ERC721A tokens.
50. tokens/ERC721/ERC721AAttributesFacet.sol: Manages attributes for ERC721A tokens.
51. tokens/ERC721/ERC721AMetadataFacet.sol: Handles metadata-related functionalities for ERC721A tokens.
52. tokens/ERC721/ERC721MinterFacet.sol: Provides the minting functionality for ERC721A tokens.
53. tokens/ERC721/ERC721EnumerableFacet.sol: Adds enumerable functionality to ERC721A tokens.
54. tokens/ERC721/ERC721AFacet.sol: Main contract for managing ERC721A tokens.
55. upgradeInitializers/DiamondInit.sol: Contract to initialize the diamond structure upgrade.
56. upgradeInitializers/DynamicDiamondInit.sol: Contract used to dynamically initialize the diamond structure upgrade.
57. utilities/ReentrancyGuard.sol: Provides a way to prevent a contract from being reentereuring a function call.
58. utilities/MultipartData.sol: Helps in dealing with multipart data.
59. utilities/SVGManager.sol: Handles operations related to SVG.
60. utilities/SVGTemplate.sol: Contract for managing SVG templates.
61. utilities/Controllable.sol: Provides the functionality for controlling a contract.
62. utilities/Modifiers.sol: Contains Solidity modifiers for adding certain behaviors to functions, such as limiting access.

## Target App

We are building an identity registry service where a central authority can empower agents to issue claims on behalf of the authority. The claims are stored on the blockchain and can be used by the identity owner to prove their identity to other parties. The identity owner can also use the claims to prove their identity to the central authority and request for a new claim to be issued. The central authority can also revoke claims issued by agents.

## User Stories
Please list out all the high-level actions that a user can perform in the application and for each high-level action generate a mermaid sequence diagram. The sequence diagram should include all the smart contracts that are involved in the action. You can use the following template to generate the sequence diagram.

dentityDiamond.sol: The main contract for managing identity attributes using the diamond structure.
2. facets/*: A collection of contracts for different functionalities of the identity diamond, including ERC735 for managing claims and ERC734 for managing key-value data.
3. interfaces/*: Includes abstract contracts defining specific functionalities or standards they follow like ERC721 (for non-fungible tokens), ERC735 and ERC734 (for claims and keys), and diamond standards. 
4. libraries/*: Libraries include reusable pieces of code dealing with data structures, contract storage, NFT metadata and attribute management. 
5. tokens/ERC721/*: A collection of contracts implementing ERC721 token standard with additional functionalities like attribute management and metadata.
6. upgradeInitializers/*: Responsible for initializing the upgrade of the diamond, including defining how to add, replace, or remove a diamonds functions. 
7. utilities/*: Contains helper contracts providing utility functionalities like reentrancy protection, multipart data handling, and SVG management.

1. IdentityDiamond.sol: A Solidity smart contract that forms the core of the identity management system.
2. facets/ERC735Facet.sol: Implements the ERC735 standard, dealing with the management of identity claims.
3. facets/ERC734Facet.sol: Implements the ERC734 standard, dealing with the management of key-value data related to identities.
4. facets/SVGTemplatesFacet.sol: Responsible for handling vector graphics templates associated with identities.
5. facets/DiamondFacet.sol: Implements features specific to the diamond structure of smart contracts in the application.
6. facets/IdentityRegistryFacet.sol: Manages the registry of identities in the system.
7. facets/IdentityRegistryStorageFacet.sol: Manages data storage related to the identity registry.
8. facets/ClaimIssuerFacet.sol: Handles the issuance of claim certificates for identities.
9. facets/ClaimTopicsRegistryFacet.sol: Manages the registry of topic-specific claims.
10. interfaces/IERC721Enumerable.sol: Interface for the ERC-721 standard for non-fungible tokens, with enumeration related functions.
11. interfaces/IClaimTopicsRegistry.sol: Specifies functionalities related to the registry of claim topics.
12. interfaces/IToken.sol: Outlines the basic functionalities expected from a token in the system.
13. interfaces/ITrustedIssuersRegistry.sol: Specifies functionalities related to the registry of trusted claim issuers.
14. interfaces/IDiamondFacetInit.sol: Interface that outlines the initial setting up functionalities of diamond facets in the system.
15. interfaces/ISVGFactory.sol: Specifies functions to facilitate SVG object creation.
16. interfaces/IAttribute.sol: Outlines functions related to attributes of an identity.
17. interfaces/IIdentityRegistryStorage.sol: Specifies functionalities related to identity registry storage.
18. interfaces/IMultiPart.sol: Outlines functionalities for handling multipart data.
19. interfaces/IDiamondFactory.sol: Specifies functionalities for diamond factory.
20. interfaces/IDiamondInit.sol: Specifies functions for initial setting up of a diamond.
21. interfaces/IDiamondCut.sol: Outlines functions related to diamond cut.
22. interfaces/ISVG.sol: Specifies functions related to SVG.
23. interfaces/IERC734.sol: Interface for the ERC734 standard.
24. interfaces/IERC735.sol: Interface for the ERC735 standard.
25. interfaces/IIdentity.sol: Specifies basic functions for an identity.
26. interfaces/IERC721Mint.sol: Interface for mint function of ERC721 tokens.
27. interfaces/IClaimIssuer.sol: Outlines functionalities for issuing a claim.
28. interfaces/IRegistry.sol: Outlines a standard registry functionality. 
29. interfaces/IMetadata.sol: Outlines set of functions dealing with metadata.
30. interfaces/IDiamondLoupe.sol: Specifies diamond loupe functions.
31. interfaces/IIdentityRegistry.sol: Outlines functions related to identity registry.
32. interfaces/IDiamond.sol: Specifies functionalities of a diamond system.
33. interfaces/IControllable.sol: Specifies functionalities for controlling a contract.
34. interfaces/IERC721A.sol: Outlines functions related to ERC721A standard.
35. interfaces/IERC165.sol: Interface for the ERC-165 standard for better contract inspection and interaction.
36. interfaces/IERC173.sol: Interface for the ERC-173 standard for ownership of contracts.
37. interfaces/IStrings.sol: Specifies string operations.
38. libraries/ClaimStorageLib.sol: Library offering utility functions related to claim storage.
39. libraries/LibDiamond.sol: Utilities for managing Diamond Pattern based contracts.
40. libraries/MetadataLib.sol: Provides functionalities for dealing with metadata.
41. libraries/DiamondLib.sol: Additional library with tools for managing Diamond structure.
42. libraries/ERC721AEnumerationLib.sol: Directory with utilities for enumerating ERC721A tokens.
43. libraries/ERC721ALib.sol: Library for ERC-721 standard tokens.
44. libraries/UInt256Set.sol: Provides utilities for managing sets of unsigned integer (uint256) data.
45. libraries/StringsLib.sol: Utilities for handling string data.
46. libraries/DiamondFactoryLib.sol: Provides utility functions for diamond factory management.
47. libraries/AttributeLib.sol: Provides utility functions for attribute management.
48. libraries/SVGTemplatesLib.sol: Provides utility functions for managing SVG templates.
49. tokens/ERC721/ERC721AReceiverFacet.sol: Handles the receiving mechanism for ERC721A tokens.
50. tokens/ERC721/ERC721AAttributesFacet.sol: Manages attributes for ERC721A tokens.
51. tokens/ERC721/ERC721AMetadataFacet.sol: Handles metadata-related functionalities for ERC721A tokens.
52. tokens/ERC721/ERC721MinterFacet.sol: Provides the minting functionality for ERC721A tokens.
53. tokens/ERC721/ERC721EnumerableFacet.sol: Adds enumerable functionality to ERC721A tokens.
54. tokens/ERC721/ERC721AFacet.sol: Main contract for managing ERC721A tokens.
55. upgradeInitializers/DiamondInit.sol: Contract to initialize the diamond structure upgrade.
56. upgradeInitializers/DynamicDiamondInit.sol: Contract used to dynamically initialize the diamond structure upgrade.
57. utilities/ReentrancyGuard.sol: Provides a way to prevent a contract from being reentereuring a function call.
58. utilities/MultipartData.sol: Helps in dealing with multipart data.
59. utilities/SVGManager.sol: Handles operations related to SVG.
60. utilities/SVGTemplate.sol: Contract for managing SVG templates.
61. utilities/Controllable.sol: Provides the functionality for controlling a contract.
62. utilities/Modifiers.sol: Contains Solidity modifiers for adding certain behaviors to functions, such as limiting access.

## Target App

We are building an identity registry service where a central authority can empower agents to issue claims on behalf of the authority. The claims are stored on the blockchain and can be used by the identity owner to prove their identity to other parties. The identity owner can also use the claims to prove their identity to the central authority and request for a new claim to be issued. The central authority can also revoke claims issued by agents.

## User Stories

1. User 1 (Alice) registers a new identity with the system.

```
sequenceDiagram
  participant Alice
  participant IdentityDiamond
  participant facets/IdentityRegistryFacet
  participant libraries/AttributeLib

  Alice ->> IdentityDiamond: registerIdentity()
  IdentityDiamond ->> facets/IdentityRegistryFacet: registerIdentity()
  facets/IdentityRegistryFacet ->> libraries/AttributeLib: assignDefaultAttributes()
  libraries/AttributeLib -->> facets/IdentityRegistryFacet: Return success
  facets/IdentityRegistryFacet -->> IdentityDiamond: Return success
  IdentityDiamond -->> Alice: Return success and new Identity ID.
```
2. User 2 (Bob) is an authorized claim issuer and issues an identity claim to Alice.

```
sequenceDiagram
  participant Bob
  participant IdentityDiamond
  participant facets/ClaimIssuerFacet
  participant interfaces/IERC735

  Bob ->> IdentityDiamond: issueClaim(Alice's Identity ID)
  IdentityDiamond ->> facets/ClaimIssuerFacet: issueClaim(Alice's Identity ID)
  facets/ClaimIssuerFacet ->> interfaces/IERC735: addClaim()
  interfaces/IERC735 -->> facets/ClaimIssuerFacet: Return success
  facets/ClaimIssuerFacet -->> IdentityDiamond: Return success
  IdentityDiamond -->> Bob: Return success and new Claim ID.
```
3. User 3 (Charlie) is an application or system that accepts claims from Alice as proof of her identity.

```
sequenceDiagram
  participant Alice
  participant Charlie
  participant IdentityDiamond
  participant facets/ERC735Facet

  Alice->>Charlie: provideIdentityDetails(Alice's Identity ID)
  Charlie ->> IdentityDiamond: getClaimByHolder(Alice's Identity ID)
  IdentityDiamond ->> facets/ERC735Facet: getClaim(Alice's Claim ID)
  facets/ERC735Facet -->> IdentityDiamond: Return claim details
  IdentityDiamond -->> Charlie: Return claim details
  Charlie->>Alice: Authenticate based on returned claim details. 
```
4. User 4 (Agency) authorizes Bob to issue claims on its behalf.

```
sequenceDiagram
  participant Agency
  participant IdentityDiamond
  participant facets/ITrustedIssuersRegistryFacet
  participant libraries/Controllable

  Agency->>IdentityDiamond: authorizeIssuer(Bob's Identity ID)
  IdentityDiamond->>facets/ITrustedIssuersRegistryFacet: authorizeIssuer(Bob's Identity ID)
  facets/ITrustedIssuersRegistryFacet->>libraries/Controllable: addController(Bob's Identity ID)
  libraries/Controllable->>facets/ITrustedIssuersRegistryFacet: Return success
  facets/ITrustedIssuersRegistryFacet->>IdentityDiamond: Return success
  IdentityDiamond->>Agency: Return success
```

5. Bob revokes a previously issued claim from Alice.

```
sequenceDiagram
  participant Bob
  participant IdentityDiamond
  participant facets/ERC735Facet
  participant interfaces/IERC735

  Bob ->> IdentityDiamond: revokeClaim(Alice's Claim ID)
  IdentityDiamond ->> facets/ERC735Facet: revokeClaim(Alice's Claim ID)
  facets/ERC735Facet ->> interfaces/IERC735: removeClaim()
  interfaces/IERC735 -->> facets/ERC735Facet: Return success
  facets/ERC735Facet -->> IdentityDiamond: Return success
  IdentityDiamond -->> Bob: Return success
```

6. Alice provides her claim to an application to prove her identity.

```
sequenceDiagram
  participant Alice
  participant IdentityDiamond
  participant facets/ERC735Facet
  participant Application

  Alice->>Application: loginWithClaimID(Alice's Claim ID)
  Application->>IdentityDiamond: getClaim(Alice's Claim ID)
  IdentityDiamond->>facets/ERC735Facet: getClaim(Alice's Claim ID)
  facets/ERC735Facet-->>IdentityDiamond: Return claim details
  IdentityDiamond-->>Application: Return claim details
  Application->>Alice: Authenticate based on returned claim details
```

7. Alice updates her identity attributes.

```
sequenceDiagram
  participant Alice
  participant IdentityDiamond
  participant facets/IdentityRegistryFacet
  participant libraries/AttributeLib

  Alice ->> IdentityDiamond: updateIdentityAttributes()
  IdentityDiamond ->> facets/IdentityRegistryFacet: updateIdentityAttributes()
  facets/IdentityRegistryFacet ->> libraries/AttributeLib: updateAttributes()
  libraries/AttributeLib -->> facets/IdentityRegistryFacet: Return success
  facets/IdentityRegistryFacet -->> IdentityDiamond: Return success
  IdentityDiamond -->> Alice: Return success
```