import {useEffect, useState} from "react";
import { endpointPath } from "../config/api";

export default function ConverterResult() {
  const [amount, setAmount] = useState(0)
  const [fromCur, setFromCur] = useState("EUR")
  const [toCur, setToCur] = useState("USD")
  const [converted, setConverted] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currencies, setCurrencies] = useState([])


  useEffect(function(){
    async function convert(){
      setIsLoading(true)
        const res = await fetch (endpointPath(amount, fromCur, toCur));
        const data = await res.json();
        setConverted(data.rates[toCur]);
        setIsLoading(false)
    }
    if (fromCur === toCur) return setConverted(amount)
    convert()
  }, [amount, fromCur, toCur])

  useEffect(function(){
    async function currencies(){
      const res = await fetch(`https://api.frankfurter.app/currencies`)
      const data = await res.json();
      setCurrencies(data)
    }
    currencies()
  }, [])

  const handleInput = (event) => {
    const { value } = event.target;
    setAmount(value);
  };


  return (
      <>
        <div className="container-fluid">
          <div className="app">
            <input
              className="form-control-lg amount bg-dark shadow"
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={handleInput}
            />
          </div>
        <div>
          <p>From</p>
          <select
              value={fromCur}
              onChange={e=>setFromCur(e.target.value)}
          >
            { Object.entries(currencies).map((c,v) => <option key={c} value={c[0]}>{c[0]}-{c[1]}</option>) }
          </select>
        </div>
        <div>
          <p>To</p>
          <select
              value={toCur}
              onChange={e=>setToCur(e.target.value)}
          >
            { Object.entries(currencies).map((c,v) => <option key={c} value={c[0]}>{c[0]}-{c[1]}</option>) }
          </select>
        </div>


        <p>{converted} {toCur}</p>
      </div>
      </>
  );
}
