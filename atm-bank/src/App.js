import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";
import bankLogo from "./bank.png";
import loadGif from "./Money Saving GIF by Pudgy Penguins.gif";

const App = () => {
  const [screen, setScreen] = useState("pin");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState({ USD: 1000, EUR: 0, GBP: 0 });
  const [transactionMessage, setTransactionMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, EUR: 0.92, GBP: 0.78 });
  const [history, setHistory] = useState([]); // Store transactions

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        let response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        let data = await response.json();
        setExchangeRates({
          USD: 1,
          EUR: data.rates.EUR,
          GBP: data.rates.GBP
        });
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      }
    };
    fetchExchangeRates();
  }, []);

  const checkPin = () => {
    if (pin === "0000") {
      setScreen("loading");
      setTimeout(() => {
        setScreen("menu");
      }, 3000);
    } else {
      alert("Incorrect PIN. Please enter a 4-digit PIN.");
    }
  };
  const loading = function Loading(){
    const [loading, setLoading] = useState(false);

  }
  const withdraw = () => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0 && amt <= balance.USD) {
      setBalance((prev) => ({ ...prev, USD: prev.USD - amt }));
      const transaction = `Withdrew $${amt}`;
      setTransactionMessage(transaction);
      setHistory((prev) => [...prev, { message: transaction, timestamp: new Date().toLocaleString() }]);
      setScreen("transaction");
    } else {
      alert("Invalid amount or insufficient funds.");
    }
  };

  const deposit = () => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0) {
      setBalance((prev) => ({ ...prev, USD: prev.USD + amt }));
      const transaction = `Deposited $${amt}`;
      setTransactionMessage(transaction);
      setHistory((prev) => [...prev, { message: transaction, timestamp: new Date().toLocaleString() }]);
      setScreen("transaction");
    } else {
      alert("Enter a valid amount.");
    }
  };

  const transfer = () => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0 && currencyFrom !== currencyTo) {
      if (amt > balance[currencyFrom]) {
        alert("Insufficient funds.");
        return;
      }
      const convertedAmount = (amt * (exchangeRates[currencyTo] / exchangeRates[currencyFrom])).toFixed(2);
      setBalance((prev) => ({
        ...prev,
        [currencyFrom]: prev[currencyFrom] - amt,
        [currencyTo]: prev[currencyTo] + parseFloat(convertedAmount),
      }));
      const transaction = `Transferred ${amt} ${currencyFrom} to ${convertedAmount} ${currencyTo}`;
      setTransactionMessage(transaction);
      setHistory((prev) => [...prev, { message: transaction, timestamp: new Date().toLocaleString() }]);
      setScreen("transaction");
    } else {
      alert("Enter a valid amount and select different currencies.");
    }
  };

  return (
    <div className="container">
      {screen === "pin" && (
        <>
          <img src={bankLogo} alt="Bank Logo" className="bank-logo" />
          <h2>Enter PIN</h2>
          <input
            type="password"
            placeholder="Enter PIN"
            maxLength="4"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <AnimatedButton text="Submit" onClick={checkPin} />
        </>
      )}
      {screen === "balance" && (
  <>
    <h2>Your Balance</h2>
    <p><strong>USD:</strong> ${balance.USD}</p>
    <p><strong>EUR:</strong> €{balance.EUR}</p>
    <p><strong>GBP:</strong> £{balance.GBP}</p>
    <AnimatedButton text="Back"onClick={() => setScreen("menu")} />
  </>
)}
{screen === "transfer" && (
  <>
    <h2>Transfer Money</h2>
    <select value={currencyFrom} onChange={(e) => setCurrencyFrom(e.target.value)}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
    </select>
    <select value={currencyTo} onChange={(e) => setCurrencyTo(e.target.value)}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
    </select>
    <input
      type="number"
      placeholder="Enter amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />
    <AnimatedButton text="Back"onClick={transfer} />
    <AnimatedButton text="Back"onClick={() => setScreen("menu")} />
  </>
)}

      {screen === "menu" && (
      <>
        <img src={bankLogo} alt="Bank Logo" className="bank-logo" />
        <h2>Choose an Option</h2>
        <AnimatedButton text="Withdraw" onClick={() => setScreen("withdraw")} />
        <AnimatedButton text="Deposit" onClick={() => setScreen("deposit")} />
        <AnimatedButton text="Transfer" onClick={() => setScreen("transfer")} />
        <AnimatedButton text="Check Balance" onClick={() => setScreen("balance")} />
        <AnimatedButton text="Transaction History" onClick={() => setScreen("history")} />
        <AnimatedButton text="Logout" onClick={() => setScreen("pin")} />
      </>
      )}

      {screen === "withdraw" && (
        <>
          <h2>Withdraw Money</h2>
          <input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <AnimatedButton text="Withdraw"onClick={withdraw} />
          <AnimatedButton text="Back"onClick={() => setScreen("menu")} />
        </>
      )}
      {screen === "deposit" && (
        <>
          <h2>Deposit Money</h2>
          <input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <AnimatedButton text="Deposit" onClick={deposit} />
          <AnimatedButton text="Back" onClick={() => setScreen("menu")} />
        </>
      )}
      {screen === "loading" && (
  <>
    <h2>Welcome!</h2>
    <div className="loading-container">
      <img src={loadGif} alt="Loading..." className="loading-gif" />
    </div>
  </>
)}
      {screen === "transaction" && (
        <>
          <h2>Transaction Successful</h2>
          <p>{transactionMessage}</p>
          <AnimatedButton text="Back to Menu" onClick={() => setScreen("menu")} />        </>
      )}
      {screen === "history" && (
        <>
          <h2>History of Transactions</h2>
          {history.length > 0 ? (
            <ul>
              {history.map((txn, index) => (
                <li key={index}>{txn.timestamp} - {txn.message}</li>
              ))}
            </ul>
          ) : (
            <p>No transactions yet.</p>
          )}
         <AnimatedButton text="Back"onClick={() => setScreen("menu")} />
        </>
      )}
    </div>
  );
};
const AnimatedButton = ({ text, onClick }) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.1,
        background: "linear-gradient(135deg, #38ff42, #38ff42)",
        boxShadow: "0px 4px 10px rgb(56, 255, 66)",
        transition: { duration: 0.3 }
      }}
      whileTap={{
        scale: 0.9,
        rotate: [-5, 0],
        transition: { type: "spring", stiffness: 300 }
      }}
      style={{
        padding: "12px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        background: "linear-gradient(135deg, #007bff, #00c6ff)",
        color: "#fff",
        outline: "none",
        fontWeight: "bold"
      }}
      onClick={onClick}
    >
      {text}
    </motion.button>
  );
};

export default App;
