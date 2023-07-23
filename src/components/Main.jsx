import React, { useEffect, useState } from "react";
import Config from "../config.json"
import { message } from "antd";
const { ethers } = require("ethers")

export default function Main({wallet, contract, details, loadData, checkToken}){
    // UseStates
    const [messageApi, contextHolder] = message.useMessage()
    const [isMinting, setIsMinting] = useState(null)
    const [error, setError] = useState(false)
    const [isTestNet, setIsTestNet] = useState(false)

    // Key items
    const tokenValue = ethers.parseEther('0.001')
    const tokenAddress = Config.contractAddress
    const tokenSymbol = Config.tokenSymbol
    const tokenDecimals = Config.tokenDecimals
    const tokenImage = Config.tokenImage
    const key = 'minting'
    const test_key = "testnet"

    
    // Function for minting the token
    const MintToken = async (event) => {
        event.preventDefault()
        try {
            const mint = await contract.mint({value: tokenValue})
            setIsMinting(true) // This do shows a loading message 'Minting"
            await mint.wait()
            setIsMinting(false) // This do shows a success message 'Token Minted'
            loadData() // Loads the blockchain token related data
            addToken() // Adds token into the user wallet
        } catch (error) {
            setError(true)
            console.log(error)
            checkToken() // checks whether the user already had that token or not
        }
    }

    // Function for adding the token in user's wallet
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

    // It is responsible for displaying the floating messages
    useEffect(() => {
        const showMessage = () => {
            if(isMinting){
                messageApi.open({
                    key,
                    type: "loading",
                    content: "Minting Token...",
                    duration: 5
                })
            }
            else if (isMinting === false && !error){
                messageApi.open({
                    key,
                    type: "success",
                    content: "Token Minted!!",
                    duration: 2
                })
            }
        }

        showMessage()
        return () => {
            setIsMinting(null)
            setError(false)
        }
    }, [isMinting])

    // This function is responsible for displaying the Chain Related message
    const showInfo = (msg) => {
        if (msg) {
            messageApi.open({
            test_key,
            type: "success",
            content: "Connected to Sepolia TestNet!",
            duration: 2
            })
        } else {
            messageApi.open({
            test_key,
            type: "info",
            content: "Please Connect to Seploia TestNet..",
            duration: 2.5
            })
        }
    }
    
    // This is responsible for displaying the Chain Related message
    useEffect(() => {
        const checkChain = () => {
            console.log(isTestNet)
            if (isTestNet || wallet.chainId !== Config.chainId){
                console.log(wallet.chainId)
                if (wallet.chainId !== Config.chainId){
                    showInfo(false)
                } else if (wallet.chainId === Config.chainId){
                    showInfo(true)
                }
            } else {
                setIsTestNet(true)
            }
        }

        checkChain()
    }, [wallet.chainId])

    return(
        <>
            {contextHolder}
            <div className="buttons">
                <button className="Mint" onClick={MintToken} disabled={wallet.chainId !== Config.chainId}>Mint Token</button>
                <p>MaxSupply: {details[0]}</p>
                <p>TotalSupply: {details[1]}</p>
                <p>TokenPrice: {details[2]}</p>
            </div>
        </>
    )
}