import React, { useState, useEffect } from "react";
import "./App.css";
import bankLogo from "./bank.png";

const App = () => {
  const [screen, setScreen] = useState("pin");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState({ USD: 1000, EUR: 0, GBP: 0 });
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, EUR: 0.92, GBP: 0.78 });
  const [transactionMessage, setTransactionMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("EUR");

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        let response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        let data = await response.json();
        setExchangeRates({ ...exchangeRates, EUR: data.rates.EUR, GBP: data.rates.GBP });
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

  const convertCurrency = () => {
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
      setTransactionMessage(`Converted: ${amt} ${currencyFrom} to ${convertedAmount} ${currencyTo}`);
      setScreen("transaction");
    } else {
      alert("Enter a valid amount and select different currencies.");
    }
  };

  const logout = () => {
    setScreen("pin");
    setPin("");
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
          <button onClick={() => setScreen("currency")}>Currency Transfer</button>
          <button onClick={() => alert(`Balance: USD ${balance.USD}, EUR ${balance.EUR}, GBP ${balance.GBP}`)}>
            Check Balance
          </button>
          <button onClick={logout}>Logout</button>
        </>
      )}
      {screen === "withdraw" && (
        <>
          <h2>Withdraw</h2>
          <input type="text" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button onClick={withdraw}>Withdraw</button>
          <button onClick={() => setScreen("menu")}>Back</button>
        </>
      )}
      {screen === "deposit" && (
        <>
          <h2>Deposit</h2>
          <input type="text" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button onClick={deposit}>Deposit</button>
          <button onClick={() => setScreen("menu")}>Back</button>
        </>
      )}
      {screen === "currency" && (
        <>
          <h2>Currency Transfer</h2>
          <select value={currencyFrom} onChange={(e) => setCurrencyFrom(e.target.value)}>
            <option value="USD">US Dollars ($)</option>
            <option value="EUR">Euros (€)</option>
            <option value="GBP">British Pounds (£)</option>
          </select>
          <select value={currencyTo} onChange={(e) => setCurrencyTo(e.target.value)}>
            <option value="USD">US Dollars ($)</option>
            <option value="EUR">Euros (€)</option>
            <option value="GBP">British Pounds (£)</option>
          </select>
          <input type="text" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button onClick={convertCurrency}>Convert</button>
          <button onClick={() => setScreen("menu")}>Back</button>
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
