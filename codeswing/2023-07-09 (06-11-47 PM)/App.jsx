const { useState } = React;

import './App.css';

const cdata = {
   "address": "0x09635F643e140090A9A8Dcd712eD6285858ceBef",
   "abi": [
      {
         "inputs": [],
         "stateMutability": "nonpayable",
         "type": "constructor"
      },
      {
         "anonymous": false,
         "inputs": [
            {
               "indexed": true,
               "internalType": "address",
               "name": "contractAddress",
               "type": "address"
            },
            {
               "indexed": true,
               "internalType": "address",
               "name": "controllerAddress",
               "type": "address"
            }
         ],
         "name": "ControllerAdded",
         "type": "event"
      },
      {
         "anonymous": false,
         "inputs": [
            {
               "indexed": true,
               "internalType": "address",
               "name": "contractAddress",
               "type": "address"
            },
            {
               "indexed": true,
               "internalType": "address",
               "name": "controllerAddress",
               "type": "address"
            }
         ],
         "name": "ControllerRemoved",
         "type": "event"
      },
      {
         "anonymous": false,
         "inputs": [
            {
               "indexed": true,
               "internalType": "address",
               "name": "factory",
               "type": "address"
            },
            {
               "indexed": true,
               "internalType": "string",
               "name": "symbol",
               "type": "string"
            },
            {
               "indexed": true,
               "internalType": "address",
               "name": "diamond",
               "type": "address"
            }
         ],
         "name": "DiamondAdd",
         "type": "event"
      },
      {
         "anonymous": false,
         "inputs": [
            {
               "indexed": true,
               "internalType": "address",
               "name": "factory",
               "type": "address"
            },
            {
               "indexed": true,
               "internalType": "string",
               "name": "symbol",
               "type": "string"
            },
            {
               "components": [
                  {
                     "internalType": "address",
                     "name": "owner",
                     "type": "address"
                  },
                  {
                     "internalType": "address",
                     "name": "factory",
                     "type": "address"
                  },
                  {
                     "internalType": "address",
                     "name": "svgManager",
                     "type": "address"
                  },
                  {
                     "internalType": "string",
                     "name": "symbol",
                     "type": "string"
                  },
                  {
                     "internalType": "string",
                     "name": "name",
                     "type": "string"
                  }
               ],
               "indexed": false,
               "internalType": "struct DiamondSettings",
               "name": "settings",
               "type": "tuple"
            }
         ],
         "name": "DiamondCreated",
         "type": "event"
      },
      {
         "anonymous": false,
         "inputs": [
            {
               "indexed": true,
               "internalType": "address",
               "name": "factory",
               "type": "address"
            },
            {
               "indexed": true,
               "internalType": "string",
               "name": "symbol",
               "type": "string"
            },
            {
               "indexed": true,
               "internalType": "address",
               "name": "diamond",
               "type": "address"
            }
         ],
         "name": "DiamondRemoved",
         "type": "event"
      },
      {
         "anonymous": false,
         "inputs": [
            {
               "indexed": false,
               "internalType": "uint8",
               "name": "version",
               "type": "uint8"
            }
         ],
         "name": "Initialized",
         "type": "event"
      },
      {
         "inputs": [
            {
               "internalType": "string",
               "name": "symbol",
               "type": "string"
            },
            {
               "internalType": "address payable",
               "name": "diamondAddress",
               "type": "address"
            }
         ],
         "name": "add",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "address",
               "name": "_controller",
               "type": "address"
            }
         ],
         "name": "addController",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "components": [
                  {
                     "internalType": "address",
                     "name": "owner",
                     "type": "address"
                  },
                  {
                     "internalType": "address",
                     "name": "factory",
                     "type": "address"
                  },
                  {
                     "internalType": "address",
                     "name": "svgManager",
                     "type": "address"
                  },
                  {
                     "internalType": "string",
                     "name": "symbol",
                     "type": "string"
                  },
                  {
                     "internalType": "string",
                     "name": "name",
                     "type": "string"
                  }
               ],
               "internalType": "struct DiamondSettings",
               "name": "params",
               "type": "tuple"
            },
            {
               "internalType": "address",
               "name": "diamondInit",
               "type": "address"
            },
            {
               "internalType": "bytes",
               "name": "_calldata",
               "type": "bytes"
            },
            {
               "components": [
                  {
                     "internalType": "address",
                     "name": "facetAddress",
                     "type": "address"
                  },
                  {
                     "internalType": "enum IDiamondCut.FacetCutAction",
                     "name": "action",
                     "type": "uint8"
                  },
                  {
                     "internalType": "bytes4[]",
                     "name": "functionSelectors",
                     "type": "bytes4[]"
                  }
               ],
               "internalType": "struct IDiamondCut.FacetCut[]",
               "name": "facets",
               "type": "tuple[]"
            }
         ],
         "name": "create",
         "outputs": [
            {
               "internalType": "address payable",
               "name": "diamondAddress",
               "type": "address"
            }
         ],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "components": [
                  {
                     "internalType": "address",
                     "name": "owner",
                     "type": "address"
                  },
                  {
                     "internalType": "address",
                     "name": "factory",
                     "type": "address"
                  },
                  {
                     "internalType": "address",
                     "name": "svgManager",
                     "type": "address"
                  },
                  {
                     "internalType": "string",
                     "name": "symbol",
                     "type": "string"
                  },
                  {
                     "internalType": "string",
                     "name": "name",
                     "type": "string"
                  }
               ],
               "internalType": "struct DiamondSettings",
               "name": "params",
               "type": "tuple"
            },
            {
               "internalType": "address",
               "name": "diamondInit",
               "type": "address"
            },
            {
               "internalType": "bytes",
               "name": "_calldata",
               "type": "bytes"
            },
            {
               "internalType": "string",
               "name": "facets",
               "type": "string"
            }
         ],
         "name": "createFromSet",
         "outputs": [
            {
               "internalType": "address payable",
               "name": "diamondAddress",
               "type": "address"
            }
         ],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "string",
               "name": "symbol",
               "type": "string"
            }
         ],
         "name": "exists",
         "outputs": [
            {
               "internalType": "bool",
               "name": "",
               "type": "bool"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "string",
               "name": "symbol",
               "type": "string"
            }
         ],
         "name": "getDiamondAddress",
         "outputs": [
            {
               "internalType": "address",
               "name": "",
               "type": "address"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "string",
               "name": "facetSet",
               "type": "string"
            }
         ],
         "name": "getFacets",
         "outputs": [
            {
               "components": [
                  {
                     "internalType": "address",
                     "name": "facetAddress",
                     "type": "address"
                  },
                  {
                     "internalType": "enum IDiamondCut.FacetCutAction",
                     "name": "action",
                     "type": "uint8"
                  },
                  {
                     "internalType": "bytes4[]",
                     "name": "functionSelectors",
                     "type": "bytes4[]"
                  }
               ],
               "internalType": "struct IDiamondCut.FacetCut[]",
               "name": "",
               "type": "tuple[]"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      },
      {
         "inputs": [
            {
               "components": [
                  {
                     "internalType": "string",
                     "name": "setName",
                     "type": "string"
                  },
                  {
                     "components": [
                        {
                           "internalType": "address",
                           "name": "facetAddress",
                           "type": "address"
                        },
                        {
                           "internalType": "enum IDiamondCut.FacetCutAction",
                           "name": "action",
                           "type": "uint8"
                        },
                        {
                           "internalType": "bytes4[]",
                           "name": "functionSelectors",
                           "type": "bytes4[]"
                        }
                     ],
                     "internalType": "struct IDiamondCut.FacetCut[]",
                     "name": "facetAddresses",
                     "type": "tuple[]"
                  }
               ],
               "internalType": "struct DiamondFactoryInit",
               "name": "initData",
               "type": "tuple"
            }
         ],
         "name": "initialize",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "address",
               "name": "_address",
               "type": "address"
            }
         ],
         "name": "isController",
         "outputs": [
            {
               "internalType": "bool",
               "name": "allowed",
               "type": "bool"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      },
      {
         "inputs": [],
         "name": "relinquishControl",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "string",
               "name": "symbol",
               "type": "string"
            }
         ],
         "name": "remove",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "string",
               "name": "facetSet",
               "type": "string"
            }
         ],
         "name": "removeFacets",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "string",
               "name": "facetSet",
               "type": "string"
            },
            {
               "internalType": "uint256",
               "name": "idx",
               "type": "uint256"
            },
            {
               "components": [
                  {
                     "internalType": "address",
                     "name": "facetAddress",
                     "type": "address"
                  },
                  {
                     "internalType": "enum IDiamondCut.FacetCutAction",
                     "name": "action",
                     "type": "uint8"
                  },
                  {
                     "internalType": "bytes4[]",
                     "name": "functionSelectors",
                     "type": "bytes4[]"
                  }
               ],
               "internalType": "struct IDiamondCut.FacetCut",
               "name": "facetAddress",
               "type": "tuple"
            }
         ],
         "name": "setFacet",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [
            {
               "internalType": "string",
               "name": "facetSet",
               "type": "string"
            },
            {
               "components": [
                  {
                     "internalType": "address",
                     "name": "facetAddress",
                     "type": "address"
                  },
                  {
                     "internalType": "enum IDiamondCut.FacetCutAction",
                     "name": "action",
                     "type": "uint8"
                  },
                  {
                     "internalType": "bytes4[]",
                     "name": "functionSelectors",
                     "type": "bytes4[]"
                  }
               ],
               "internalType": "struct IDiamondCut.FacetCut[]",
               "name": "facetAddress",
               "type": "tuple[]"
            }
         ],
         "name": "setFacets",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
      },
      {
         "inputs": [],
         "name": "symbols",
         "outputs": [
            {
               "internalType": "string[]",
               "name": "",
               "type": "string[]"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      }
   ],
}

