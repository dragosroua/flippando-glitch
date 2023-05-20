If you want to run the project go to [Deployment](docs/Deployment.md). More details about what the game does are in [Game Mechanics](docs/GameMechanics.md).

## Status

For this MVP, the following functionality is implemented, so these features can be tested:

- game mechanics (complete)
- game levels enforcement (complete)
- on-chain NFT generation on finished game
- creation of composite NFTs by assembling other people solved boards
- ERC20 token generation and rewards logic (locking/unlocking tokens on minting/assembling solved boards)

## Inspiration

The evolution of EVM and integration with fast finality blockchains made possible a whole range of projects which weren't possible before. Games with significant logic on-chain can now be played at a much higher speed, unlocking new opportunities.

## What it does

The player starts with an "uncovered" matrix of tiles. Underneath, tiles are grouped in pairs of two (In the hackathon MVP, the pairing is between colors: we have pairs of green, red, blue, etc tiles. We also have different visual symbols, like dice and hexagrams).

A game turn consists in the flipping of two tiles. The game sends a request to the chain, which, upon a successful transaction, sends back the "uncovered" tiles. If the tiles are matching, they remain uncovered. If the tiles don't match, they are shown for a brief period of time (so the player can memorize them) then they are flipped back. 

Please refer to [Game Mechanics](docs/GameMechanics.md) for details on how we enforce solvability.

When the matrix is solved, meaning all tiles are uncovered, the result is made into an NFT, which is now belonging to the player, proof that he completed a game. When the NFT is minted, an ERC20 token is minted and "locked" inside the NFT. Please refer to [Game Mechanics](docs/GameMechanics.md) for details about the locking / unlocking logic of the ERC20 token.

We start with 4x4 matrixes, and, after 8 solved games, we advance at 8x8 matrixes. 

## How we built it

The initial version was built in JavaScript, to test various parts of the algorithms. Then we moved to Solidity smart contracts, using hardhat as tooling. UI is built with React.

## Challenges we ran into

The initial deployment of smart contract was challenging, especially because lack of informative error messages from MetaMask.

## Accomplishments that we're proud of

Porting a JS game in Solidity, with all the quirks of the blockchain programming paradigm.

## What we learned

A lot of stuff related to:

- wallet integration with JS clients
- random number generation in Solidity and its limitations
- EVM memory space limitations and workarounds
- general coding in Solidity (not token / transfer related, that is)

## What's next for Flippando

Should the project continues, there are quite a few hurdles that needs to be tackled:

- evauate the go to market paths: deployemnt as a suite of contracts on an existing blockchain (Polygon, Avalanche), a separate consumer chain in the Cosmos ecosystem, a chainlet in the Saga ecosystem, a DAO, etc
- create detailed tokenomics for the ERC20 Flip token (right now there's a capped supply fo 1,000,000,000 tokens, and the only way to get one is by playing the game)
- integrate Account Abstraction for sponsored gas fees (and not only)
- improve randomness generation in Solidity and stabilize the UI
- improve UI and optimize gas costs
.
.
.
- go live