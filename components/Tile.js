import React from "react";
import styles from '../styles/Home.module.css';


const Tile = ({ tokenId, metadata }) => {
  const { image, name, description, game_id } = JSON.parse(metadata);

  return (
    <div className={styles.tile}>
      <div className={styles.tile_image}
      style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
        }} >
        <img src={image} alt="Flippando"/>
      </div>
      <div className={styles.tile_info}>
        <h3>{name}</h3>
        <p>Game Id: {game_id}</p>
        <p>Description: {description}</p>
        <button href={`list?tokenId=${tokenId}`} className="btn btn-green">
          List this NFT
        </button>
      </div>
    </div>
  );
};

export default Tile;
