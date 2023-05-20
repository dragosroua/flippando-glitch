import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    flippandoAddress,
    flippandoBundlerAddress
  } from '../config'
import SmallTile from './SmallTile'  
import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'
import FlippandoBundler from '../artifacts/contracts/FlippandoBundler.sol/FlippandoBundler.json'


const NFTListUser = () => {

  const [allNfts, setAllNfts] = useState([]);
  const [artworkNFTs, setArtworkNFTs] = useState([]);
  const [remainingNfts, setRemainingNfts] = useState([]);
  //console.log('nfts ' + JSON.stringify(nfts, null, 2));

  useEffect(() => {
    getArtworkNFTs();
    fetchNFTs();
  }, []);

  useEffect(() => {
    filterNfts(remainingNfts);
  });


  const filterNfts = (allNfts, artworkNFTs) => {
    const remainingNfts = allNfts.filter((nft) => {
      return !artworkNFTs.some((artworkNFT) => {
        return artworkNFT.tokenId === nft.tokenId;
      });
    });
    setRemainingNfts(remainingNfts);
  }
  const fetchNFTs = async () => {
    // Connect to the Ethereum network
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(flippandoAddress, Flippando.abi, signer);

    // Get the current user's address
    const userAddress = await signer.getAddress();

    // Call the getUserNFTs function from the smart contract
    const tokenIds = await contract.getUserNFTs({ from: userAddress });
   
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

    setAllNfts(nftData);
  };

  const getArtworkNFTs = async () => {
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
        const containedNfts = await flippandoBundlerContract.getArtwork(tokenId);
        for (let m = 0; m < containedNfts.length; m++) {
          const nftId = containedNfts[m];
          tokenIds.push(nftId);  
        }
        
      }

      setArtworkNFTs(tokenIds);
      
    } catch (error) {
      console.log('Error:', error);
    }
  };
 


  return (
    <div>
      <h3>NFTs available for art</h3>
      <div>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: "20px" }}>
          {remainingNfts !== 0 && remainingNfts.map((nft) => (
            <li key={nft.tokenId}>
              <SmallTile tokenId={nft.tokenId} metadata={JSON.stringify(nft.metadata)} />
            </li>
          ))}
        </ul>
      </div>
      <h3>Artwork NFTs</h3>
      <div>
      <ul style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: "20px" }}>
        {artworkNFTs !== 0 && artworkNFTs.map((nft) => (
          <li key={nft.tokenId}>
            <SmallTile tokenId={nft.tokenId} metadata={JSON.stringify(nft.metadata)} />
          </li>
        ))}
      </ul>
      </div>
    </div>

  );
  
};

export default NFTListUser;
