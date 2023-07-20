import Header from './components/Header';
import {useState, useEffect} from 'react'
import { ethers } from 'ethers';
import { message } from "antd";
import { formatBalance, formatDetails } from './utils/info';
import detectEthereumProvider from '@metamask/detect-provider';
import Main from './components/Main';
import Owner from './components/Owner';
import ABI from "./abis/Contract_Abi.json"

function App() {
  const [provider, setProvider] = useState(null)
  const [messageApi, contextHolder] = message.useMessage()
  const [contract, setContract] = useState(null)

  const [hasProvider, setHasProvider] = useState(null)
  const initialState = { accounts: [], balance: "", chainId: "" }
  const [details, setDetails] = useState({maxSupply: 0, totalSupply: 0, tokenPrice: 0})
  console.log(details)

  const [wallet, setWallet] = useState(initialState)

  const error_key = "error"
  const contractAddress = "0xe147779CF13B8c5b123B7C311d928e2459B37E32"

  // This useEffect is for handling metamask accounts thing
  useEffect(() => {
    const refreshAccounts = (accounts) => {
      if (accounts.length > 0){
        updateWallet(accounts)
      } else {
        setWallet(initialState)
      }
    }

    const refreshChain = (chainId) => {
      setWallet((wallet) => ({...wallet, chainId}))
      
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
        window.ethereum.on('chainChanged', refreshChain)
      } else {
        messageApi.warning("Please Install Metamask!!")
      }
    }
    
    getProvider() 
    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
      window.ethereum?.removeListener("chainChanged", refreshChain)
    }
  }, [])

  const updateWallet = async (accounts) => {
    const balance = formatBalance(await window.ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"]
    }))
    const chainId = await window.ethereum.request({
      method: "eth_chainId"
    })
    setWallet({accounts, balance, chainId})

    // setting signers and providers
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    setProvider(provider)
    const contract = new ethers.Contract(contractAddress, ABI, signer)
    setContract(contract)
  }

  const showError = (errorMsg) => {
    messageApi.open({
      error_key,
      type: "error",
      content: errorMsg,
      duration: 2
    })
  }
  
  const loadData = async () => {
    try{
      const readContract = new ethers.Contract(contractAddress, ABI, provider)
      const detail = await readContract.returnState()
      const newDetails = {
          maxSupply: formatDetails(detail[0]),
          totalSupply: formatDetails(detail[1]),
          tokenPrice: formatBalance(detail[2])
      }
      console.log(newDetails)
      setDetails(newDetails)
    } 
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="App">
        <Header wallet={wallet} updateWallet={updateWallet} showError={showError}/>  
        <Main contract={contract} details={details}/>  
        <Owner contract={contract}/>
      </div>
    </>
  );
}

export default App;
