import React, { useEffect, useState} from "react";
import  {ethers}  from 'ethers';  
// import { Contract, Web3Provider } from 'ethers';
import Web3 from 'web3';
 
import { contractABI, contractAddress } from "../../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;



const getEthereumContract = () => {

        // const web3 = new Web3(window.ethereum);
        // const provider = new ethers.getDefaultProvider();
         //const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.alchemyapi.io/v2/$ZJZl8uJxwxU6IkFsWXERSax_Kzvy3Ugi`);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
  
  return transactionContract;  
}

export const TransactionProvider = ({ children }) => {
    
const [currentAccount, setCurrentAccount] = useState('');
const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: ''});
const [isLoading, setIsLoading] = useState(false);
const [transactionCount, setTransactionCount ] = useState(localStorage.getItem('transactionCount'));
const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value}));
    }

    const getAllTranscations = async () => {
        try {
          if (!ethereum) return alert ("Please Add Ethereum");
            const transactionContract = getEthereumContract();
    
            const availableTransactions = await transactionContract.getAllTranscations();

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
              }));
      
              console.log(structuredTransactions)

              setTransactions(structuredTransactions);
        
          } catch (error) { 
            console.log(error);
            }};
        


    const checkIfWalletIsConnected = async () => {
    try {
        if(!ethereum) return alert("Please install MetaMask");

        const accounts = await ethereum.request({ method: 'eth_accounts'});


        if(accounts.length) {
            setCurrentAccount(accounts[0]);    
            getAllTranscations();
        } else {
            console.log('No accounts found');
        }
     
         }   catch(error) {
        console.log(error);
        throw new Error("No ethereum object.")
    }
}
const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionContract = getEthereumContract();
        const currentTransactionCount = await transactionContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

    const connectWallet = async () => {
            try {
                if(!ethereum) return alert("Please install MetaMask");
                const accounts = await ethereum.request({ method: 'eth_requestAccounts'});

                setCurrentAccount(account[0]);
                window.location.reload();
            } catch (error) {
                    console.log(error);

                    throw new Error("No ethereum object.");
            }
          }

           useEffect(() => {
            checkIfWalletIsConnected();
             }, []);

         
const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");

            //get data from the form
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
          
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", //21000 gwei
                    value: parsedAmount._hex, //0.00001
                }]
            });

    const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

    setIsLoading(true);
    console.log(`Loading - ${transactionHash.hash}`);
    await transactionHash.wait();
    setIsLoading(false);
    console.log(`Success - ${transactionHash.hash}`);
    

    const transactionCount = await transactionContract.getTransactionCount();
    
    setTransactionCount(transactionCount.toNumber());

    window.location.reload();
           } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    useEffect(() => {
      checkIfWalletIsConnected();
      checkIfTransactionsExists();
    }, [transactionCount]);

    return (
        <TransactionContext.Provider value={{ connectWallet, 
        currentAccount,
         formData, 
         setFormData,
          handleChange,
           sendTransaction, 
           transactions, 
           isLoading}}>
            {children}
        </TransactionContext.Provider>
    );
}
