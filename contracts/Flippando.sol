// SPDX-License-Identifier: CC-0
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";
import "hardhat/console.sol";

struct Artwork {
            uint256 boardWidth;
            uint256 boardHeight;
            uint256[] buildingBlocks;
        }

interface ISVG {
    function generateGrid(uint8[] memory solvedBoard, string memory gridType) external pure returns(string memory);
}

interface IFLIP {  
    function mintLocked(address recipient, uint256 tokenId, uint256 tokenAmount) external;
    function unlockAndTransfer(address recipient, uint256 tokenId) external;
}

interface IFLIPPANDOBUNDLER {  
    function bundleAssets(uint256 boardWidth, uint256 boardHeight, uint256[] memory tokenIds, address _newOwner) external returns(Artwork memory);
    function isPartOfArtwork(uint256 tokenId) external returns(bool);
}


contract Flippando is ERC721URIStorage, ERC721Enumerable {
    
    ISVG public svg;
    IFLIP public flip;
    IFLIPPANDOBUNDLER public flippandoBundler;

    struct Game {
        uint8[] board;
        uint8[] solvedBoard;
        string gameLevel;
        string gameType;
        address player;
        string id;
        uint256[] gameTiles;
    }

    struct positions {
        uint32 position1;
        uint32 position2;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using Strings for uint256;
    address payable owner;

    event GameCreated(string id, Game game, address indexed player);
    event GameState(string indexed id, Game game, uint32[2] positions);
    event GameSolved(string id, Game game);
    event NFTCreated(string id, uint256 tokenId);
    event ArtworkCreated(Artwork createdArtwork);
    
    mapping(string => Game) public games;
    mapping(uint256 => bool) public inTransit;

    constructor(address _svgAddress, address _flipAddress, address _flippandoBundlerAddress) ERC721("Flippando Universe", "FLIP") {
        owner = payable(msg.sender);
        svg = ISVG(_svgAddress);
        flip = IFLIP(_flipAddress);
        flippandoBundler = IFLIPPANDOBUNDLER(_flippandoBundlerAddress);
    }

    // game logic functions
    function create_game(string memory id, uint256 boardSize, string memory gameType) public  {
        require(isValidGameType(gameType), "Invalid game type");
        require(isValidGameLevel(boardSize), "Invalid game level");
        games[id].player = msg.sender;
        games[id].id = id;
        games[id].board = new uint8[](boardSize);
        games[id].solvedBoard = new uint8[](boardSize);
        games[id].gameLevel = boardSize.toString();
        games[id].gameType = gameType;
        if (keccak256(bytes(gameType)) == keccak256(bytes("squareGrid"))) {
            games[id].gameTiles = _generateRandomNumbers(16, boardSize/4);
        } else if (keccak256(bytes(gameType)) == keccak256(bytes("dice"))) {
            games[id].gameTiles = _generateRandomNumbers(6, boardSize/4);
        } else if (keccak256(bytes(gameType)) == keccak256(bytes("hexagrams")) || 
            keccak256(bytes(gameType)) == keccak256(bytes("sponsored"))) 
            {
            games[id].gameTiles = _generateRandomNumbers(4, boardSize/4);
        } else {
            revert("Unsupported game type");
        }

        emit GameCreated(id, games[id], msg.sender);
    }

    function flip_tiles(string memory id, uint32[2] memory boardPositions) public {
        // sanity checks
        require(games[id].player != address(0), "Game does not exist");
        require(boardPositions[0] >= 0, "You can not flip a tile at a position < 0, valid positions are between 0 and board size");
        require(boardPositions[0] < games[id].board.length, "You can not flip a tile at that position, out of bounds");
        require(boardPositions[1] >= 0, "You can not flip a tile at a position < 0, valid positions are between 0 and board size");
        require(boardPositions[1] < games[id].board.length, "You can not flip a tile at that position, out of bounds");
        
        uint randomnumber1;
        uint randomnumber2;
        
        randomnumber1 = (uint(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % (games[id].board.length / 4)) + 1;
        randomnumber2 = (uint(keccak256(abi.encodePacked(block.timestamp + 1064, block.number, msg.sender))) % (games[id].board.length / 4)) + 1;
    
        if (games[id].board[boardPositions[0]] == 0){
            games[id].board[boardPositions[0]] = uint8(games[id].gameTiles[randomnumber1 - 1]);
        }

        if (games[id].board[boardPositions[1]] == 0){
            games[id].board[boardPositions[1]] = uint8(games[id].gameTiles[randomnumber2 - 1]);
        }

        if(games[id].board[boardPositions[0]] == games[id].board[boardPositions[1]]){
            games[id].solvedBoard[boardPositions[0]] = games[id].board[boardPositions[0]];
            games[id].solvedBoard[boardPositions[1]] = games[id].board[boardPositions[1]];
        }

        // enforce solvability
        uint256 quantum_threshold = sqrt(games[id].board.length);
        uint256 unsolved_tiles = 0;

        for (uint j = 0; j < games[id].board.length; j++) {
            if(games[id].solvedBoard[j] == 0){
                unsolved_tiles = unsolved_tiles + 1;
            }
        }

        if(unsolved_tiles <= quantum_threshold){
            // replace the board with solvedBoard and redeloy
            if(games[id].board[boardPositions[0]] != games[id].board[boardPositions[1]]){
                games[id].board[boardPositions[0]] = games[id].board[boardPositions[1]];
                games[id].solvedBoard[boardPositions[0]] = games[id].solvedBoard[boardPositions[1]] = games[id].board[boardPositions[0]];
            }
        }

        emit GameState(id, games[id], boardPositions);
        // check for game solved
        unsolved_tiles = 0;

        for (uint j = 0; j < games[id].board.length; j++) {
            if(games[id].solvedBoard[j] == 0){
                unsolved_tiles = unsolved_tiles + 1;
            }
        }
        if(unsolved_tiles == 0){
          emit GameSolved(id, games[id]);
        }

    }

    
    /* overriding imported functions */

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        return super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        return super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }


    /* Mints an NFT */
  
    function create_nft(string memory id) public {
        // sanity checks
        require(games[id].player == msg.sender, "Only the game's player can create the NFT");
        require(bytes(id).length >= 0, "The game you're trying to mint doesn't exist");
        require(boardHasZeroValues(games[id].solvedBoard) == false, "You can't mint an unsolved game");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        string memory onChainTokenURI = generateTokenURI(newTokenId, id);
        _setTokenURI(newTokenId, onChainTokenURI);
        setApprovalForAll(address(flippandoBundler), true);
        
        // mint the locked token associated with the game
        
        uint256 tokenAmount;
        if(keccak256(abi.encodePacked(games[id].gameType)) == keccak256(abi.encodePacked("sponsored")) ){
            tokenAmount = 4;
        } else {
            tokenAmount = 1;
        }
        flip.mintLocked(games[id].player, newTokenId, tokenAmount);
        
        // preventing the user to mint the same game again
        resetGame(id);
        emit NFTCreated(id, newTokenId);
    }

    function resetGame(string memory id) private {
        Game storage game = games[id];
        game.board = new uint8[](game.board.length);
        game.solvedBoard = new uint8[](game.board.length);
    }

    function create_single_test_nft(string memory gameType) public {
        uint8[] memory testBoard = new uint8[](16);
        
        testBoard[0] = 1;
        testBoard[1] = 2;
        testBoard[2] = 4;
        testBoard[3] = 1;
        testBoard[4] = 2;
        testBoard[5] = 4;
        testBoard[6] = 3;
        testBoard[7] = 3;
        testBoard[8] = 4;
        testBoard[9] = 1;
        testBoard[10] = 2;
        testBoard[11] = 4;
        testBoard[12] = 3;
        testBoard[13] = 1;
        testBoard[14] = 2;
        testBoard[15] = 3;
           
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        string memory onChainTokenURI = generateTestTokenURI(newTokenId, testBoard, gameType);
        _setTokenURI(newTokenId, onChainTokenURI);
        setApprovalForAll(address(flippandoBundler), true);
        flip.mintLocked(msg.sender, newTokenId, 1);
        emit NFTCreated("testGame", newTokenId);
        
    }

    function generateTestTokenURI(uint256 tokenId, uint8[] memory testBoard, string memory gameType) public view returns (string memory) {
        uint256 gasLimit = 500000000;
        string memory svgImage = svg.generateGrid{gas: gasLimit}(testBoard, gameType);
        string memory jsonSVGTest = Base64.encode(bytes(abi.encodePacked('{',
            '"name": "Flippando - The Game ',tokenId.toString(),'",',
            '"description": "A Flippando game played on the blockchain.",',
            '"game_version": "0.1.0 / Blue Ocean",',
            '"game_id": "testGame",',
            '"game_type": "squareGrid",',
            '"image": "data:image/svg+xml;base64,', svgImage, '"',
            '}')));

        return string(abi.encodePacked("data:application/json;base64,", jsonSVGTest));
    }
    
    function makeArt(uint256 boardWidth, uint256 boardHeight, uint256[] memory tokenIds) public {
        require(tokenIds.length == boardWidth * boardHeight, "Number of tokenIds must match the board size");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            address currentOwner = ownerOf(tokenIds[i]);

            require(currentOwner != msg.sender, "Can't use your own NFTs");
            require(isApprovedForAll(currentOwner, address(flippandoBundler)), "NFT is not approved for all");
            
            // Check that the NFT is not already part of another artwork and not in transit
            require(!flippandoBundler.isPartOfArtwork(tokenIds[i]), "NFT is part of another artwork");
            require(!inTransit[tokenIds[i]], "NFT is in transit");

            // Unlock and transfer FLIP tokens
            flip.unlockAndTransfer(currentOwner, tokenIds[i]);

            // Transfer NFTs to the new owner
            _safeTransfer(currentOwner, msg.sender, tokenIds[i], "");

            // Set NFT in transit to prevent double use
            inTransit[tokenIds[i]] = true;
        }

        // Call bundleAssets in FlippandoBundler
        Artwork memory generatedArtwork = flippandoBundler.bundleAssets(boardWidth, boardHeight, tokenIds, msg.sender);
        
        emit ArtworkCreated(generatedArtwork);
        
        // After successful bundling, mark NFTs as not in transit
        for (uint256 i = 0; i < tokenIds.length; i++) {
            inTransit[tokenIds[i]] = false;
        }
    }


    function generateTokenURI(uint256 tokenId, string memory id) public view returns (string memory) {
        Game memory game = games[id];
        string memory svgImage = svg.generateGrid(game.solvedBoard, game.gameType);
        string memory jsonTokenURI = Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name": "Flippando - The Game ',tokenId.toString(), 
                    '","description": "A Flippando game played on the blockchain.","game_version": "0.1.0 / Blue Ocean","game_id": "',id,
                    '","game_type": "',game.gameType, 
                    '","game_level": "',game.gameLevel, 
                    '","image": "data:image/svg+xml;base64,', svgImage, 
                    '"}'
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", jsonTokenURI));
    }


    function getUserNFTs() public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(msg.sender);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(msg.sender, i);
        }
        return tokenIds;
    }
    
    
    //utils

    function boardHasZeroValues(uint8[] memory arr) public pure returns (bool) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == 0) {
                return true;
            }
        }
        return false;
    }


    function sqrt(uint256 x) private pure returns (uint256) {
      uint256 z = (x + 1) / 2;
      uint256 y = x;
      while (z < y) {
          y = z;
          z = (x / z + z) / 2;
      }
      return y;
    }

    function _generateRandomNumbers(uint256 range, uint256 count) private view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 index = uint256(keccak256(abi.encodePacked(msg.sender, block.number, i))) % range;

            for (uint256 j = 0; j < i; j++) {
                if (result[j] == index) {
                    index = (index + 1) % range;
                    j = 0;
                }
            }

            result[i] = index + 1; // Shift the value by 1
        }

        return result;
    }


    function isValidGameLevel(uint256 boardSize) private pure returns (bool) {
        return (boardSize == 16 || boardSize == 64 || boardSize == 128);
    }

    function isValidGameType(string memory gameType) private pure returns (bool) {
        return (
            keccak256(abi.encodePacked(gameType)) == keccak256(abi.encodePacked("sponsored")) ||
            keccak256(abi.encodePacked(gameType)) == keccak256(abi.encodePacked("squareGrid")) ||
            keccak256(abi.encodePacked(gameType)) == keccak256(abi.encodePacked("dice")) ||
            keccak256(abi.encodePacked(gameType)) == keccak256(abi.encodePacked("hexagrams"))
        );
    }
    

}