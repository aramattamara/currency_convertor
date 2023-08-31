import React, { useEffect, useState } from "react";
import { endpointPath } from "../config/api";

export default function ConverterResult() {
  const [amount, setAmount] = useState("1");
  const [rate, setRate] = useState('0')
  const [fromCur, setFromCur] = useState("EUR");
  const [toCur, setToCur] = useState("USD");
  const [converted, setConverted] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableCurrencies, setAvailableCurrencies] = useState({});
  const [currenciesSwapped, setCurrenciesSwapped] = useState(false);

  const handleSwapCurrencies = () => {
    setFromCur(toCur);
    setToCur(fromCur);
    setCurrenciesSwapped(!currenciesSwapped);
  };

  const handleInput = (event) => {
    const { value } = event.target;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };


  useEffect(() => {
    async function fetchConversationData() {
      setIsLoading(true);
      try {
        // Fetch conversion rate for 1 unit of "From" currency to "To" currency
        const rateResponse = await fetch(endpointPath(1, fromCur, toCur));
        const rateData = await rateResponse.json();
        setRate(rateData.rates[toCur])

        // Fetch conversion result based on entered amount
        const resultResponse = await fetch(endpointPath(amount, fromCur, toCur));
        const resultData = await resultResponse.json();
        setConverted(resultData.rates[toCur]);

      } catch (error) {
        // Handle fetch or conversion errors here
        console.error("Error fetching data:", error);
        setConverted("Error");
      } finally {
        setIsLoading(false);
      }
    }

    if (fromCur !== toCur) {
      fetchConversationData();
    } else {
      setRate('1')
      setConverted(amount);
    }
  }, [amount, fromCur, toCur]);


  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const res = await fetch(`https://api.frankfurter.app/currencies`);
        const data = await res.json();
        setAvailableCurrencies(data);
      } catch (error) {
        // Handle fetch error here
        console.error("Error fetching currencies:", error);
      }
    }
    fetchCurrencies();
  }, []);

  return (
      <div className="container-fluid">
        <div className="conversion-ratio">
          <span>{`1 ${fromCur}`}</span>
           {" equals "}
           <span>{converted === "Error" ? "Error" : `${rate} ${toCur}`}</span>

        </div>
        <div className="from-to-select-container">
          <p>FROM:</p>
          <div className="input-section">
            <input
                className="form-control-lg amount bg-dark shadow"
                type="text"
                placeholder="Enter Amount"
                value={amount}
                onChange={handleInput}
            />
            {amount === "0" && (
                <p className="default-rate">1 {fromCur} equals {converted === "Error" ? "Error" : `${converted} ${toCur}`}</p>
            )}
          </div>
          <select value={fromCur} onChange={(e) => setFromCur(e.target.value)}>
            {Object.entries(availableCurrencies).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
            ))}
          </select>
        </div>
        {/* Switch button */}
        <div className="switch-button-container">
          <button className="switch-button" onClick={handleSwapCurrencies}>
            {currenciesSwapped ? "Switch Back" : "Switch Currencies"}
          </button>
        </div>
        <div className="from-to-select-container">
          <p>TO:</p>
          <div className="input-section">
            <input
                className="form-control-lg amount bg-dark shadow"
                type="text"
                value={isLoading ? "Loading..." : `${converted}`}
                readOnly
            />
          </div>
          <select value={toCur} onChange={(e) => setToCur(e.target.value)}>
            {Object.entries(availableCurrencies).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
            ))}
          </select>
        </div>
      </div>
  );
}