const ConnectionProviderUrl = ({ url, urlSet }) => {
   const [value, setValue] = useState(url);

   const handleUrlChange = (event) => {
      setValue(event.target.value);
   };

   const handleUrlSet = () => {
      urlSet(value);
   };

   const styles = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
   };

   return (
      <div className="input" style={styles}>
         <input
            type="text"
            id="url"
            label="URL"
            value={value}
            placeholder='http://localhost:8545'
            onChange={handleUrlChange}
            variant="outlined"
            size="small"
            fullWidth
         />
         <button
            variant="contained"
            color="primary"
            onClick={handleUrlSet}
         >
            Set
         </button>
      </div >
   );
}

const ConnectionMnemonic = ({ mnemonic, mnemonicSet }) => {
   const [value, setValue] = useState(mnemonic);

   const handleMnemonicChange = (event) => {
      setValue(event.target.value);
   };

   const handleMnemonicSet = () => {
      mnemonicSet(value);
   };

   const styles = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
   };

   return (
      <div className="input" style={styles}>
         <input type="text"
            id="mnemonic"
            label="Mnemonic"
            value={value}
            placeholder={'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'}
            onChange={handleMnemonicChange}
            variant="outlined"
            size="small"
            fullWidth
         />
         <button
            variant="contained"
            color="primary"
            onClick={handleMnemonicSet}
         >
            Set
         </button>
      </div>
   );
}

