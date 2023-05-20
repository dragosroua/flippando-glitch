// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract FlippandoBundler is ERC721, ERC721URIStorage, ERC721Enumerable {
    struct Artwork {
        uint256 boardWidth;
        uint256 boardHeight;
        uint256[] buildingBlocks;
    }

    // Mapping from token ID to Artwork
    mapping(uint256 => Artwork) public artworks;
    
    uint256 public nextTokenId = 0;
    address public owner;

    event BundleAssets(uint256[] tokenIds, uint256 boardWidth, uint256 boardHeight);

    constructor() ERC721("Flippando Bundler", "FBND") {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    function changeOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        return super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        return super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function bundleAssets(uint256 boardWidth, uint256 boardHeight, uint256[] calldata tokenIds, address newOwner) external onlyOwner returns (Artwork memory) {
        require(tokenIds.length == boardWidth * boardHeight, "Number of tokenIds must match the board size");
        emit BundleAssets(tokenIds, boardWidth, boardHeight);
        
        Artwork memory newArtwork;

        newArtwork.buildingBlocks = tokenIds;
        newArtwork.boardHeight = boardHeight;
        newArtwork.boardWidth = boardWidth;

        emit BundleAssets(newArtwork.buildingBlocks, newArtwork.boardWidth, newArtwork.boardHeight);

        artworks[nextTokenId] = newArtwork;

        // Mint new token to the new owner
        _mint(newOwner, nextTokenId);

        // Set token URI to a simple white circle on a black background
        _setTokenURI(nextTokenId, "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImJsYWNrIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+");

        nextTokenId++;

        return newArtwork;
    }

    function getArtwork(uint256 tokenId) public view returns (Artwork memory) {
        return artworks[tokenId];
    }

    function isPartOfArtwork(uint256 tokenId) external view returns (bool) {
        uint256 highestTokenId = nextTokenId > 0 ? nextTokenId - 1 : 0;
        for(uint256 i = 0; i <= highestTokenId; i++) {
            Artwork storage artwork = artworks[i];
            for(uint256 j = 0; j < artwork.buildingBlocks.length; j++) {
                if(artwork.buildingBlocks[j] == tokenId) {
                    return true;
                }
            }
        }
        return false;
    }

}
