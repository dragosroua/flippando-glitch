import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    flippandoAddress
  } from '../config'
import Tile from './Tile'  
import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'


const NFTList = () => {
  const [nfts, setNfts] = useState([]);
  //console.log('nfts ' + JSON.stringify(nfts, null, 2));

  useEffect(() => {
    const fetchNFTs = async () => {
      // Connect to the Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(flippandoAddress, Flippando.abi, signer);

      // Get the current user's address
      const userAddress = await signer.getAddress();

      // Call the getUserNFTs function from the smart contract
      const tokenIds = await contract.getUserNFTs({ from: userAddress });
      /*const totalSupply = await contract.methods.totalSupply().call();
      const tokenIds = [];
  
      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await contract.methods.tokenByIndex(i).call();
        tokenIds.push(tokenId);
        console.log(JSON.stringify(tokenId));
      }*/
      // Retrieve tokenURI metadata for each NFT
      const nftData = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const tokenUri = await contract.tokenURI(tokenId);
          const response = await fetch(tokenUri);
          const metadata = await response.text();
          //console.log("metadata " + metadata)
          if(metadata !== undefined && metadata !== null){
            return {
              tokenId: tokenId.toString(),
              metadata: JSON.parse(metadata),
            };
        }
        })
      );

      setNfts(nftData);
    };

    fetchNFTs();
  }, []);

  return (
    <div>
      <ul style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: "20px" }}>
        {nfts.map((nft) => (
          <li key={nft.tokenId}>
            <Tile tokenId={nft.tokenId} metadata={JSON.stringify(nft.metadata)} />
          </li>
        ))}
      </ul>
    </div>

  );
  
};

export default NFTList;
