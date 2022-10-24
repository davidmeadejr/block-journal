import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/BlockJournal.json";
import { getContractAddress } from "ethers/lib/utils";

const getEthereumObject = () => window.ethereum;

/*
 * Functions returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    /*
     * First ensure that Ethereum object is accessible.
     */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorised account:", account);
      return account;
    } else {
      console.error("No authorised account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  // const [totalJournalVal, setTotalJournalVal] = useState("");
  /*
   * The passed callback function will be run when the App component mounts (page loads).
   */
  // useEffect(async () => {
  //   const account = await findMetaMaskAccount();
  //   if (account !== null) {
  //     setCurrentAccount(account);
  //   }
  // }, []);

  // Holds the contract address after deployment
  const contractAddress = "0xac855178ED2E7B8a3C64795E626544a176b619CA";

  // Holds the reference to the abi content
  const contractABI = abi.abi;

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  const journal = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const journalPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await journalPortalContract.getTotalJournals();
        console.log("Retrieved total journals...", count.toNumber());

        // Execute the actual wave from the smart contract.
        const journalTxn = await journalPortalContract.journal();
        console.log("Mining...", journalTxn.hash);

        await journalTxn.wait();
        console.log("Mined -- ", journalTxn.hash);

        count = await journalPortalContract.getTotalJournals();
        console.log("Retrieved total journals...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //   journal();
  // }, []);

  useEffect(() => {
    const findAccount = async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
      }
    };
    findAccount();
  }, []);

  // useEffect(() => {
  //   const getTotalJournalsNum = async () => {
  //     const { ethereum } = window;
  //     const provider = new ethers.providers.Web3Provider(ethereum);
  //     const signer = provider.getSigner();
  //     const journalPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  //     const { totalJournalVal } = await journalPortalContract.getTotalJournals();
  //     setTotalJournalVal(totalJournalVal);
  //   };
  //   getTotalJournalsNum();
  // }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">⛓️📝 Block Journal</div>

        <div className="bio">
          Promoting good habits through daily journalling on the blockchain. For a chance to win free ETH. 🦇🔊
        </div>

        <button className="waveButton" onClick={journal}>
          Journal 📝
        </button>
        {/* <div className="totalJournals">Total Number of journals written so far: {}</div> */}
        {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="journalButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
