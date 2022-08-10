import React, { useEffect, useState } from "react";
import './App.css';
import {ethers} from "ethers";
import abi from "./components/abi.json";
import abi2 from "./components/abi2.json";
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';
import { Helmet } from 'react-helmet';
import { Link } from  "react-router-dom";


const Proposals = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [network, setNetwork] = useState('');
	const [finalStats, setStats] = useState([]);
	
	
  
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

	

	const fetchMints = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract('0x00977C3a2a6b14AC081A9b3e356B6996e525aB21', abi, signer);
				console.log(contract);
				//var svgtojsx = require('svg-to-jsx');
				// Get all the domain names from our contract
				const projects = await contract.viewFundProjects();
        const projectNum = await projects.length;
        console.log(projects);
				

        const projectMaps = await Promise.all(projects.map(async (project) => {
				
          const pContract = new ethers.Contract(project, abi2, signer);
          const overview = await pContract.viewOverview();
          console.log(overview);
          
          let name = await overview._name;
          
          return {
            name: name,
            address: project
          };
        }));
				
			setStats(projectMaps);
       
			}
		} catch(error){
			console.log(error);
		}
		
	}
	
	// This will run any time currentAccount or network are changed
	useEffect(() => {
		if (network === 'Polygon Mumbai Testnet') {
			fetchMints();
		}
	}, [currentAccount, network]);


  

  const doThis = async (event, param) => {
    window.open('/proposals/' + param[1]);
  }

  // Create a function to render if wallet is not connected yet
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
    );

		const renderNotConnectedTitle = () => (
			<div className = "connected-container">
						<p className="title">Fundme Proposals</p>
						<br></br>
            <p className="subtitle">Sign in with your wallet to view and contribute to proposals </p>
			</div>
			);

			const renderConnectedTitle = () => (
				<div className = "connected-container">
							<p className="title">Fundme Proposals</p>
							<br></br>
							<p className="subtitle">Click into recent Fundme proposals to learn and contribute to causes </p>
              <br></br>
              <p > <small>For general information, please visit our about page </small> </p>
              
				</div>
				);

				
				//render minted blogs
					const renderMints = () => {
						if (currentAccount && finalStats.length > 0) {
							return (
								<div className="mint-container">
									<p className="subtitle"> Current Funding Proposals:</p>
									<div className="mint-list">
										{ finalStats.map((mint, index) => {
											return (
                        <Link
                        to={`/proposals/${mint.address}`}
                        
                      >
												<button className = "thumbButton" >
												<div className="mint-item" key={index} >
													
										
										<p className = 'nft-name'> Name: <strong>{mint.name}</strong> </p>
									</div></button></Link>)
									})}
								</div>
							</div>);
						}
					};
					
				
					
		//I was lazy and did not change the name of this component - it's just to switch to testnet
		const renderInputForm = () =>{
			if (network !== 'Polygon Mumbai Testnet') {
				return (
					<div className="connect-wallet-container">
						<h2>Please switch to Polygon Mumbai Testnet</h2>
        <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
					</div>
				);
			}
      
      
  }
  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
		
  }, [])

  return (
		<div className="App">
		<Helmet>
        <title>View and Contribute to Fundme Campaigns</title>
        <meta name="description" content="Learn about various causes to commit your funds to. Click into Fundme proposals to learn about or contribute to campaigns." />
        
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
            {currentAccount  && renderConnectedTitle()}
           
            </div>
        </div>
				{!currentAccount && renderNotConnectedContainer()}
				{currentAccount && renderInputForm()}
				{finalStats && renderMints()}	
        <div className="footer-container">
        </div>
      </div>
			
			
			
    </div>
  );
};

export default Proposals;