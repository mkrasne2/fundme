import React, { useEffect, useState } from "react";
import './App.css';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';
import { Helmet } from 'react-helmet';
import { useNavigate} from 'react-router-dom';


const initialState = '';


const Home = () => {
	const [currentAccount, setCurrentAccount] = useState(initialState);
	const [network, setNetwork] = useState(initialState);
	const navigate = useNavigate();
  const connectWallet = async () => {
    
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
	
	const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    // Users can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }

		const chainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);
    ethereum.on('chainChanged', handleChainChanged);
    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

	const switchNetwork = async () => {
		if (window.ethereum) {
			try {
				// Try to switch to the Mumbai testnet
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
				});
			} catch (error) {
				// This error code means that the chain we want has not been added to MetaMask
				// In this case we ask the user to add it to their MetaMask
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{	
									chainId: '8001',
									chainName: 'Polygon Mumbai Testnet',
									rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
									nativeCurrency: {
											name: "Mumbai Matic",
											symbol: "MATIC",
											decimals: 18
									},
									blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
								},
							],
						});
					} catch (error) {
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			// If window.ethereum is not found then MetaMask is not installed
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		} 
	}

	// This will run any time currentAccount or network are changed
	useEffect(() => {
		if (network === 'Polygon Mumbai Testnet') {
			
		}
	}, [currentAccount, network]);

  
  

  // Create a function to render if wallet is not connected yet
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
    );

		const renderNotConnectedTitle = () => (
			<div className="connected-container">
						<p className="title">Fundme</p>
						<br></br>
            <p className="subtitle">Connect your wallet to view or submit proposals for funding</p>
			</div>
			);


			const renderConnectedTitle = () => (
				<div className="connected-container">
							<p className="title">Fundme Welcomes You</p>
							<br></br>
							<p className="subtitle">Learn about recent proposals, about our organization, and submit your own Fundme proposals</p>
              
				</div>
				);

        const renderOptions = () =>{
      
      
          if (network !== 'Polygon Mumbai Testnet') {
            return (
              <div className="connect-wallet-container">
                <h2>Please switch to Polygon Mumbai Testnet</h2>
            <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
              </div>
            );
          } else {
            return(
              <div className="options-container">
               
            <button className='cta-two ' onClick={() => {navigate('/proposals')}} >View Proposals</button>
            <button className='cta-two 'onClick={() => {navigate('/submit')}} >Create a Fund</button>
              </div>
            )
          }


        }
					
      
  // This runs our function when the page loads.
  useEffect(() => {
        
        checkIfWalletIsConnected();
        
  }, [])

  return (
		<div className="App">
		<Helmet>
        <title>Fundme: A decentralized, multi-purpose, p2p crowdfunding service</title>
        <meta name="description" content="Fundme is a decentralized peer-to-peer crowdfunding service. Discover causes to contribute to, or create your own!" />
        
      </Helmet>
      <div className="container">
        <div className="header-container">
        <header>
           
           <div className="right">
             <img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
             { currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
           </div>
         </header>
				<div >
            {!currentAccount && renderNotConnectedTitle()}
            {currentAccount && renderConnectedTitle()}
            </div>
        </div>
       
				{!currentAccount && renderNotConnectedContainer()}
        {currentAccount && renderOptions()}
        <div className="footer-container">
        </div>
      </div>
    </div>
  );
};

export default Home;