import React from "react";
import styles from '../styles/Home.module.css';


const SmallTile = ({ tokenId, metadata }) => {
  console.log('metadata ' + metadata);
  const { image, name, description } = JSON.parse(metadata);

  return (
    <div className={styles.small_tile}>
      <div className={styles.small_tile_image}
      style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
        }} >
        <img src={image} alt="Flippando"/>
      </div>
    </div>
  );
};

export default SmallTile;
