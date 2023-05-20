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