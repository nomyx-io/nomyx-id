/* eslint-disable node/no-missing-import */
/* eslint-disable import/no-duplicates */

import {
  deployContracts,
  deployDiamondFactory,
  getContractDeployment,
  getDiamondToken,
} from './deploy';

import { FacetCutAction, getSelectors } from './diamond';

export async function deployErc721DiamondFactory(hre: any) {
  console.log('deploying erc721 diamond factory');
  // base set of libs to deploy
  const libs = [
    'AddressSet',
    'AttributeLib',
    'AttributeMutationPoolLib',
    'Base64',
    'Bytes32Set',
    'DiamondFactoryLib',
    'DiamondLib',
    'ERC721AEnumerationLib',
    'ERC721ALib',
    'LibDiamond',
    'MerkleProver',
    'MetadataLib',
    'MultiSaleLib',
    'StringsLib',
    'Strings',
    'SVGTemplatesLib',
    'UInt256Set',
    'VariablePriceLib',
  ];
  // base set of contracts to deploy for an erc721
  const facets: any = [
    'ERC721AAttributesFacet',
    'ERC721AFacet',
    'ERC721AMetadataFacet',
    'ERC721AReceiverFacet',
    'ERC721EnumerableFacet',
    'SVGTemplatesFacet',
    'MultiSaleFacet',
    'ERC721MinterFacet',
    'VariablePriceFacet',
  ];
  // deploy the diamond factory
  const diamondFactory = await deployDiamondFactory(hre, facets, libs);
  console.log(`deployed ${facets.length} facets for erc721 diamond factory`);
  console.log(`deployed ${libs.length} libraries for erc721 diamond factory`);
  console.log(`deployed erc721 diamond factory at ${diamondFactory.address}`);

  let gasPrice = await hre.ethers.provider.getGasPrice();
  let receipt = await diamondFactory.removeFacets('default', {
    gasPrice: gasPrice,
    gasLimit: 1000000,
  });
  await receipt.wait();
  console.log(`removed Facets from Diamond Factory`);
  // create a list of FacetCutAction to add to the diamond factory
  const diamondCut: any = [];
  // add the libs to the diamond factory using the  setFacets function
  for (let i = 0; i < facets.length; i++) {
    const facet = facets[i];
    const facetAddress = await getContractDeployment(hre, facet);
    diamondCut.push({
      facetAddress: facetAddress.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facetAddress),
    });
  }
  console.log('Adding Facets to Diamond Factory: ', diamondCut);
  // add the facets to the diamond factory using the  setFacets function
  receipt = await diamondFactory.setFacets('default', diamondCut, {
    gasPrice: gasPrice,
    gasLimit: 1000000,
  });
  await receipt.wait();

  return diamondFactory;
}

/// @notice  deploy the erc721 token factory. THis factory makes am ERC721 token
// diamond. the diamond can then be extended with dditional functionality
export async function deployEmptyDiamondFactory(hre: any) {
  console.log('deploying erc721 diamond factory');
  // base set of libs to deploy
  const libs = [
    "Address",
    "AddressSet",
    "AttributeLib",
    "Base64",
    "Bytes32Set",
    "Create2",
    "DiamondFactoryLib",
    "DiamondLib",
    "ERC721AEnumerationLib",
    "ERC721ALib",
    "InterfaceChecker",
    "LibDiamond",
    "Math",
    "MerkleProver",
    "MetadataLib",
    "MultiSaleLib",
    "Strings",
    "StringsLib",
    "SVGTemplatesLib",
    "UInt256Set",
    "VariablePriceLib"
  ];
  // base set of contracts to deploy for an erc721
  const facets: any = [];
  // deploy the diamond factory
  const diamondFactory = await deployDiamondFactory(hre, facets, libs);
  console.log(`deployed empty diamond factory at ${diamondFactory.address}`);
  return diamondFactory;
}

/**
 * add a facet set to the diamond factory
 * @param hre 
 * @param setName 
 * @param facets 
 * @param diamondFactory 
 */