const ConnectionPanel = ({ url, urlSet, mnemonic, mnemonicSet }) => {
   const styles = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
   };
   return (
      <div className="panel" style={styles}>
         <ConnectionProviderUrl url={url} urlSet={urlSet} />
         <ConnectionMnemonic mnemonic={mnemonic} mnemonicSet={mnemonicSet} />
      </div>
   );
}

// input field to gather address
const ContractAddress = ({ address, onChange }) => (
   <input style={{ marginBottom: '1rem' }}
      type="text"
      id="address"
      label="Address"
      value={address}
      placeholder='0x5FbDB2315678afecb367f032d93F642f64180aa3'
      onChange={onChange}
      variant="outlined"
      size="small"
      fullWidth
   />
)

// uses a textarea to gather the ABI from the user
const ABI = ({ abi, onChange }) => (
   <textarea style={{ marginBottom: '1rem' }}
      id="abi"
      label="ABI"
      value={abi}
      onChange={onChange}
      variant="outlined"
      size="small"
      fullWidth
   />
)

const ContractAddressABIPanel = ({ address, addressSet, abi, abiSet }) => {
   const styles = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
   }
   return (
      <div className="panel" style={styles}>
         <ContractAddress address={address} onChange={addressSet} />
         <ABI abi={abi} onChange={abiSet} />
      </div>
   );
}

const WaitSpinner = ({ }) => {
   const styles = {
      waitSpinner: {
         position: 'absolute',
         top: '50%',
         left: '50%',
         transform: 'translate(-50%, -50%)',
         width: '100px',
         height: '100px',
      },
      waitSpinnerInner: {
         position: 'relative',
         width: '100%',
         height: '100%',
      },
      waitSpinnerCircle: {
         position: 'absolute',
         top: '0',
         left: '0',
         width: '100%',
         height: '100%',
         borderRadius: '50%',

         animation: 'waitSpinnerCircle 1.5s infinite ease-in-out',
      },
      waitSpinnerCircle1: {
         backgroundColor: '#ff0000',
         animationDelay: '-0.45s',
      },
      waitSpinnerCircle2: {
         backgroundColor: '#00ff00',
         animationDelay: '-0.3s',
      },
      waitSpinnerCircle3: {
         backgroundColor: '#0000ff',
         animationDelay: '-0.15s',
      },
      waitSpinnerShadow: {
         position: 'absolute',
         top: '0',
         left: '0',
         width: '100%',
         height: '100%',
         borderRadius: '50%',
         boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
      },
      '@keyframes waitSpinnerCircle': {
         '0%': {
            transform: 'rotate(0deg)',
         },
         '100%': {
            transform: 'rotate(360deg)',
         },
      },
   }
   return (
      <div className="waitspinner" style={styles.waitSpinner}>
         <div className="waitspinner__inner" style={styles.waitSpinnerInner}>
            <div className="waitspinner__circle" style={Object.assign({}, styles.waitSpinnerCircle, styles.waitSpinnerCircle1)}></div>
            <div className="waitspinner__circle" style={Object.assign({}, styles.waitSpinnerCircle, styles.waitSpinnerCircle2)}></div>
            <div className="waitspinner__circle" style={Object.assign({}, styles.waitSpinnerCircle, styles.waitSpinnerCircle3)}></div>
            <div className="waitspinner__shadow" style={styles.waitSpinnerShadow}></div>
         </div>
      </div >
   )
}

