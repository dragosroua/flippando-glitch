import React, { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { flippandoAddress, flippandoBundlerAddress } from '../config'
import FlippandoBundler from '../artifacts/contracts/FlippandoBundler.sol/FlippandoBundler.json'
import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'
import SmallTile from './SmallTile';
import styles from '../styles/Home.module.css'

function RenderCompositeNFT({ tokenId, artwork }) {
    console.log('artwork ' + JSON.stringify(artwork));
    const [nfts, setNfts] = useState([]);
    const buildingBlocks = artwork.buildingBlocks;
    const boardWidth = artwork.boardWidth;
    const boardHeight = artwork.boardHeight; 
    const levelBoard = new Array(boardWidth, boardHeight).fill(0);

    useEffect(() => {
        fetchNFTs();
    }, []);
  
    const fetchNFTs = async () => {
      // Connect to the Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(flippandoAddress, Flippando.abi, signer);
  
      // Get the current user's address
      const userAddress = await signer.getAddress();
  
      try {
      // Call the getUserNFTs function from the smart contract
      // Retrieve tokenURI metadata for each NFT
      console.log('buildingBlocks ' + JSON.stringify(buildingBlocks));
      const nftData = await Promise.all(
        buildingBlocks.map(async (childTokenId) => {
            console.log('childTokenId ' + childTokenId)
          const tokenUri = await contract.tokenURI(childTokenId);
          const response = await fetch(tokenUri);
          const metadata = await response.text();
          console.log("metadata " + metadata)
          if(metadata !== undefined && metadata !== null){
            return {
              tokenId: childTokenId.toString(),
              metadata: JSON.parse(metadata),
            };
          }
          else {
            console.log('error');
          }
        })
        )
        setNfts(nftData);
      }
      catch {
        console.log('error, exception in the getUserNFTs contract function call')
      }
    };

  if (!nfts) {
    return <div>Loading composite NFT...</div>;
  }

  /*const renderBoard = () => {
    
    for (let i = 0; i < nfts.length; i++){
        levelBoard[i] = nfts[i];
    }
    return levelBoard.map( (value, index) => {
      return(
        <span key={index}>
            <SmallTile metadata={JSON.stringify(value.metadata)}/>
        </span>
      )
    })
  }*/


  const renderBoard = () => {
    const gridItems = [];
  
    for (let row = 0; row < artwork.boardHeight; row++) {
      for (let col = 0; col < artwork.boardWidth; col++) {
        const index = row * artwork.boardWidth + col;
        const value = nfts[index];
  
        gridItems.push(
          <span key={index} className={styles.gridItem}>
              <SmallTile metadata={JSON.stringify(value.metadata)} />
          </span>
        );
      }
    }
  
    //return <div className={styles.gridContainer}>{gridItems}</div>;
    return <div className={`inline-grid grid-cols-${artwork.boardWidth} grid-rows-${artwork.boardHeight} gap-x-0 gap-y-0`}>{gridItems}</div>;
  };

  // Render the artwork component
  return (
    <div>
      <h2>Composite NFT Details</h2>
      {nfts.length !== 0 && renderBoard()}
    </div>
  );
}

export default RenderCompositeNFT;
