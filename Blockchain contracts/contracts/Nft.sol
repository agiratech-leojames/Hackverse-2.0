// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IncubeDeFi is ERC721, Ownable {
    constructor()
        ERC721("IncubeDeFi", "IDF")
    {}

    mapping(uint => bool) public mintForIdentity;

    function mintNFT(uint _identificationNumber, address to, uint256 tokenId) external{
        mintForIdentity[_identificationNumber] = true;
        _safeMint(to, tokenId);
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function readStatusOfNft(uint _identificationNumber) external view returns(bool){
        return mintForIdentity[_identificationNumber];
    }
}
