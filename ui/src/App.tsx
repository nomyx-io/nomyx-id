import React, {useEffect, useState} from 'react';

import { ethers } from 'ethers';

import NavBar from './components/NavBar.jsx';
import Home from './components/Home.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import {
	getDefaultWallets,
	RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {useAccount, configureChains, createConfig, WagmiConfig, Chain} from 'wagmi';
import {
	mainnet,
	polygon,
	optimism,
	arbitrum,
	zora,
	sepolia
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';



import './App.css';

import ClaimTopicsPage from './components/ClaimTopicsPage.jsx';
import TrustedIssuersPage from './components/TrustedIssuersPage.jsx';
import IdentitiesPage from './components/IdentitiesPage.jsx';
import ClaimsPage from './components/ClaimsPage.jsx';
import DigitalIdentityDetailView from './components/DigitalIdentityDetailPage.jsx';
import CreateClaimTopic from './components/CreateClaimTopic.jsx';

import BlockchainService from './services/BlockchainService.js';
import CreateDigitalId from './components/CreateDigitalId.jsx';
import Login from './components/LoginPage.jsx';
import EditClaim  from './components/EditClaim.jsx';
import TestService from "./services/TestService";
import CreateTrustedIssuer from './components/CreateTrustedIssuer.jsx';



const localhost: Chain = {
	id: 31337,
	name: 'Localhost',
	network: 'localhost',
	nativeCurrency: {
		decimals: 18,
		name: 'Ethereum',
		symbol: 'ETH',
	},
	rpcUrls: {
		default: {
			http: ['http://0.0.0.0:8545/']
		},
		public:{
			http: ['http://0.0.0.0:8545/']
		}
	},
	testnet: true,
};


const { chains, publicClient } = configureChains(
	[mainnet, polygon, optimism, arbitrum, zora, sepolia, localhost],
	[
		alchemyProvider({ apiKey: 'CSgNtTJ6_Clrf1zNjVp2j1ppfLE2-aVX'}),
		publicProvider()
	]
);

const { connectors } = getDefaultWallets({
	appName: 'LL Testing',
	projectId: 'ae575761a72370ab88834655acbba677',
	chains
});

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient
})

/*function UnsupportedNetworkDialog(props: any) {

  const { currentNetwork, supportedNetworks, visible, onClose, onSwitchNetwork } = props;

  if (!visible) {
    return null;
  }

  const handleClose = () => {
    onClose();
  }

  const handleSwitchNetwork = () => {
    onSwitchNetwork();
  }

  return (
    <div className="dialog">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Unsupported Network</h2>
        </div>
        <div className="dialog-body">
          <p>
            You are currently connected to <strong>{currentNetwork}</strong> which is not supported by this application.
          </p>
          <p>
            Please switch to one of the following supported networks:
          </p>
          <ul>
            {supportedNetworks.map((network: any) => {
              return (
                <li key={network.chainId}>
                  <button onClick={handleSwitchNetwork}>{network.name}</button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="dialog-footer">
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}*/

function App() {

  const [isConnected, setIsConnected] = React.useState(false);
  const [currentNetwork, setCurrentNetwork] = React.useState(0);
  const [blockchainService, setBlockchainService] = React.useState(new TestService());
  // const [unsupportedNetworkDialogVisible, setUnsupportedNetworkDialogVisible] = React.useState(false);
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
	  console.log('useEffect');
	  if(window.location.pathname.includes("/login")){
		  setLoggedIn(true)
	  }
  }, []);

  const onConnect = async (address:any, connector:any) => {

	  console.log('connected!');
	  console.log('address = ' + address);
	  console.log('connector = ' + connector);

	  console.log("ethereum:");
	  console.log((window as any).ethereum);

	  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
	  let jsonConfig: any = await import(`./config.json`);

	  const network = provider.getNetwork().then((network:any)=>{

		  const chainId = network.chainId;
		  console.log('chainId = ' + chainId);
		  setCurrentNetwork(network.chainId);

		  const config = jsonConfig[chainId];

		  if (!config) {
			  // setUnsupportedNetworkDialogVisible(true);
			  setIsConnected(false);
			  return;
		  }

		  setIsConnected(true);

		  const _blockchainService = new BlockchainService(provider, config.contract, config.identityFactory);
		  setBlockchainService(_blockchainService);
	  });
  };


	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider chains={chains}>
				<Router>
					{/* Navigation Menu */}
{/*					<UnsupportedNetworkDialog
						currentNetwork={currentNetwork}
						supportedNetworks={[
							{chainId: 1, name: 'Mainnet'},
							{chainId: 4, name: 'Rinkeby'},
							{chainId: 3, name: 'Ropsten'},
							{chainId: 5, name: 'Goerli'},
							{chainId: 42, name: 'Kovan'},
						]}
						visible={unsupportedNetworkDialogVisible}
						onClose={() => {}}
						onSwitchNetwork={() => {}}
					/>*/}
					<div className={`topnav p-0 ${loggedIn ? "hidden" : ""}`}>
						<NavBar
							/*isConnected={isConnected}
							connectBlockchain={async () => {
								if ((window as any).ethereum) {
									try {
										const provider = new ethers.providers.Web3Provider((window as any).ethereum);
										let jsonConfig: any = await import(`./config.json`);

										const network = await provider.getNetwork();
										const chainId = network.chainId;
										const config = jsonConfig[chainId];

										setCurrentNetwork(network.chainId);
										if (!config) {
											// setUnsupportedNetworkDialogVisible(true);
											setIsConnected(false);
											return;
										}

										setIsConnected(true);

										const _blockchainService = new BlockchainService(provider, config.contract);
										setBlockchainService(_blockchainService);
									} catch (err) {
										console.log(err);
									}
								} else {
									console.log('Please install MetaMask!');
								}
							}}
							disconnectBlockchain={() => {
								setIsConnected(false);
							}}*/
							onConnect={onConnect}
						/>
					</div>
					<div className={`${loggedIn ? "p-0 -ml-4 overflow-hidden" : "content"}`}>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/topics" element={<ClaimTopicsPage service={blockchainService} />} />
							<Route path="/issuers" element={<TrustedIssuersPage service={blockchainService} />} />
							<Route path="/identities" element={<IdentitiesPage service={blockchainService} />} />
							<Route path="/claims" element={<ClaimsPage service={blockchainService} />} />
							<Route path="/claims/edit" element={<EditClaim service={blockchainService} />} />
							<Route path="/login" element={<Login />} />
							<Route path="/identities/create" element={<CreateDigitalId service={blockchainService} />} />
              				<Route path="/identities/:selectedId" element={<DigitalIdentityDetailView service={blockchainService} />} />
          					<Route path="/issuers/create" element={<CreateTrustedIssuer />} />
							<Route path="/topics/create" element={<CreateClaimTopic  service={blockchainService} />} />
						</Routes>
					</div>
				</Router>
			</RainbowKitProvider>
		</WagmiConfig>

  );
}

export default App;
