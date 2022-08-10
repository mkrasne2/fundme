import React, { useEffect, useState } from "react";
import './App.css';
import {ethers} from "ethers";
import abi2 from "./components/abi2.json";
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import LoadingSpin from "react-loading-spin";





const Indprop = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [network, setNetwork] = useState('');
	const [finalStats, setStats] = useState([]);
	const { id } = useParams();
  const [message, setMessage] = useState('');
  const [transaction, setTransactionProcess] = useState('');
	const [success, setSuccess] = useState('');
	
  const handleChange = event => {
    setMessage(event.target.value);

    console.log('value is:', event.target.value);
  };

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

	

  const clearView = async () => {
    setSuccess('');
    setTransactionProcess('');
    setMessage('');
    fetchMints();
  }

	const fetchMints = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(id, abi2, signer);
				console.log(contract);
				//var svgtojsx = require('svg-to-jsx');
				// Get all the domain names from our contract
				const overview = await contract.viewOverview();
        const name = await overview._name;
        const description = await overview._description;
        const site = await overview._externalSite;
        const goal = await parseInt(overview._goal._hex, 16);
        const balance = await parseInt(overview._bal._hex, 16);
        const remaining = await parseInt(overview._timeRemaining._hex, 16);
        var ts = await Math.round((new Date()).getTime() / 1000) + remaining;
        console.log(ts);
        const date = new Date(await ts*1000);
        const stringTest = await date.toString();
        console.log(stringTest);
				const projectMaps = [name, description, site, goal, balance, stringTest];
			setStats(projectMaps);
       console.log(projectMaps);
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


  
  const submitFunds = async () => {
    
    if(Number(message) >= .001){
    try {
      const { ethereum } = window;
      if (ethereum) {
        // You know all this
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(id, abi2, signer);
        console.log(contract);
        setTransactionProcess(true);
        const tx = await contract.donate({value: ethers.utils.parseEther(message.toString())});
        const receipt = await tx.wait();
        setTimeout(() => {
            
        }, 2000);
  
        if (receipt.status === 1) {
         
          console.log(tx.hash);
          setSuccess(true);
          setTransactionProcess(false);
          
      
        
          
  
          
        } else {
          
          alert("Transaction failed! Please try again");
        }
  
        
      }
    } catch(error){
      console.log(error);
     
    }}
    else {
      alert('Your submission must be larger than .001 MATIC.')
    }
    
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
							<p className="title">Fundme Proposal: {finalStats[0]}</p>
							<br></br>
							<p className="subtitle">Learn more about this cause or contribute to the campaign </p>
              
              
				</div>
				);

				
				//render minted blogs
					const renderInformation = () => {
						if (currentAccount && finalStats.length > 0) {
							return (
								<div className="mint-container">
									
                 
                <Table striped bordered hover variant="dark" className = "table">
      <thead>
        <tr>
          <th>Campaign Name</th>
          <td>{finalStats[0]}</td>
          </tr>
          <tr>
          <th>Overview</th>
          <td>{finalStats[1]}</td>
          </tr>
          <tr>
          <th>External Reference</th>
          <td><a href={finalStats[2]} >{finalStats[2]} </a> </td>
          </tr>
          <tr>
          <th>Funding Goal</th>
          <td>{finalStats[3]} MATIC</td>
          </tr>
          <tr>
          <th>Current Balance</th>
          <td>{(finalStats[4] / 1000000000000000000)} MATIC</td>
          </tr>
          <tr>
          <th>Submission Deadline</th>
          <td>{finalStats[5]}</td>
          </tr>
          <tr>
          <th>Contribute</th>
          <td><input type="number" 
       min=".001" onChange={handleChange}
       value={message}></input> MATIC</td>
          </tr>
      </thead>
     
    </Table>
    <br></br>
    <button onClick={submitFunds} className="cta-button connect-wallet-button">
        Submit Contribution
      </button>
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

  const renderLoading = () =>{
   
      return (
        <div className="connect-wallet-container2">
          <h2>Transaction Processing...</h2>
          <LoadingSpin className = 'centerspin'/>
        </div>
      ); 
}

const renderSuccess = () =>{
   
  return (
    <div className="connect-wallet-container">
      <h2>You Have Successfully Contributed to This Fund</h2>
      <button className="cta-button connect-wallet-button-two" onClick = {clearView}>Go back</button>
    </div>
  ); 
}
  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
		
  }, [])

  return (
		<div className="App">
		<Helmet>
        <title>View and Contribute to this Fundme Campaign</title>
        <meta name="description" content="Learn about this specific campaign, or contribute to this cause." />
        
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
				{finalStats && (!transaction) && (!success) && renderInformation()}
        {finalStats && transaction && renderLoading()}
        {finalStats && success && renderSuccess()}		
        <div className="footer-container">
        </div>
      </div>
			
			
			
    </div>
  );
};

export default Indprop;