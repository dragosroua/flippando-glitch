// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FLIP is ERC20 {
    uint256 public lockedSupply;
    uint256 public unlockedSupply;

    mapping(address => mapping(uint256 => uint256)) public lockedBalanceOf;

    address public owner;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * (10**18);

    event TransferLocked(address indexed from, address indexed to, uint256 value);
    event TransferUnlocked(address indexed from, address indexed to, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    constructor() ERC20("Flippando", "FLIP") {
        owner = msg.sender;
    }


    function changeOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }


    function mintLocked(address recipient, uint256 tokenId, uint256 tokenAmount) external onlyOwner {
        require(totalSupply() < MAX_SUPPLY, "Maximum supply reached");
        uint256 amount = tokenAmount * (10**uint256(decimals()));

        lockedBalanceOf[recipient][tokenId] += amount;
        lockedSupply += amount;
        _mint(address(this), amount);

        emit TransferLocked(address(0), recipient, amount);
    }

    function unlockAndTransfer(address recipient, uint256 tokenId) external onlyOwner {
        require(lockedBalanceOf[recipient][tokenId] > 0, "Recipient has no locked balance for the given tokenId");

        uint256 amount = lockedBalanceOf[recipient][tokenId];
        delete lockedBalanceOf[recipient][tokenId];

        lockedSupply -= amount;
        unlockedSupply += amount;

        _transfer(address(this), recipient, amount);

        emit TransferUnlocked(address(this), recipient, amount);
    }

    function getLockedBalance(address account, uint256 tokenId) public view returns (uint256) {
        return lockedBalanceOf[account][tokenId];
    }
}
