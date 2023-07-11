/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { createDiamondToken } from '../utils/hardhat-deploy';
import {
	deployDiamondFactory,
	getContractDeployment,
	getDiamondToken,
} from '../utils/deploy';
import {
	FacetCutAction,
	getSelectors
} from '../utils/diamond';
import fs from 'fs';
import path from 'path';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { network } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer, simpleERC20Beneficiary } = await getNamedAccounts();
	const signerAddress = deployer;

	const libs = [
		'AddressSet',
		'AttributeLib',
		'Base64',
		'Bytes32Set',
		'ClaimStorageLib',
		'ClaimTopicLib',
		'DiamondFactoryLib',
		'DiamondLib',
		'ERC721AEnumerationLib',
		'ERC721ALib',
		'IdentityLib',
		'LibDiamond',
		'MetadataLib',
		'StringsLib',
		'Strings',
		'SVGTemplatesLib',
		'TrustedIssuerLib',
		'UInt256Set',
		'IdentityFactory'
	];
	// base set of contracts to deploy for an erc721
	const facets: any = [
		'ERC721AAttributesFacet',
		'ERC721AFacet',
		'ERC721AMetadataFacet',
		'ERC721AReceiverFacet',
		'ERC721EnumerableFacet',
		'SVGTemplatesFacet',
		'ClaimTopicsRegistryFacet',
		'IdentityRegistryFacet',
		'TrustedIssuersRegistryFacet',
	];

	async function deployFactory() {
		// deploy the diamond factory
		const diamondFactory = await deployDiamondFactory(hre, facets, libs);
		console.log(`deployed ${facets.length} facets for diamond factory`);
		console.log(`deployed ${libs.length} libraries for diamond factory`);
		console.log(`deployed diamond factory at ${diamondFactory.address}`);
		// remove any facets from the factory (they shouldn't be there)
		let gasPrice = await (hre.ethers.provider as any).getGasPrice();
		let receipt = await diamondFactory.removeFacets('default', {
			gasPrice: gasPrice,
			gasLimit: 1000000,
		});
		await receipt.wait();
		console.log(`removed existing facets from Diamond Factory`);
		// create a list of FacetCutAction to add to the diamond factory
		const diamondCut: any = [];
		// add the libs to the diamond factory using the  setFacets function
		for (let i = 0; i < facets.length; i++) {
			const facet = facets[i];
			const facetAddress = await getContractDeployment(hre, facet);
			diamondCut.push({
				facetAddress: facetAddress.address,
				action: FacetCutAction.Add,
				functionSelectors: getSelectors(facetAddress as any),
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

	const diamondFactory = await deployFactory();

	await createDiamondToken(
		hre,
		signerAddress,
		'Token',
		'TOKEN'
	);

	const dt = await getDiamondToken(hre, 'TOKEN');

	const identityFactory = await getContractDeployment(hre, 'IdentityFactory');

	const tokenAddress = dt.address;
	const chainId = await hre.getChainId();
	const configObject = {
		[chainId]: {
			identityFactory: identityFactory.address,
			factory: diamondFactory.address,
			contract: tokenAddress,
			owner: signerAddress,
		},
	};
	console.log('configObject', configObject);
	const configFilename = path.join(
		__dirname,
		'..',
		'ui',
		'src',
		'config.json'
	);
	let newConfig = configObject;
	if (fs.existsSync(configFilename)) {
		const currentConfig = JSON.parse(fs.readFileSync(configFilename, 'utf8') || '{}');
		newConfig = Object.assign(currentConfig, configObject);
	} else {
		newConfig = configObject;
	}
	fs.writeFileSync(configFilename, JSON.stringify(newConfig, undefined, 2));
	console.log('Config written to ', configFilename);
};
export default func;
func.tags = ['SimpleERC20'];
