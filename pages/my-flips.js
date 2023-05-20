/* pages/my-nfts.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import NFTListUser from '../components/NFTlistUser'

import {
    flippandoAddress
  } from '../config'
  
  import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [metadata, setMetadata] = useState("");
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    
    const web3 = new Web3();

    // Convert the hex value to a string
    const hexString = '0x01';
    // Convert the hex string to a BigNumber instance
    const bigNumber = web3.utils.toBN(hexString);
    // Convert the BigNumber instance to a string
    const tokenId = bigNumber.toString();
    var ownedNFTs = [];
    const flippandoContract = new ethers.Contract(flippandoAddress, Flippando.abi, signer) 
    
    try {
    const nfts = await flippandoContract.getUserNFTs();
    console.log(`User has ${nfts}`);
    ownedNFTs = nfts;
    } catch (error) {
    console.log(`User doesn't have nfts`);
    }  
      
    
    setLoadingState('loaded') 
  }
  function parseMetadata(metadata) {
    // Parse the metadata string and extract the SVG data
    const startIndex = metadata.indexOf("<svg");
    const endIndex = metadata.lastIndexOf("</svg>") + 6;
    return metadata.substring(startIndex, endIndex);
  }

  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }
  //if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>)
  return (
    <div className="flex justify-center">
        <NFTListUser/>
      <div className="p-4">
      <div>
        </div>
      </div>
    </div>
  )
}