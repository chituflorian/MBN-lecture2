import React from "react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import alchemylogo from "./alchemylogo.svg";

const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "initMessage",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "oldStr",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newStr",
        type: "string",
      },
    ],
    name: "UpdatedMessages",
    type: "event",
  },
  {
    inputs: [],
    name: "message",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "newMessage",
        type: "string",
      },
    ],
    name: "update",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contractAddress = "0x5dD56424100edE4dE4831107871E7079660F3cF3";

const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

const HelloWorld = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState(""); // state variable to hold the amount
  const [index, setIndex] = useState(""); // state variable to hold the amount

  //called only once
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        setWeb3(web3);
        setContract(contract);
        setAccount(accounts[0]);
      } else {
        window.alert("Please install MetaMask!");
      }
    };

    initWeb3();
  }, []);

  // function addSmartContractListener() {
  //   helloWorldContract.events.UpdatedMessages({}, (error, data) => {
  //     if (error) {
  //       setStatus("😥 " + error.message);
  //     } else {
  //       setMessage(data.returnValues[1]);
  //       setNewMessage("");
  //       setStatus("🎉 Your message has been updated!");
  //     }
  //   });
  // }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  // const onUpdatePressed = async () => {
  //   const { status } = await updateMessage(walletAddress, newMessage);
  //   setStatus(status);
  // };

  //CONTRACT FUNCTIONALITY

  const stake = async (amount) => {
    await contract.methods.stake(amount).send({ from: account });
  };

  const calculateReward = async () => {
    const reward = await contract.methods.calculateReward(account).call();
    console.log(reward);
  };

  const claim = async () => {
    await contract.methods.claim().send({ from: account });
  };

  const withdraw = async (index) => {
    await contract.methods.withdraw(index).send({ from: account });
  };

  //the UI of our component
  return (
    <div
      id="container"
      className="bg-gray-100 min-h-screen flex flex-col items-center justify-center space-y-4"
    >
      <img id="logo" src={alchemylogo} className="w-24 h-24 mb-8" />

      <button
        id="walletButton"
        onClick={connectWalletPressed}
        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <div className="flex justify-center items-center  ">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="mb-4 py-2 px-4 rounded"
        />

        <button
          onClick={() => stake(amount)}
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Stake
        </button>
      </div>

      <div className="flex justify-center space-x-4 items-center w-full ">
        <input
          type="text"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          placeholder="Enter amount to withdraw"
          className="mb-4 py-2 px-4 rounded"
        />

        <button
          onClick={() => withdraw(index)}
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Withdraw
        </button>
      </div>

      <button
        onClick={calculateReward}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Calculate Reward
      </button>

      <button
        onClick={claim}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Claim Reward
      </button>
    </div>
  );
};

export default HelloWorld;
