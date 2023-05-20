# Deployment

At the moment of writing, the game is deployed on Evmos testnet as a Solidity smart contract. Make sure you added the testnet to MetaMask and get some testnet tokens from the testnet faaucet. Refer to Evmos official docs for that. In the current implementation each flip is a separate transaction that must be approved in MetaMask, but the gas fees are very low.

1. Clone the repo
2. Run `npm run dev`. This should start the UI on `localhost:3000`.
3. Try to play the game in the browser. It will require accepting transaction on Metamask. The game generation takes about 5-6 seconds.

# WARNING! Things can change very often in the codebase, so they may also break very often. Refer to this file for deployment / implementation changes.