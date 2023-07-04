//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IClaimTopicsRegistry } from "./IClaimTopicsRegistry.sol";
import { IIdentityRegistry } from "./IIdentityRegistry.sol";
import { ITrustedIssuersRegistry } from "./ITrustedIssuersRegistry.sol";

interface IDiamondToken is IClaimTopicsRegistry, IIdentityRegistry, ITrustedIssuersRegistry {}