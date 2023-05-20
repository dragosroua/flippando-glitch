// components/FlippandoTitle.js

import React from 'react';
import styles from '../styles/FlippandoTitle.module.css';

const FlippandoTitle = () => {
  return (
    <svg className={styles.svg} width="150" height="50" xmlns="http://www.w3.org/2000/svg">
      <text x="30" y="40">Flippando</text>
    </svg>
  );
};

export default FlippandoTitle;
