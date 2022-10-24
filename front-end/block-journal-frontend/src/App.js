import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/BlockJournal.json";

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

  // All state property to store all journals
  const [allJournals, setAllJournals] = useState([]);
  const [journalLog, setJournalLog] = useState("");

  // Holds the contract address after deployment
  const contractAddress = "0x22cf6548C4292d76A8b33080Ac0C8a6Ad665977A";

  // Holds the reference to the abi content
  const contractABI = abi.abi;

  // Gets all the journals from the contract.
  const getAllJournals = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const journalPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Call the getAllJournals method from the smart contract
        const journals = await journalPortalContract.getAllJournals();

        // Enables access to the address, timestamp and message.
        let journalsCleaned = [];
        journals.forEach((journal) => {
          journalsCleaned.push({
            address: journal.journaler,
            timestamp: new Date(journal.timestamp * 1000),
            message: journal.message,
          });
        });
        // Store all data in React state
        setAllJournals(journalsCleaned);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

        // Execute the actual journal from the smart contract.
        const journalTxn = await journalPortalContract.journal(journalLog, { gasLimit: 300000 });
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

  useEffect(() => {
    const findAccount = async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
        getAllJournals();
      }
    };
    findAccount();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">⛓️📝 Block Journal</div>

        <div className="bio">
          Promoting good habits through daily journalling on the blockchain. For a chance to win free ETH. 🦇🔊
        </div>

        {currentAccount ? (
          <textarea
            name="Journal Log"
            placeholder="Write your daily journal..."
            type="text"
            id="Journal"
            value={journalLog}
            onChange={(e) => setJournalLog(e.target.value)}
          />
        ) : null}
        <button className="journalButton" onClick={journal}>
          Save Journal 📝
        </button>

        {!currentAccount && (
          <button className="journalButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allJournals.reverse().map((journal, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {journal.address}</div>
              <div>Time: {journal.timestamp.toString()}</div>
              <div>Message: {journal.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default App;
