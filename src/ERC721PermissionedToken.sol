// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721AFacet, TransferToNonERC721ReceiverImplementer } from "./tokens/ERC721/ERC721AFacet.sol";
import { IERC721Mint } from "./interfaces/IERC721Mint.sol";
import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { IIdentityRegistry } from "./interfaces/IIdentityRegistry.sol";
import { ERC721ALib } from "./libraries/ERC721ALib.sol";
import { Modifiers } from "./utilities/Modifiers.sol";

contract IERC721PermissionedToken is ERC721AFacet, IERC721Mint {
	address private _identityRegistryContract;

	modifier onlyIdentityContracts(address from, address to) {
		require(
			IIdentityRegistry(_identityRegistryContract).isVerified(from) &&
				IIdentityRegistry(_identityRegistryContract).isVerified(to),
			"ERC721PermissionedToken: caller is not the identity contract"
		);
		_;
	}
	modifier onlyIdentityContract(address to) {
		require(
			IIdentityRegistry(_identityRegistryContract).isVerified(to),
			"ERC721PermissionedToken: caller is not the identity contract"
		);
		_;
	}

	function setIdentityContract(address identityContract) public onlyOwner {
		_identityRegistryContract = identityContract;
	}

	function transferFrom(address from, address to, uint256 tokenId) public override onlyIdentityContracts(from, to) {
		_transfer(from, to, tokenId);
		emit ERC721ATransfer(from, to, tokenId, "");
	}

	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId
	) public override onlyIdentityContracts(from, to) {
		safeTransferFrom(from, to, tokenId, "");
	}

	function safeTransferFrom(
		address from,
		address to,
		uint256 tokenId,
		bytes memory _data
	) public override onlyIdentityContracts(from, to) {
		_transfer(from, to, tokenId);
		if (!_checkOnERC721Received(from, to, tokenId, _data)) {
			revert TransferToNonERC721ReceiverImplementer();
		}
		emit ERC721ATransfer(from, to, tokenId, _data);
	}

	function mint(uint256 quantity, bytes calldata data) external override onlyOwner returns (uint256 tokenId) {
        _mint( msg.sender, quantity, data, true);
        tokenId =  ERC721ALib.erc721aStorage().erc721Contract._currentIndex;
    }

	function mintTo(
		address receiver,
		uint256 quantity,
		bytes calldata data
	) external override onlyOwner returns (uint256 tokenId) {
        _mint(receiver, quantity, data, true);
        tokenId =  ERC721ALib.erc721aStorage().erc721Contract._currentIndex;
    }
}
