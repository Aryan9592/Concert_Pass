// Importing Components
import Header from './components/Header';
import Main from './components/Main';
import Owner from './components/Owner';

// Importing Various Libraries
import {useState, useEffect} from 'react'
import { ethers } from 'ethers';
import { message } from "antd";
import { formatBalance, formatDetails } from './utils/info';
import detectEthereumProvider from '@metamask/detect-provider';

// Importing Additions Sets
import ABI from "./abis/Contract_Abi.json"
import Config from "./config.json"

function App() {

  const [hasProvider, setHasProvider] = useState(null)
  const [provider, setProvider] = useState(null)

  const [messageApi, contextHolder] = message.useMessage()
  const [contract, setContract] = useState(null)

  const initialState = { accounts: [], balance: "", chainId: "" }
  const [wallet, setWallet] = useState(initialState)

  // Storing Smart contracts data to localStorage for ease
  const storage = JSON.parse(localStorage.getItem("items"))
  const [details, setDetails] = useState(() => storage || [])


  const error_key = "error"
  const contractAddress = Config.contractAddress

  // This useEffect is for handling metamask accounts thing
  useEffect(() => {

    // For refreshing the accounts after every reload
    const refreshAccounts = (accounts) => {
      if (accounts.length > 0){
        updateWallet(accounts)
      } else {
        setWallet(initialState)
      }
    }

    // Refreshes Chain
    const refreshChain = (chainId) => {
      setWallet((wallet) => ({...wallet, chainId}))
    }

    // Getting Provider and refreshing chain, accounts on each reload
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
      // clean up code
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
      window.ethereum?.removeListener("chainChanged", refreshChain)
    }
  }, [])

  // Updating the Wallet
  const updateWallet = async (accounts) => {
    // Getting the balance
    const balance = formatBalance(await window.ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"]
    }))

    // Getting the chainID
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

  // Function for displaying error messages
  const showError = (errorMsg) => {
    messageApi.open({
      error_key,
      type: "error",
      content: errorMsg,
      duration: 2
    })
  }
  
  // This function is used to fetch details of the Contract like totalSupply, Maxsupply and price of the token
  const loadData = async () => {
    try{
      if (provider){
        const readContract = new ethers.Contract(contractAddress, ABI, provider)
        const detail = await readContract.returnState()
        const newDetails = [
            formatDetails(detail[0]),
            formatDetails(detail[1]),
            formatBalance(detail[2])
        ]
        localStorage.setItem("items", JSON.stringify(newDetails))
        setDetails(newDetails)
      }
    } 
    catch (error) {
      console.log(error)
    }
  }

  // Function for checking whether the user has a token or not
  const checkToken = async () => {
    const read = new ethers.Contract(contractAddress, ABI, provider)
    const answer = await read.tokenRecord(wallet.accounts[0])
    if (answer) {
      showError('You already got a token!!')
    }
  }

  return (
    <>
      {contextHolder}
      <div className="App">
        <Header 
          wallet={wallet} 
          updateWallet={updateWallet} 
          showError={showError} 
          loadData={loadData}
        />  
        {
          wallet.accounts.length > 0 && 
          <Main 
            wallet={wallet}
            contract={contract} 
            details={details} 
            loadData={loadData} 
            checkToken={checkToken}
          />
        }  
        {
          wallet.accounts[0] === Config.owner && 
          <Owner 
            contract={contract} 
            loadData={loadData}
          />
        }
      </div>
    </>
  );
}

export default App;