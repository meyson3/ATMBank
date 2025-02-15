import React, { useState, useEffect } from "react";
import "./App.css";
import bankLogo from "./bank.png";

const App = () => {
  const [screen, setScreen] = useState("pin");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState({ USD: 1000, EUR: 0, GBP: 0 });
  const [transactionMessage, setTransactionMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, EUR: 0.92, GBP: 0.78 });

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
      setScreen("menu");
    } else {
      alert("Incorrect PIN. Please enter a 4-digit PIN.");
    }
  };

  const withdraw = () => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0 && amt <= balance.USD) {
      setBalance((prev) => ({ ...prev, USD: prev.USD - amt }));
      setTransactionMessage(`You withdrew $${amt}`);
      setScreen("transaction");
    } else {
      alert("Invalid amount or insufficient funds.");
    }
  };

  const deposit = () => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0) {
      setBalance((prev) => ({ ...prev, USD: prev.USD + amt }));
      setTransactionMessage(`You deposited $${amt}`);
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
      setTransactionMessage(`Transferred ${amt} ${currencyFrom} to ${convertedAmount} ${currencyTo}`);
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
          <button onClick={checkPin}>Submit</button>
        </>
      )}
      {screen === "menu" && (
        <>
          <img src={bankLogo} alt="Bank Logo" className="bank-logo" />
          <h2>Choose an Option</h2>
          <button onClick={() => setScreen("withdraw")}>Withdraw</button>
          <button onClick={() => setScreen("deposit")}>Deposit</button>
          <button onClick={() => setScreen("transfer")}>Transfer</button>
          <button onClick={() => setScreen("balance")}>Check Balance</button>
          <button onClick={() => setScreen("pin")}>Logout</button>
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
          <button onClick={transfer}>Transfer</button>
          <button onClick={() => setScreen("menu")}>Back</button>
        </>
      )}
      {screen === "balance" && (
        <>
          <h2>Your Balance</h2>
          <p><strong>USD:</strong> ${balance.USD}</p>
          <p><strong>EUR:</strong> €{balance.EUR}</p>
          <p><strong>GBP:</strong> £{balance.GBP}</p>
          <button onClick={() => setScreen("menu")}>Back to Menu</button>
        </>
        )}
      {screen === "transaction" && (
        <>
          <h2>Transaction Successful</h2>
          <p>{transactionMessage}</p>
          <button onClick={() => setScreen("menu")}>Back to Menu</button>
        </>
      )}
    </div>
  );
};

export default App;