export async function addFacetSetToDiamondFactory(hre: any, setName: any, facets: any, diamondFactory: any) {
  // create a list of FacetCutAction to add to the diamond factory
  const diamondCut: any = [];
  for (let i = 0; i < facets.length; i++) {
    diamondCut.push({
      facetAddress: facets[i].address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facets[i]),
    });
  }
  // remove any old facets from the diamond factory
  let receipt = await diamondFactory.removeFacets(setName);
  await receipt.wait();
  // add the facets to the diamond factory using the  setFacets function
  receipt = await diamondFactory.setFacets(setName, diamondCut);
  await receipt.wait();
}

export async function addFacetSetsToDiamondFactory(hre: any, diamondFactory: any, diamondSets: any) {
  for (const setName in diamondSets) {
    const facets = diamondSets[setName];
    const libraries = await deployContracts(hre, facets.facets, { from: hre.deployer });
    const facetContracts = await deployContracts(hre, facets.facets, { from: hre.deployer, libraries });
    await addFacetSetToDiamondFactory(hre, setName, facetContracts, diamondFactory);
  }
}

/**
 * create a diamond
 * @param hre 
 * @param owner 
 * @param name 
 * @param symbol 
 * @param facets 
 * @returns 
 */
export async function createDiamond(
  hre: any,
  owner: any,
  name: string,
  symbol: string,
  facets: any
) {
  const tokenFactory = await getContractDeployment(hre, 'DiamondFactory');
  const tokenAddress = await tokenFactory.getDiamondAddress(symbol);
  const svgManager = await hre.deployments.get('SVGManager');

  const requestData = {
    owner: owner,
    factory: tokenFactory.address,
    svgManager: svgManager.address,
    symbol: symbol,
    name: name,
  };

  const symbols = await tokenFactory.symbols();
  if (!symbols.includes(symbol)) {

    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const gasPrice = await hre.ethers.provider.getGasPrice();
    const gasLimit = await tokenFactory.createFromSet(requestData, zeroAddress, [], facets);

    console.log(`creating diamond ${symbol} at ${tokenAddress} with ${facets.length} facets - fee ${gasPrice.mul(gasLimit)}`);

    await (
      await tokenFactory.createFromSet(requestData, zeroAddress, [], facets, {
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      })
    ).wait();
  }

  const address = await tokenFactory.getDiamondAddress(symbol);
  return address;
}

export async function createDiamondToken(
  hre: any,
  owner: any,
  name: string,
  symbol: string
) {
  const tokenFactory = await getContractDeployment(hre, 'DiamondFactory');
  const tokenAddress = await tokenFactory.getDiamondAddress(symbol);
  const svgManager = await hre.deployments.get('SVGManager');
  const svgManagerContract = await hre.ethers.getContractAt(
    'IControllable',
    svgManager.address
  );

  const requestData = {
    owner: owner,
    factory: tokenFactory.address,
    svgManager: svgManager.address,
    symbol: symbol,
    name: name,
  };

  const symbols = await tokenFactory.symbols();
  let gasPrice = await hre.ethers.provider.getGasPrice();
  if (!symbols.includes(symbol)) {
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    console.log(`creating diamond ${symbol} at ${tokenAddress} with default set - fee ${gasPrice.mul(1000000)}`);
    await (
      await tokenFactory.createFromSet(
        requestData,
        zeroAddress,
        [],
        'default',
        {
          gasPrice: gasPrice,
        }
      )
    ).wait();
  }

  console.log(`adding svg manager to token ${symbol}`)
  const tokenContract = await getDiamondToken(hre, symbol);
  await (
    await svgManagerContract.addController(tokenContract.address, {
      gasPrice: gasPrice,
    })
  ).wait();

  try {

    // gasLimit = await tokenFactory.estimateGas.setSVGManager(svgManager.address);
    // await (
    //   await tokenContract.setSVGManager(svgManager.address, {
    //     gasLimit: gasLimit,
    //     gasPrice: gasPrice,
    //   })
    // ).wait();
  } catch (e) {
    console.log('cant add svg manager to token', e);
  }

  // await(await tokenContract.createSVG('gem')).wait();
  // const svg = await tokenContract.svgAddress('gem');
  // const svgContract = await hre.ethers.getContractAt('SVGTemplate', svg);
  // const svgData = JSON.parse(fs.readFileSync(`./svg/gem.json`, 'utf8'));
  // await (await svgContract.addAll(svgData)).wait();
  // console.log(`uploaded SVG image to ${svg}`);


  const address = await tokenFactory.getDiamondAddress(symbol);
  return address;
}
