//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RealEstate is ERC721URIStorage {

// Add counter to increment the number of properties listed
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    constructor() ERC721("Real-Estate", "RM") {}

    function mint(string memory tokenURI) public returns (uint256) {

    _tokenIDs.increment();
    uint newItemId = _tokenIDs.current();

    _mint(msg.sender, newItemId) ;
    _setTokenURI(newItemId, tokenURI);

    return newItemId;
    }

    function totalSupply() public view returns (uint) {
        uint _tokenIds = _tokenIDs.current();
        return _tokenIds;
    }

    //Mint a new token ID with link to URI
    // Count how many have been creaated and return URI based on URD

}