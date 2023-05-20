A short (6 minutes) demo video can be seen [here](https://youtu.be/8--2MiXES4w).

If you want to run the project go to [Deployment](docs/Deployment.md). More details about what the game does are in [Game Mechanics](docs/GameMechanics.md).

## Status

For this MVP, the following functionality is implemented, so these features can be tested:

- game mechanics (complete)
- on-chain NFT generation on finished game (wip, unstable)

Not implemented yet:

- levels management
- NFT marketplace


## Inspiration

The combination between EVM and Cosmos-sdk made possible a whole range of projects which weren't possible before. Games with significant logic on-chain can now be played at a much higher speed, unlocking new opportunities.

## What it does

The player starts with an "uncovered" matrix of tiles. Underneath, tiles are grouped in pairs of two (In the hackathon MVP, the pairing is between colors: we have pairs of green, red, blue, etc tiles. But in the real game I plan to have different visual symbols, like dice, letters, hexagrams).

A game turn consists in the flipping of two tiles. The game sends a request to the chain, which, upon a successful transaction, sends back the "uncovered" tiles. If the tiles are matched, they remain uncovered. If the tiles don't match, they are shown for a brief period of time (so the player can memorize them) then they are flipped back. 

There is an element of randomness which should increase engagement, refer to [Game Mechanics](docs/GameMechanics.md) for that.

When the matrix is solved, meaning all tiles are uncovered, the result is made into an NFT, which is now belonging to the player, proof that he completed a game. 

We start with 4x4 matrixes, and, after 8 solved games, we advance at 8x8 matrixes. All subsequent levels will not use primary visual symbols (colors, in this case), but the previously solved matrixes, as NFTs. So, instead of 8 pairs of basic colors, the player should memorize one of the 8 previously solved matrixes.

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

- improve randomness generation in Solidity
- evauate the implementation paths: separate contract on Evmos, a separate consumer chain, a DAO, etc
- add utility tokens 
.
.
.
- go live