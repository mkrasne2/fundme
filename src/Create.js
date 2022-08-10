import React, { useEffect, useState } from "react";
import './App.css';
import {ethers} from "ethers";
import abi from "./components/abi.json";
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';
import { Helmet } from 'react-helmet';
import LoadingSpin from "react-loading-spin";
import { Link } from  "react-router-dom";





const Create = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [network, setNetwork] = useState('');
  const [transaction, setTransactionProcess] = useState('');
	const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [info, setInfo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [goal, setGoal] = useState('');
  const [addy, setAddy] = useState('');
 


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

  const clearView = async () => {
    setName('');
    setDescription('');
    setInfo('');
    setGoal('');
    setDeadline('');
    setSuccess('');
    setTransactionProcess('');
  }
  
  const submitProp = async () => {
    
    const date = new Date(deadline).getTime()/1000;
    console.log(date);
    
    
    try {
      const { ethereum } = window;
      if (ethereum) {
        // You know all this
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract('0x00977C3a2a6b14AC081A9b3e356B6996e525aB21', abi, signer);
        console.log(contract);
        setTransactionProcess(true);
        let tx = await contract.createFund(name, description, info, date, goal);
        const receipt = await tx.wait();
        const hash = await receipt.transactionHash;
        const logs = await receipt.logs;
        console.log(receipt);
        console.log(receipt.transactionHash);
        console.log(logs[0].data);
        
        


  
        if (receipt.status === 1) {
          const contract = new ethers.Contract('0x00977C3a2a6b14AC081A9b3e356B6996e525aB21', abi, signer);
          const projects = await contract.viewFundProjects();
          const address = projects[projects.length - 1];
          console.log(address);
          setAddy(address);
          console.log(tx.hash);
          setSuccess(true);
          setTransactionProcess(false);
         
        
          
  
          
        } else {
          
          alert("Transaction failed! Please try again");
        }
  
        
      }
    } catch(error){
      console.log(error);
     
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
						<p className="title">Create a Fundme Proposal</p>
						<br></br>
            <p className="subtitle">Sign in with your wallet to create proposals</p>
			</div>
			);

			const renderConnectedTitle = () => (
				<div className = "connected-container">
							<p className="title">Create a Fundme Proposal</p>
							
              
              
				</div>
				);

				
			const renderInputTable = () => {
        
        if (network !== 'Polygon Mumbai Testnet') {
          return (
            <div className="connect-wallet-container">
              <h2>Please switch to Polygon Mumbai Testnet</h2>
          <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
            </div>
          );
        }
        else {
        return (
        <>
        <p className = "input-text">Name: </p>
        <br></br>
        <div className="form-container">
        
        <input className="inputting"
          type="text"
          value={name}
          placeholder='your blog title'
          onChange={e => setName(e.target.value)}
        />
        </div>
        <p className = "input-text">Description: </p>
        <br></br>
        <div className="form-container">
      <textarea className="inputting" rows = "20" cols = "60" name = "description" type="text"
          value={description}
          placeholder='your blog description'
          onChange={e => setDescription(e.target.value)}>
            Enter blog post here...
         </textarea>
         </div>
         <p className = "input-text">External Reference: </p>
         <br></br>
        <div className="form-container">
        <input className="inputting"
          type="text"
          value={info}
          placeholder='your blog title'
          onChange={e => setInfo(e.target.value)}
        />
         </div>
         <p className = "input-text">Deadline (must be {">"} 1 days in the future): </p>
         <br></br>
        <div className="form-container">
        <input type="datetime-local" 
       value={deadline} onChange={e => setDeadline(e.target.value)}
       />
         
         </div>
         <p className = "input-text">Fund Goal (in MATIC): </p>
         <br></br>
        <div className="form-container">
        <input className = 'inputting' type="number" 
       value={goal} onChange={e => setGoal(e.target.value)}
       />
         
         </div>
         
         <button className='cta-button-three' onClick={submitProp}>
              Create Fund
            </button> 

    </>
      )}}
					
					
				
					
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
          <h2>Setting Up Fund Campaign...</h2>
          <LoadingSpin className = 'centerspin'/>
        </div>
      ); 
}

const renderSuccess = () =>{
   
  return (
    <div className="connect-wallet-container">
      <h2>You Have Successfully Created a Fundme Campaign</h2>
      <Link
                        to={`/proposals/${addy}`}
                        
                      > <button className="cta-button connect-wallet-button-two"> View Proposal</button>
                      </Link>
                      <br></br>
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
        <title>Create Your Own Fundme Proposal</title>
        <meta name="description" content="Go ahead and create your own Fundme proposal." />
        
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
        {currentAccount && (!transaction) && (!success) && renderInputTable()}
				{currentAccount && transaction  && renderLoading()}
        {currentAccount  && success && renderSuccess()}
					
        <div className="footer-container">
        </div>
      </div>
			
			
			
    </div>
  );
};

export default Create;