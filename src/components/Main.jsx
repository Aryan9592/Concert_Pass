import React, { useEffect, useState } from "react";
import ABI from "../abis/Contract_Abi.json"
import { formatDetails, formatBalance } from "../utils/info";
const { ethers } = require("ethers")

export default function Main({contract, details}){
    const tokenValue = ethers.parseEther('0.001')
    const tokenAddress = "0xe147779CF13B8c5b123B7C311d928e2459B37E32"
    const tokenSymbol = 'MAG'
    const tokenDecimals = 18
    const tokenImage = 'https://image.lexica.art/full_jpg/ca0e04bf-8015-4128-9fb3-d7c4a254ae33'

    
    const MintToken = async (event) => {
        event.preventDefault()
        try {
            const mint = await contract.mint({value: tokenValue})
            await mint.wait()
            addToken()
        } catch (error) {
            console.log(error)
        }
    }

    const addToken = async () => {
        try {
        // wasAdded is a boolean. Like any RPC method, an error can be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                type: 'ERC20', // Initially only supports ERC-20 tokens, but eventually more!
                options: {
                    address: tokenAddress, // The address of the token.
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 characters.
                    decimals: tokenDecimals, // The number of decimals in the token.
                    image: tokenImage, // A string URL of the token logo.
                },
                },
            });
        
            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <>
            <div className="buttons">
                <button className="Mint" onClick={MintToken}>Mint Token</button>
                <p>MaxSupply: {details.maxSupply}</p>
                <p>TotalSupply: {details.totalSupply}</p>
                <p>TokenPrice: {details.tokenPrice}</p>
            </div>
        </>
    )
}