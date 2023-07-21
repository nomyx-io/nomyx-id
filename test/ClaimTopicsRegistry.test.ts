import { expect } from 'chai';
import { ethers, deployments, getUnnamedAccounts } from 'hardhat';
import { setupUsers } from './utils';
import { deployDiamondFactory, getContractDeployment, getDiamondToken } from '../utils/deploy';
import { FacetCutAction, getSelectors } from '../utils/diamond';
import { createDiamondToken } from '../utils/hardhat-deploy';

const setup = deployments.createFixture(async (hre) => {
    await deployments.fixture('ClaimTopicsRegistry');

    const { deployments: deps, getNamedAccounts } = hre;
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
        const diamondFactory = await deployDiamondFactory(hre, facets, libs);
        console.log(`deployed ${facets.length} facets for diamond factory`);
        console.log(`deployed ${libs.length} libraries for diamond factory`);
        console.log(`deployed diamond factory at ${diamondFactory.address}`);
        let gasPrice = await (hre.ethers.provider as any).getGasPrice();
        let receipt = await diamondFactory.removeFacets('default', {
            gasPrice: gasPrice,
            gasLimit: 1000000,
        });
        await receipt.wait();
        console.log(`removed existing facets from Diamond Factory`);
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
    return {
        ...configObject,
    };
});

describe('ClaimTopicsRegistry', function () {
    it('addClaimTopic works', async function () {
        const { ClaimTopicsRegistry }: any = await setup();
        const testClaimTopic = 1;
        await expect(ClaimTopicsRegistry.addClaimTopic(testClaimTopic))
            .to.emit(ClaimTopicsRegistry, 'ClaimTopicAdded')
            .withArgs(testClaimTopic);
    });
    it('removeClaimTopic works', async function () {
        const { ClaimTopicsRegistry } = await setup();
        const testClaimTopic = 1;
        await expect(ClaimTopicsRegistry.removeClaimTopic(testClaimTopic))
            .to.emit(ClaimTopicsRegistry, 'ClaimTopicRemoved')
            .withArgs(testClaimTopic);
    });
    it('getClaimTopics works', async function () {
        const { ClaimTopicsRegistry } = await setup();
        const testClaimTopic = 1;
        await ClaimTopicsRegistry.addClaimTopic(testClaimTopic);
        const claimTopics = await ClaimTopicsRegistry.getClaimTopics();
        expect(claimTopics).to.deep.equal([testClaimTopic]);
    });
});

