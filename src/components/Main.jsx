import React, { useEffect, useState } from "react";
import ABI from "../abis/Contract_Abi.json"
import { formatDetails, formatBalance } from "../utils/info";
import Config from "../config.json"
const { ethers } = require("ethers")

export default function Main({contract, details}){
    const tokenValue = ethers.parseEther('0.001')
    const tokenAddress = Config.contractAddress
    const tokenSymbol = Config.tokenSymbol
    const tokenDecimals = Config.tokenDecimals
    const tokenImage = Config.tokenImage

    
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
                <p>MaxSupply: {details[0]}</p>
                <p>TotalSupply: {details[1]}</p>
                <p>TokenPrice: {details[2]}</p>
            </div>
        </>
    )
}