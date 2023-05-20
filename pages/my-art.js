/* pages/my-art.js */
import { ethers } from 'ethers'
import { flippandoBundlerAddress } from '../config'
import FlippandoBundler from '../artifacts/contracts/FlippandoBundler.sol/FlippandoBundler.json'


import { useEffect, useState } from 'react';
import ArtworkComponent from '../components/ArtworkComponent';

const FlippandoNFTs = () => {
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });
  const [tokenURIs, setTokenURIs] = useState([]);
  const [revealMatrix, setRevealMatrix] = useState([]);


  useEffect(() => {
    if (ownedNFTs.length > 0) {
      getBoardDimensions(ownedNFTs[0]);
    }
  }, [ownedNFTs]);

  useEffect(() => {
    if (ownedNFTs.length > 0) {
      revealBundledNFTs(ownedNFTs);
    }
  }, [ownedNFTs]);

  useEffect(() => {
    const getOwnedNFTs = async () => {
      try {
        // Connect to the Ethereum network
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Contract address and ABI
        const flippandoBundlerABI = FlippandoBundler.abi;

        // Get the user's account address
        const accounts = await provider.listAccounts();
        const userAddress = accounts[0];

        // Create a contract instance
        const flippandoBundlerContract = new ethers.Contract(flippandoBundlerAddress, flippandoBundlerABI, provider);

        // Get the balance of NFTs owned by the user
        const balance = await flippandoBundlerContract.balanceOf(userAddress);
        console.log('balance ' + balance)

        // Iterate over the NFTs and retrieve their token IDs
        const tokenIds = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await flippandoBundlerContract.tokenOfOwnerByIndex(userAddress, i);
          console.log('tokenId ' + tokenId)
          const tokenIdInt = parseInt(tokenId._hex, 16);
          tokenIds.push(tokenIdInt);
        }

        setOwnedNFTs(tokenIds);
        
      } catch (error) {
        console.log('Error:', error);
      }
    };
    getOwnedNFTs();
  }, []);



  const getTokenURI = async (tokenId) => {
    try {
      // Connect to the Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Contract address and ABI
      const flippandoBundlerABI = FlippandoBundler.abi;

      // Create a contract instance
      const flippandoBundlerContract = new ethers.Contract(flippandoBundlerAddress, flippandoBundlerABI, provider);

      // Retrieve the token URI
      const tokenURI = await flippandoBundlerContract.tokenURI(tokenId);

      return tokenURI;
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getBoardDimensions = async (tokenId) => {
    try {
      // Connect to the Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Contract address and ABI
      const flippandoBundlerABI = FlippandoBundler.abi;

      // Create a contract instance
      const flippandoBundlerContract = new ethers.Contract(flippandoBundlerAddress, flippandoBundlerABI, provider);

      // Retrieve the board dimensions from the bundled artwork
      const artwork = await flippandoBundlerContract.artworks(tokenId);
      console.log('artwork first ' + JSON.stringify(artwork, null, 2));
      const boardWidth = artwork.boardWidth;
      const boardHeight = artwork.boardHeight;

      setBoardDimensions({ width: boardWidth, height: boardHeight });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getArtwork = async (tokenId) => {
    try {

      // Connect to the Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Contract address and ABI
      const flippandoBundlerABI = FlippandoBundler.abi;

      // Create a contract instance
      const flippandoBundlerContract = new ethers.Contract(flippandoBundlerAddress, flippandoBundlerABI, provider);
      const artwork = await flippandoBundlerContract.artworks(tokenId);
      //console.log('artwork getArtwork ' + JSON.stringify(artwork));
      // Convert BigNumber values to regular numbers
        const buildingBlocks = artwork[0].map((block) => block.toNumber());
        const boardWidth = artwork[1].toNumber();
        const boardHeight = artwork[2].toNumber();

        console.log('Artwork:', {
            buildingBlocks,
            boardWidth,
            boardHeight,
        });
      return {
        buildingBlocks: buildingBlocks,
        boardWidth: boardWidth,
        boardHeight: boardHeight,
      };
    } catch (error) {
      console.error('Error retrieving Artwork:', error);
      return null;
    }
  }

  const revealBundledNFTs = async (tokenId) => {
      //console.log('revealBundledNFTs for tokenID ' + tokenId)
      return <ArtworkComponent tokenId={tokenId} />
    
  };

  return (
    <div>
      <h1>My Art</h1>
      <h2>Composed NFTs:</h2>
      <ul>
        {ownedNFTs.map((tokenId, index) => (
          <li key={index}>{tokenId}
          <ArtworkComponent tokenId={tokenId} />
          </li>
        ))}
        
      </ul>
      
    </div>
  );
};

export default FlippandoNFTs;
