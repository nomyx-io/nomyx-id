/* global ethers */

import ethers from "ethers";

export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

// get function selectors from ABI
export function getSelectors(contract: {
  interface: { functions: {}; getSighash: (arg0: string) => any };
}) {
  const signatures = Object.keys(contract.interface.functions);
  const selectors: any = signatures.reduce((acc: any, val: any) => {
    if (val !== "init(bytes)") {
      acc.push(contract.interface.getSighash(val));
    }
    return acc;
  }, []);
  selectors.contract = contract;
  selectors.remove = remove;
  selectors.get = get;
  return selectors;
}

// get function selectors from ABI
export function getSelectorsIndex(contract: {
  interface: { functions: {}; getSighash: (arg0: string) => any };
}) {
  const signatures = Object.keys(contract.interface.functions);
  const selectors: any = signatures.reduce((acc: any, val: any) => {
    if (val !== "init(bytes)") {
      const o: any = {};
      o[contract.interface.getSighash(val)] = val;
      acc.push(o);
    }
    return acc;
  }, []);
  selectors.contract = contract;
  selectors.remove = remove;
  selectors.get = get;
  return selectors;
}

// get function selector from function signature
export function getSelector(func: any) {
  const abiInterface = new ethers.utils.Interface([func]);
  return abiInterface.getSighash(ethers.utils.Fragment.from(func));
}

// get function selectors from ABI
export function getSelectorsAfterRemoveOtherFn(
  contract: { interface: { functions: {}; getSighash: (arg0: string) => any } },
  functionNames: any
) {
  const signatures = Object.keys(contract.interface.functions);
  const selectors = signatures.reduce((acc: any, val: any) => {
    if (val !== "init(bytes)") {
      acc.push(contract.interface.getSighash(val));
    }
    return acc;
  }, []);
  selectors.contract = contract;
  selectors.remove = remove;
  selectors.get = get;
  return selectors.remove(functionNames);
}

// get function selectors from ABI
export function getSpecificSelector(
  contract: { interface: { functions: {}; getSighash: (arg0: string) => any } },
  functionNames: any
) {
  const signatures = Object.keys(contract.interface.functions);
  const selectors = signatures.reduce((acc: any, val: any) => {
    if (val !== "init(bytes)") {
      acc.push(contract.interface.getSighash(val));
    }
    return acc;
  }, []);
  selectors.contract = contract;
  selectors.remove = remove;
  selectors.get = get;
  return selectors.get(functionNames);
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
export function remove(this: any, functionNames: any) {
  const selectors = this.filter((v: any) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return false;
      }
    }
    return true;
  });
  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;
  return selectors;
}

// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
export function get(this: any, functionNames: any) {
  const selectors = this.filter((v: any) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return true;
      }
    }
    return false;
  });
  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;
  return selectors;
}

// remove selectors using an array of signatures
export function removeSelectors(selectors: any[], signatures: any[]) {
  const iface = new ethers.utils.Interface(
    signatures.map((v: string) => "function " + v)
  );
  const removeSelectors = signatures.map((v: any) => iface.getSighash(v));
  selectors = selectors.filter((v: any) => !removeSelectors.includes(v));
  return selectors;
}

// find a particular address position in the return value of diamondLoupeFacet.facets()
export function findAddressPositionInFacets(
  facetAddress: any,
  facets: string | any[]
) {
  for (let i = 0; i < facets.length; i++) {
    if (facets[i].facetAddress === facetAddress) {
      return i;
    }
  }
}

exports.getSelectors = getSelectors;
exports.getSelector = getSelector;
exports.FacetCutAction = FacetCutAction;
exports.remove = remove;
exports.removeSelectors = removeSelectors;
exports.findAddressPositionInFacets = findAddressPositionInFacets;
