# Deployment

At the moment of writing, the game is deployed on a few testnets, including Evmos and Polygon. The deployment consists of a pool of smart contracts and some basic UI. Make sure you added the testnets to MetaMask and get some testnet tokens from the testnet faucet. Refer to the specific testnet docs for that. In the current implementation each flip is a separate transaction that must be approved in MetaMask, but the gas fees are very low.

1. Clone the repo
2. Run `npm run dev`. This should start the UI on `localhost:3000`.
3. Try to play the game in the browser. It will require accepting transaction on Metamask. The game generation takes about 5-6 seconds.

# WARNING! Things can change very often in the codebase, so they may also break very often. Refer to this file for deployment / implementation changes.