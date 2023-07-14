import Header from './components/Header';
import {useState, useEffect} from 'react'
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)


  const loadBlockchainData = async () => {
    // This provider and signer be interacting with our blockchain
    let _provider, _signer
    try {
      if(window.ethereum == null){
        _provider = ethers.getDefaultProvider()
      } else {
        _provider = new ethers.BrowserProvider(window.ethereum)
      }
      _signer = await _provider.getSigner()
      setProvider(_provider)
      setSigner(_signer)
    } catch (error) {
      console.log("No wallet is Connected!!")
    }

    // affects when you change the account
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts'})
      if(accounts.length !== 0){
        const account = await ethers.getAddress(accounts[0])
        setAccount(account)
      }  
    })
    
    console.log(_signer)
    // console.log(provider)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div className="App">
      <Header account={account} setAccount={setAccount}/>      
    </div>
  );
}

export default App;
