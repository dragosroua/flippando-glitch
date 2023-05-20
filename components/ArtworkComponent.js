import React, { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { flippandoBundlerAddress } from '../config'
import FlippandoBundler from '../artifacts/contracts/FlippandoBundler.sol/FlippandoBundler.json'
import RenderCompositeNFT from './RenderCompositeNFT';

function ArtworkComponent({ tokenId }) {
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
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

        await flippandoBundlerContract.getArtwork(tokenId).then( (rawArtwork) => {
            console.log('rawArtwork ' + JSON.stringify(rawArtwork, null, 2));
            // Deserialize the raw artwork
            
            const boardWidth = ethers.BigNumber.from(rawArtwork[0]);
            const boardHeight = ethers.BigNumber.from(rawArtwork[1]);
            const buildingBlocks = rawArtwork[2].map((item) => ethers.BigNumber.from(item));
            //const boardWidth = rawArtwork[0];
            //const boardHeight = rawArtwork[1];
            //const buildingBlocks = rawArtwork[2];

            const deserializedArtwork = {
                buildingBlocks,
                boardWidth,
                boardHeight,
            };

            setArtwork(deserializedArtwork);
        })
        
      } catch (error) {
        console.error('Error retrieving Artwork:', error);
        setArtwork(null);
      }
    }

    fetchArtwork();
  }, [tokenId]);

  if (!artwork) {
    return <div>Loading artwork...</div>;
  }

  // Render the artwork component
  return (
    <div>
      {<RenderCompositeNFT artwork={artwork} tokenId={tokenId} />}
    </div>
  );
}

export default ArtworkComponent;
