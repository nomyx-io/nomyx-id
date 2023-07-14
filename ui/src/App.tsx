import React from 'react';

import { ethers } from 'ethers';

import NavBar from './components/NavBar.jsx';
import Home from './components/Home.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import ClaimTopicsPage from './components/ClaimTopicsPage.jsx';
import TrustedIssuersPage from './components/TrustedIssuersPage.jsx';
import IdentitiesPage from './components/IdentitiesPage.jsx';
import ClaimsPage from './components/ClaimsPage.jsx';
import CreateClaimTopic from './components/CreateClaimTopic.jsx';

import BlockchainService from './services/BlockchainService.js';

function UnsupportedNetworkDialog(props: any) {

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
}

function App() {

  const [isConnected, setIsConnected] = React.useState(false);
  const [currentNetwork, setCurrentNetwork] = React.useState(0);
  const [blockchainService, setBlockchainService] = React.useState({});
  const [unsupportedNetworkDialogVisible, setUnsupportedNetworkDialogVisible] = React.useState(false);


  return (
    <Router>
      {/* Navigation Menu */}
      <UnsupportedNetworkDialog
        currentNetwork={currentNetwork}
        supportedNetworks={[
          { chainId: 1, name: "Mainnet" },
          { chainId: 4, name: "Rinkeby" },
          { chainId: 3, name: "Ropsten" },
          { chainId: 5, name: "Goerli" },
          { chainId: 42, name: "Kovan" },
        ]}
        visible={unsupportedNetworkDialogVisible}
        onClose={() => { }}
        onSwitchNetwork={() => { }}
      />
      <div className="topnav">
        <NavBar
          isConnected={isConnected}
          connectBlockchain={async () => {
            if ((window as any).ethereum) {
              try {
                const provider = new ethers.providers.Web3Provider((window as any).ethereum);
                let jsonConfig: any = await import(`./config.json`);

                const network = await provider.getNetwork();
                const chainId = network.chainId;
                const config = jsonConfig[`${chainId}` as any];

                setCurrentNetwork(network.chainId);
                if (!config) {
                  setUnsupportedNetworkDialogVisible(true);
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
          }}
        />
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<ClaimTopicsPage service={blockchainService} />} />
          <Route path="/issuers" element={<TrustedIssuersPage service={blockchainService} />} />
          <Route path="/identities" element={<IdentitiesPage service={blockchainService} />} />
          <Route path="/claims" element={<ClaimsPage service={blockchainService} />} />
          <Route path="/topics/create" element={<CreateClaimTopic />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

