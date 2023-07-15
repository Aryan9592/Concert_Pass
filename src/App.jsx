import Header from './components/Header';
import {useState, useEffect} from 'react'
import { ethers } from 'ethers';
import { message } from "antd"
import detectEthereumProvider from '@metamask/detect-provider';

function App() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [messageApi, contextHolder] = message.useMessage()

  const [hasProvider, setHasProvider] = useState(null)
  const initialState = { accounts: [] }
  const [wallet, setWallet] = useState(initialState)

  
  useEffect(() => {
    const refreshAccounts = (accounts) => {
      if (accounts.length > 0){
        updateWallet(accounts)
      } else {
        setWallet(initialState)
      }
    }

    const getProvider = async () => {
      const provider = await detectEthereumProvider({silent: true})
      setHasProvider(Boolean(provider))
      if(provider){
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })
        refreshAccounts(accounts)
        window.ethereum.on('accountsChanged', refreshAccounts)
      } else {
        messageApi.warning("Please Install Metamask!!")
      }
    }
    
    getProvider()
    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
    }
  }, [])

  const updateWallet = async (accounts) => {
    setWallet({accounts})
  }
  

  return (
    <>
      {contextHolder}
      <div className="App">
        <Header wallet={wallet} updateWallet={updateWallet}/>     
      </div>
    </>
  );
}

export default App;
