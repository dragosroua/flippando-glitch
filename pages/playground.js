/* pages/my-nfts.js */
import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import SmallTile from '../components/SmallTile';
import Grey from './assets/squares/grey.svg';
import Image from 'next/image';
import artNFT from './assets/image1.jpg';
import {
  flippandoAddress,
  flippandoBundlerAddress
} from '../config'
import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'
import FlippandoBundler from '../artifacts/contracts/FlippandoBundler.sol/FlippandoBundler.json'
import { Punk } from './assets/image1.jpg';

const ItemTypes = {
  NFT: 'nft',
};

const NFTTile = ({ nft, onAdd, onRemove }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { nft },
    type: ItemTypes.NFT,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onAdd(item);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  console.log('NFTTile nft ' + JSON.stringify(nft));
  const stringifiedNFT = JSON.stringify(nft.metadata);

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <SmallTile metadata={stringifiedNFT} tokenId={nft.tokenId} />
    </div>
  );
};

/*const Grid = ({ onAddToGrid }) => {
  const [gridItems, setGridItems] = useState([]);

  const handleDrop = (item) => {
    console.log('item.nft ' + JSON.stringify(item.nft))
    onAddToGrid(item.nft);
    setGridItems((prevItems) => [...prevItems, item.nft]);
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.NFT,
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div ref={drop} style={{ 
      border: '1px solid black', 
      backgroundColor: '#DEDEDE' }}>
      {gridItems.length !== 0 && gridItems.map((item, index) => (
        <div key={index}>
          <SmallTile metadata={JSON.stringify(item.metadata)} tokenId={item.tokenId} />
        </div>
      ))}
      {isOver && <div style={{ background: 'yellow' }}>Drop Here</div>}
    </div>
  );
};*/

const Grid = ({ onAddToGrid, width, height }) => {
  const svgCode = `<svg id="e2V0QOW8LlX1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 25 25" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
    <rect width="25" height="25" rx="0" ry="0" fill="#cAcAcA" stroke-width="0"/>
  </svg>`;

  const encodedSvg = encodeURIComponent(svgCode);
  const dataUri = `data:image/svg+xml,${encodedSvg}`;
  const placeHolder = { 'tokenId': 0, 'metadata': { image: dataUri, name: 'placeholder', description: 'description'  } };
  const [gridItems, setGridItems] = useState(new Array(width * height).fill(
    placeHolder
  ));
  const [isOverSquare, setIsOverSquare] = useState(false);

  const handleDrop = (item) => {
    onAddToGrid(item);
    setGridItems((prevItems) => [...prevItems, item]);
  };

  const handleSquareHover = (isHovering) => {
    setIsOverSquare(isHovering);
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.NFT,
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`inline-grid grid-cols-${width} grid-rows-${height} gap-x-0 gap-y-0`}
      style={{
        border: '1px solid black',
        backgroundColor: isOver ? 'yellow' : '#DEDEDE',
      }}
      onMouseEnter={() => handleSquareHover(true)}
      onMouseLeave={() => handleSquareHover(false)}
    >
      {gridItems.map((item, index) => (
        <div key={index}>
          <SmallTile metadata={JSON.stringify(item.metadata)} tokenId={item.tokenId} />
        </div>
      ))}
      {isOverSquare && (
        <div style={{ background: 'blue', height: '100%' }}>
          Drop Here
        </div>
      )}
    </div>
  );
};



export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [addedNFTs, setAddedNFTs] = useState(new Array(4 * 4).fill({tokenId: 0, metadata: {'image': Grey}}));
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);

  const handleAddNFT = (nft) => {
    setAddedNFTs((prevAddedNFTs) => [...prevAddedNFTs, nft]);
  };

  const handleRemoveNFT = (tokenId) => {
    setAddedNFTs((prevAddedNFTs) =>
      prevAddedNFTs.filter((nft) => nft.tokenId !== tokenId)
    );
  };

  const handleGridFull = () => {
    console.log(addedNFTs);
  };

  const setCanvas = (boardWidth, boardHeight) => {
    setWidth(boardWidth);
    setHeight(boardHeight);
    setSelectedNfts(new Array(boardWidth * boardWidth).fill(0));
  }

  useEffect(() => {
    const fetchNFTs = async () => {
      // Connect to the Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(flippandoAddress, Flippando.abi, signer);


      // Call the getUserNFTs function from the smart contract
      //const tokenIds = await contract.getUserNFTs({ from: userAddress });
      const totalSupply = await contract.totalSupply();
      const tokenIds = [];
      // Get the current user's address
      const userAddress = await signer.getAddress();

      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await contract.tokenByIndex(i);
        const owner = await contract.ownerOf(tokenId);
        if (userAddress !== owner){
          tokenIds.push(tokenId);
          console.log(JSON.stringify(tokenId));
        }
      }
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
      setAddedNFTs(nftData);
    };

    fetchNFTs();
  }, []);

  // test, to replace in prod with real board/canvas values and dragged NFTs into it
  async function makeArt(){

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
  
    const flippandoContract = new ethers.Contract(flippandoAddress, Flippando.abi, signer);
    const flippandobundlerContract = new ethers.Contract(flippandoBundlerAddress, FlippandoBundler.abi, signer);

    const startBlockNumber = await provider.getBlockNumber();
    provider.once("block", () => {
      flippandoContract.on("ArtworkCreated", (artefact, blockNumber) => {
        if (blockNumber <= startBlockNumber) {
          console.log("old event, blockNumber " + blockNumber + ", startBlockNumber " + startBlockNumber);
          return;
        }
        console.log({
          Artwork: JSON.stringify(artefact, null, 2),
        })
      })
    })

    const txResponse  = await flippandoContract.makeArt(2,2,[13,14,15,16])
    .then( (result) => 
      { 
        console.log('make art txResponse ' + JSON.stringify(result))
        result.wait()
        .then( (result) => {
          console.log('wait test result ' + JSON.stringify(result))
            fetchNFTs();
        })
        .catch(error => { 
          console.log('make art error after result ' + JSON.stringify(error, null, 2))
        })
      })
    .catch(error => { 
      console.log('make art error ' + JSON.stringify(error, null, 2))
    })

  }

  return (
    <div>
      <div className='flex justify-center' style={{marginBottom: 20}}>
      <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(4, 1fr)', gridGap: '4px' }}>
        {nfts.length !== 0 && nfts.map((nft) => (
          <NFTTile
            key={nft.tokenId}
            nft={nft}
            onAdd={handleAddNFT}
            onRemove={handleRemoveNFT}
          />
        ))}
      </div>
      </div>

      
      <div className="flex justify-center" style={{marginBottom: 20}}>
        
        <Image src={artNFT} width="350" height="450" style={{align: 'center'}}/>
      </div>
      
      <div  className="flex justify-center">
      <button 
        onClick={() => { setCanvas(4, 8) }} 
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 ml-2 rounded-full">
          Set canvas
      </button>
      <button 
        onClick={() => { makeArt() }} 
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 ml-2 rounded-full">
          Make art
      </button>
    </div>
    </div>
  );
}