// rrender a method with inputs and a call button. Formatted like a method call:
// functionName(input1, input2, ...) clicking on a parameter puts it in edit mode, blurring out sets the value
const ABIMethodPanel = ({ contract, methodAbi, onMethodCall }) => {
   const [inputs, setInputs] = useState([]);
   const [output, setOutput] = useState(null);
   const [loading, setLoading] = useState(false);

   const handleInputBlur = (event, index) => {
      const newInputs = [...inputs];
      newInputs[index] = event.target.value;
      setInputs(newInputs);
   };

   const handleInputClick = (event, index) => {
      const newInputs = [...inputs];
      newInputs[index] = '';
      setInputs(newInputs);
   };

   const handleCall = async () => {
      setLoading(true);
      try {
         const result = await contract[methodAbi.name](...inputs);
         setOutput(result);
      } catch (e) {
         setOutput(e);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="abi">
         <div className="abi__name">{methodAbi.name}</div>
         <div className="abi__inputs">
            {methodAbi && methodAbi.inputs && methodAbi.inputs.map((input, index) =>
               <div className="abi__input" key={index}>
                  <div className="abi__input__name">{input.name}</div>
                  <input
                     key={index}
                     type="text"
                     id={input.name}
                     label={input.name}
                     value={inputs[index]}
                     placeholder={input.type}
                     onChange={(event) => handleInputBlur(event, index)}
                     onClick={(event) => handleInputClick(event, index)}
                     variant="outlined"
                     size="small"
                     fullWidth
                  />
               </div>
            )}
         </div>
         <button
            variant="contained"
            color="primary"
            onClick={handleCall}
         >
            Call
         </button>
         {loading && <WaitSpinner />}
         <div className="abi__output">{JSON.stringify(output)}</div>
      </div>
   );
}

// render all the methods of the contract
const ContractPanel = ({ contract, abi }) => {
   const abiMethods = abi ? abi.filter((abi) => abi.type === 'function') : [];
   return (
      <div className="panel">
         {abiMethods && abiMethods.map((abiMethod) => (
            <ABIMethodPanel key={abiMethod.name} contract={contract} methodAbi={abiMethod} />
         ))}
      </div>
   );
}


// shows children panel one at a time with a back and next button
const WizardPanelContainer = ({ children }) => {
   const [index, setIndex] = useState(0);

   const handleNext = () => {
      setIndex(index + 1);
   };

   const handleBack = () => {
      setIndex(index - 1);
   };

   return (
      <div className="panel">
         {children[index]}
         <button
            variant="contained"
            color="primary"
            onClick={handleBack}
            disabled={index === 0}
         >
            Back
         </button>
         <button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={index === children.length - 1}
         >
            Next
         </button>
      </div>
   );
}

export default function App() {
   const [url, setUrl] = useState('http://localhost:8545');
   const [mnemonic, setMnemonic] = useState('candy maple cake sugar pudding cream honey rich smooth crumble sweet treat');
   const [address, setAddress] = useState(cdata.address);
   const [abi, setAbi] = useState(cdata.abi);
   const [contract, setContract] = useState(null);

   const urlSet = (url) => {
      setUrl(url);
      updateContract();
   };

   const mnemonicSet = (mnemonic) => {
      setMnemonic(mnemonic);
      updateContract();
   };

   const addressSet = (event) => {
      setAddress(event.target.value);
      updateContract();
   };

   const abiSet = (event) => {
      setAbi(event.target.value);
      updateContract();
   };

   const updateContract = () => {
      if (url && mnemonic && address && abi) {
         const provider = new ethers.providers.JsonRpcProvider(url);
         const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
         const _contract = new ethers.Contract(address, abi, wallet);
         setContract(_contract);
      }
   }

   return (
      <div className="container">
         < h1 > Contract Wizard</h1 >
         <WizardPanelContainer>
            <ConnectionPanel url={url} urlSet={urlSet} mnemonic={mnemonic} mnemonicSet={mnemonicSet} />
            <ContractAddressABIPanel address={address} addressSet={addressSet} abi={abi} abiSet={abiSet} />
            <ContractPanel contract={contract} abi={abi} />
         </WizardPanelContainer>
      </div >
   );
}
