const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Flippando", function () {
  let Flippando, flippando, SVG, svg, owner, addr1, addr2;

  beforeEach(async () => {
    SVG = await ethers.getContractFactory("SVG");
    svg = await SVG.deploy();
    await svg.deployed();

    Flippando = await ethers.getContractFactory("Flippando");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    flippando = await Flippando.deploy(svg.address);
    await flippando.deployed();
  });

  describe("Game Creation", function () {
    it("Should create a new game", async function () {
      await flippando.connect(addr1).create_game("game1", 16, "squareGrid");
      const game = await flippando.get_game("game1");
      expect(game.id).to.equal("game1");
      expect(game.player).to.equal(addr1.address);
      expect(game.boardSize).to.equal(16);
      expect(game.gameType).to.equal("squareGrid");
    });
  });

  describe("Game Play", function () {
    it("Should flip tiles and update the solvedBoard", async function () {
      await flippando.connect(addr1).create_game("game2", 16, "squareGrid");
      await flippando.connect(addr1).flip_tiles("game2", [0, 1]);
      const game = await flippando.get_game("game2");

      // Since we can't predict the randomness, check if at least one of the positions changed
      expect(game.solvedBoard[0] != 0 || game.solvedBoard[1] != 0).to.be.true;
    });
  });

  describe("NFT Creation", function () {
    it("Should create an NFT after the game is solved", async function () {
      await flippando.connect(addr1).create_game("game3", 4, "squareGrid");
      const game = await flippando.get_game("game3");
  
      // Assuming the game is solved, call create_nft with Ether
      await flippando.connect(addr1).create_nft("game3", { value: ethers.utils.parseEther("0.01") });
  
      // Check if the NFT is created and owned by addr1
      const nftOwner = await flippando.ownerOf(1);
      expect(nftOwner).to.equal(addr1.address);
    });
  });

});
