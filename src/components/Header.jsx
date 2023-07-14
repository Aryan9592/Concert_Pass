import React from "react";
import Logo from "../images/logo.jpg"
import {ethers} from 'ethers';

export default function Header({account, setAccount}){

    const connectHandler = async () => {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
        const account = ethers.getAddress(accounts[0])
        setAccount(account)
    }

    return(
        <header>
            <img src={Logo} alt="" width={40}/>
            {account ? (
                <button>
                    {account.slice(0, 4) + '...' + account.slice(38, 42)}
                </button>
            ) : (
                <button onClick={connectHandler}>
                    Connect
                </button>
            )}
        </header>
    )
}