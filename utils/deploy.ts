/* eslint-disable node/no-unpublished-import */
import 'dotenv/config';

import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Contract } from 'ethers';
import { FacetCutAction, getSelectors, getSelectorsIndex } from './diamond';

/**
 * get the diamond facet (apply an abi to a diamond address)
 * @param hre the hardhat runtime environment
 * @param facetName the name of the facet
 * @returns the diamond facet contract
 */
export async function getDiamondFacet(
  hre: HardhatRuntimeEnvironment,
  facetName: string
): Promise<Contract> {
  const diamondDeployer = await hre.deployments.get('Diamond');
  return await hre.ethers.getContractAt(facetName, diamondDeployer.address);
}

/**
 * get the diamond factory contract
 * @param hre the hardhat runtime environment
 * @param symbol the symbol of the diamond token
 * @returns the diamond factory contract
 */
export async function getDiamondFactory(
  hre: HardhatRuntimeEnvironment
) {
  const diamondFacDeployer = await hre.deployments.get('DiamondFactory');
  const diamondFactory = await hre.ethers.getContractAt(
    diamondFacDeployer.abi,
    diamondFacDeployer.address
  );
  return diamondFactory;
}

/**
 * get the diamond token
 * @param hre the hardhat runtime environment
 * @param symbol the symbol of the diamond token
 * @returns the diamond token contract
 */
export async function getDiamondToken(
  hre: HardhatRuntimeEnvironment,
  symbol: string
) {
  const diamondFacDeployer = await hre.deployments.get('DiamondFactory');
  const diamondFactory = await hre.ethers.getContractAt(
    diamondFacDeployer.abi,
    diamondFacDeployer.address
  );
  const diamondAddress = await diamondFactory.getDiamondAddress(symbol);
  return hre.ethers.getContractAt('IDiamondToken', diamondAddress);
}

/**
 * get the diamond token at
 * @param hre the hardhat runtime environment
 * @param symbol the symbol of the diamond token
 * @param address the address of the diamond token
 * @returns the diamond token contract
 */
export async function getDiamondTokenAt(
  hre: HardhatRuntimeEnvironment,
  symbol: string,
  address: string
) {
  const diamondFacDeployer = await hre.deployments.get('DiamondFactory');
  const diamondFactory = await hre.ethers.getContractAt(
    diamondFacDeployer.abi,
    address
  );
  const diamondAddress = await diamondFactory.getDiamondAddress(symbol);
  return hre.ethers.getContractAt('IDiamondToken', diamondAddress);
}

/**
 * get the contract deployment
 * @param hre the hardhat runtime environment
 * @param contractName the name of the contract
 * @returns the contract deployment
 */
export async function getContractDeployment(
  hre: HardhatRuntimeEnvironment,
  contractName: string
): Promise<Contract> {
  const contractDeployer = await hre.deployments.get(contractName);
  return hre.ethers.getContractAt(
    contractDeployer.abi,
    contractDeployer.address
  );
}

/**
 * get the contract deployment at
 * @param hre
 * @param contractName
 * @param address
 * @returns
 */
export async function getContractDeploymentAt(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  address: string
): Promise<Contract> {
  const contractDeployer = await hre.deployments.get(contractName);
  return hre.ethers.getContractAt(contractDeployer.abi, address);
}

/**
 * deploy multiple contracts
 * @param hre
 * @param contractNames
 * @param options
 * @returns
 */
export async function deployContracts(
  hre: any,
  contractNames: string[],
  options: any
): Promise<any> {
  const { deploy }: any = hre.deployments;
  const [owner] = await hre.ethers.getSigners();
  const ownerAddress = await owner.getAddress();
  options.from = ownerAddress;
  options.log = false;
  const deploymentsOut: any = {};
  for (const contractName of contractNames) {
    const depl = await deploy(contractName, options);
    deploymentsOut[contractName] = depl.address;
  }
  return deploymentsOut;
}

/**
 * deploy the diamond factory
 * @param hre
 * @param facetNames
 * @param libraryNames
 * @returns
 */
export async function deployDiamondFactory(
  hre: any,
  facetNames: string[],
  libraryNames: string[],
  log = true
): Promise<any> {
  const [owner] = await hre.ethers.getSigners();
  const from = await owner.getAddress();

  if (log) console.log('Deploying libraries...');
  // deploy libraries
  const libraries = await deployContracts(hre, libraryNames, { from });
  if (log) console.log(`deployed ${libraryNames.length} libraries`, libraries);
  // deploy facets
  let facets: any = await deployContracts(hre, facetNames, {
    from,
    libraries,
  });
  if (log) console.log(`deployed ${facetNames.length} facets`, facets);
  facets = await loadContractsAt(hre, facets);

  // cut the facets
  const cuts = [];
  for (const facet in facets) {
    const facetContract = facets[facet];
    const sels = getSelectors(facetContract);
    if (sels.length === 0) {
      if (log) console.warn(`${facet} has no selectors`);
      continue;
    }
    cuts.push({
      facetAddress: facetContract.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facetContract),
    });
    if (log) console.log(`${facet} has ${sels.length} selectors`);
  }
  if (log) console.log(`cutting ${cuts.length} facets`, facetNames);

  // deploy the factory
  await deployContracts(hre, ['DiamondFactory', 'SVGManager'], {
    from,
    libraries,
  });

  const diamondFactoryDepl = await hre.deployments.get('DiamondFactory');
  const diamondFactory = await hre.ethers.getContractAt(
    'DiamondFactory',
    diamondFactoryDepl.address
  );

  // const _wrappedToken = await hre.deployments.get("WrappedToken");
  let _svgManager = await hre.deployments.get('SVGManager');
  _svgManager = await hre.ethers.getContractAt(
    'IControllable',
    _svgManager.address
  );
  await (await _svgManager.addController(diamondFactory.address)).wait();

  try {
    await (
      await diamondFactory.initialize(
        {
          setName: 'erc721a',
          facetAddresses: cuts,
        },
        { from, gasLimit: 8000000 }
      )
    ).wait();
    if (log) console.log('DiamondFactory initialized');
  } catch (e: any) {
    console.log(e.toString());
  }
  console.log(
    `deployed diamond factory at ${diamondFactory.address}, with ${cuts.length} cuts`
  );

  // combine all facet abis into one, and then save it to ./DiamondFacets.json
  const diamondFacets = await combineFacetAbis(facets);
  saveFacetAbis(diamondFacets);

  return diamondFactory;
}

