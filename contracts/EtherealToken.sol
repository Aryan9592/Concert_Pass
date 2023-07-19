// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract EtherealToken is ERC20, Ownable{
    // Setting token price - 0.001 ether
    uint public tokenPrice;

    // Setting the max supply - 1000 tokens
    uint public maxSupply;

    // Mapping checks whether the user already owns a token or not..
    mapping(address => bool) public tokenRecord;

    constructor() ERC20("EtherealToken", "MAG") {
        tokenPrice = 0.001 ether;
        maxSupply = 1000000000000000000000;
    }

    function mint() public payable{
        require(totalSupply() + 1 <= maxSupply, "Sorry!! No more tokens");
        require(tokenRecord[msg.sender] == false, "You already got a token!!");
        require(msg.value == tokenPrice, "Your wallet doesn't consist of the valid amount for this token");
        tokenRecord[msg.sender] = true;
        _mint(msg.sender, 1000000000000000000);
    }

    function setMaxSupply(uint _maxSupply) public onlyOwner{
        maxSupply = _maxSupply;
    }

    function setTokenPrice(uint _tokenPrice) public onlyOwner{
        tokenPrice = _tokenPrice;
    }

    function withDraw() public onlyOwner{
        payable(owner()).transfer(address(this).balance);
    }

    function returnState() public view returns(uint _maxSupply, uint _totalSupply, uint _tokenPrice){
        return (maxSupply, totalSupply(), tokenPrice);
    }
}