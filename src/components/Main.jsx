import React, { useEffect, useState } from "react";
const { ethers } = require("ethers")
// import { formatBalance  } from './utils/info';

export default function Main({signer, provider, contract, formatBalance}){
    const tokenValue = ethers.parseEther('0.001')
    console.log(typeof(tokenValue))
    console.log(tokenValue)
    const [details, setDetails] = useState({maxSupply: 0, totalSupply: 0, tokenPrice: 0})

    const MintToken = async (event) => {
        event.preventDefault()
        try {
            const mint = await contract.mint({value: tokenValue})
            await mint.wait()
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
            <div className="buttons">
                <button className="Mint" onClick={MintToken}>Mint Token</button>
                <p>MaxSupply: {details.maxSupply}</p>
                <p>TotalSupply: {details.totalSupply}</p>
                <p>TokenPrice: {formatBalance(tokenValue)}</p>
            </div>
        </>
    )
}