/**
 * combine all facet abis into one
 * @param facets the facets
 * @returns the combined abi
 */
function combineFacetAbis(facets: any) {
  const diamondFacetsAbi: any = [];
  for (const facet in facets) {
    const facetContract = facets[facet];
    const abi = facetContract.interface.fragments;
    abi.forEach((f: any) => {
      diamondFacetsAbi.push(f);
    });
  }
  return diamondFacetsAbi;
}

/**
 * save the facet abis to ./DiamondFacets.json
 * @param diamondFacets the facet abis
 */
function saveFacetAbis(diamondFacets: any) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, '../../', 'DiamondFacets.json');
  fs.writeFileSync(filePath, JSON.stringify(diamondFacets, null, 4));
}

/**
 * load contracts at
 * @param hre the hardhat runtime environment
 * @param contractIndex the contract index
 * @returns the contracts
 */
export async function loadContractsAt(
  hre: any,
  contractIndex: any
): Promise<any> {
  const contractNames = Object.keys(contractIndex);
  const contracts: any = {};
  for (const contractName of contractNames) {
    const address = contractIndex[contractName];
    contracts[contractName] = await hre.ethers.getContractAt(
      contractName,
      address
    );
  }
  return contracts;
}

/**
 * do a diamond cut on the contract
 * @param hre the hardhat runtime environment
 * @param diamondAddress the diamond address
 * @param diamondInit the diamond init address
 * @param facets the facets
 */
export async function diamondCut(
  hre: any,
  diamondAddress: string,
  diamondInit: any,
  facets: any
) {
  const diamondCut = await hre.ethers.getContractAt(
    'IDiamondCut',
    diamondAddress
  );
  const cuts: any = [];
  for (const facetKey of Object.keys(facets)) {
    const facet = facets[facetKey];
    cuts.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
    console.log(`Cutting facet ${facetKey}`);
    console.log(
      `selectors: ${JSON.stringify(getSelectorsIndex(facet), null, 2)}`
    );
  }
  diamondInit = await hre.ethers.getContractAt('DiamondInit', diamondInit);
  const functionCall = diamondInit.interface.encodeFunctionData('init');
  const tx = await diamondCut.diamondCut(
    cuts,
    diamondInit.address,
    functionCall,
    { gasLimit: 8000000 }
  );
  await tx.wait();
}

/**
 * deploy a diamond and its facets to the blockchain. Will deploy both the base diamond, its base facets, user facets, user libs, and the diamond cut.
 * @param hre the hardhat environment
 * @param myFacets the userlevel facets to deploy along with the diamond
 * @param myLibraries the list of libraries to deploy and provide to the user facets
 * @returns the diamond address
 */
export async function deployDiamond(
  hre: any,
  myFacets: any,
  myLibraries: any
): Promise<any> {
  // get the owner address
  const [owner] = await hre.ethers.getSigners();
  const ownerAddress = await owner.getAddress();

  // deploy libdiamond
  let libraries = await deployContracts(hre, ['LibDiamond'], {
    from: ownerAddress,
  });
  console.log(`deployed libraries: ${JSON.stringify(libraries)}`);

  // deploy the base contracts and get references to the deploys
  const contracts = await deployContracts(hre, ['DiamondInit'], {
    from: ownerAddress,
    libraries,
  });
  console.log(
    `deployed base diamond facets at: ${JSON.stringify(contracts, null, 2)}`
  );

  // deploy the diamond
  const { Diamond } = await deployContracts(hre, ['Diamond'], {
    from: ownerAddress,
    libraries,
  });
  console.log(`deployed diamond at: ${Diamond} with owner ${ownerAddress}`);

  if (myLibraries.length > 0) {
    // deploy all userlevel libraries
    const userlibraries = await deployContracts(hre, myLibraries, {
      from: ownerAddress,
    });
    libraries = Object.assign(libraries, userlibraries);
    console.log(
      `deployed user libraries at: ${JSON.stringify(userlibraries, null, 2)}`
    );
  }

  // build a list of the base facets to deploy
  const facets: any = {
    DiamondLoupeFacet: contracts.DiamondLoupeFacet,
    OwnershipFacet: contracts.OwnershipFacet,
  };

  if (myFacets.length > 0) {
    // deploy the userlevel facets
    const myFacetDeployments = await deployContracts(hre, myFacets, {
      from: ownerAddress,
      libraries,
    });
    console.log(
      `deployed user facets at: ${JSON.stringify(myFacetDeployments, null, 4)}`
    );
    Object.keys(myFacetDeployments).forEach(
      (facet, idx) => (facets[myFacets[idx]] = myFacetDeployments[facet])
    );
  }

  const facetContracts = await loadContractsAt(hre, facets);

  // do the diamond cut action
  await diamondCut(hre, Diamond, contracts.DiamondInit, facetContracts);

  return Diamond.address;
}
