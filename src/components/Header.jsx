import React from "react";
import Logo from "../images/logo.jpg"

export default function Header({wallet, setWallet, updateWallet}){
    
    const connectHandler = async () => {
        let accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        updateWallet(accounts)
    }

    return(
        <header>
            <img src={Logo} alt="" width={40}/>
            {wallet.accounts.length > 0 ? (
                <button>
                    {wallet.accounts[0].slice(0, 4) + '...' + wallet.accounts[0].slice(38, 42)}
                </button>
            ) : (
                <button onClick={connectHandler}>
                    Connect
                </button>
            )}
        </header>
    )
}