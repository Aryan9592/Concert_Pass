import React, { useEffect, useState } from "react";
import { message } from "antd";
import Logo from "../images/logo.jpg"

export default function Header({wallet, updateWallet, showError, loadData}){

    // UseStates
    const [messageApi, contextHolder] = message.useMessage()
    const [isConnecting, setIsConnecting] = useState(null)
    const [error, setError] = useState(false)
    const key = 'updatable'
    
    // Function for connecting the Dapp to Metamask
    const connectHandler = async () => {
        setIsConnecting(true)
        await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        .then((accounts) => {
            setError(false)
            updateWallet(accounts)
            loadData()
        })
        .catch((error) => {
            setError(true)
            showError(error.message)
        })
        setIsConnecting(false)
    }

    // It displays the wallet connection to user
    useEffect(() => {
        const showMessage = () => {
            if(isConnecting) {
                messageApi.open({
                    key,
                    type: "loading",
                    content: "Connecting..."
                })
            }
            else if (isConnecting === false && !error){
                messageApi.open({
                    key,
                    type: "success",
                    content: "Connected!",
                    duration: 2
                })
            }
        }

        showMessage()
        return () => {
            setIsConnecting(null)
            setError(false)
        }
    }, [isConnecting])

    return(
        <>
            {contextHolder}
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
        </>
    )
}