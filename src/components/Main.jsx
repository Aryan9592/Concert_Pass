import React, { useEffect, useState } from "react";
import ABI from "../abis/Contract_Abi.json"
const { ethers } = require("ethers")
// import { formatBalance  } from './utils/info';

export default function Main({signer, provider, contract, setContract, formatBalance}){

    const contractAddress = "0x98a3282221FaCcBdDa039985f4cBA931768d79ec"
    const tokenValue = ethers.parseEther("0.001")
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

    useEffect(() => {
        const getDetails = async () => {
            const contract = new ethers.Contract(contractAddress, ABI, signer)
            setContract(contract)

            const readContract = new ethers.Contract(contractAddress, ABI, provider)
            console.log(readContract)

            const detail = await readContract.returnState()
            // console.log(detail[2])
            // console.log(typeof(detail[2]))
            const _maxSupply = formatBalance(detail[0])
            const _tokenSupply = formatBalance(detail[1])
            const _price = formatBalance(detail[2])
            console.log(_maxSupply, _tokenSupply, _price)
            
            // setDetails({maxSupply: formatBalance(detail[0]), totalSupply: formatBalance(detail[1]), tokenPrice: formatBalance(detail[0])})
        }
        getDetails()
        return () => {
            
        }
    }, [])



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