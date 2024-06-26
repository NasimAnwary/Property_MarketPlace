import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json';

function App() {

  const[account, setAccount] =  useState(null)
  const[provider, setProvider] = useState(null)
  const[escrow, setEscrow] = useState(null)
  const[homes, setHomes] = useState([])




  const loadBlockchainData = async () => {
    // Creates a connection to the ethereum blockchain through metamask or similar connection
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()


    // This code connects to the actual ganache blockchain
    const realEstate = new ethers.Contract(config[5777].realEstate.address, RealEstate, provider)
    const totalSupply = await realEstate.totalSupply()
    const homes = []

    for(var i=1; i<= totalSupply; i++){
      const uri = await realEstate.tokenURI(i)
      const response = await fetch(uri)
      const metadata = await response.json()
      homes.push(metadata)
    }
    setHomes(homes)
 

    const escrow = new ethers.Contract(config[5777].escrow.address, Escrow, provider)
    setEscrow(escrow)




// This is the similar code as Navigation, but this will make the accounts change automatically
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: `eth_requestAccounts`});
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)  
    })
  }

  useEffect(() => {
    loadBlockchainData()

  }, []); 

  return (
    <div>
      <Navigation account = {account}  setAccount = {setAccount} />
      <Search />

      <div className='cards__section'>

        <h3>Casas para ti</h3>
        <hr />
        <div className='cards__section'>
          <div className = 'card'>
            <div className = 'card__image'>
              <img src="" alt="Home"/>
            </div>
            <div className = 'card__info'>
              <h4> 1 Eth </h4>
              <p>
                <strong>1</strong> bds 1
                <strong>2</strong> ba 2
                <strong>3</strong> bds 4
              </p>
              <p> 1234 Elms street</p>
            </div>
            

          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
