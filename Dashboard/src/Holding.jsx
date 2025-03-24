import axios from "axios";
import { useState, useEffect } from "react";

const url = "http://localhost:3000/find/holdings";

function Holding({ watchlist }) {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await axios.get(url);
        setHoldings(res.data);
      } catch (err) {
        console.log("Data not found", err.message);
      }
    };

    fetchHoldings();
  }, []);

  return (
    <>
      <h3 className="text-muted">Holdings ({holdings.length})</h3>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Instrument</th>
            <th scope="col">Qty.</th>
            <th scope="col">Avg. cost</th>
            <th scope="col">LTP</th>
            <th scope="col">Cur. val</th>
            <th scope="col">T cost</th>
            <th scope="col">T value</th>
            <th scope="col">P&L</th>
            <th scope="col">Net chg.</th>
            <th scope="col">Day chg.</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {holdings.map((stock, index) => {
            // Find matching stock in watchlist
            const matchingItem = watchlist.find(item => item.name === stock.name);
            
            // Calculations
            
            const totalValue = matchingItem ? matchingItem.live * stock.qty : stock.ltp * stock.qty; // Current value
            const profit = totalValue - stock.Tprice; // Absolute profit/loss
            const netChange = matchingItem ? ((matchingItem.live - stock.avg) / stock.avg * 100) : 0; // Net change %
            const dayChange = matchingItem ? matchingItem.day : "N/A"; // Day change from watchlist

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty.toFixed(2)}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.ltp.toFixed(2)}</td>
                <td>{matchingItem ? matchingItem.live.toFixed(2) : stock.ltp.toFixed(2)}</td>
                <td>{stock.Tprice.toFixed(2)}</td>
                <td className={profit>=0?'profit':'loss'}>{totalValue.toFixed(2)}</td>
                <td className={profit>=0?'profit':'loss'}>{profit.toFixed(2)}</td>
                <td className={netChange>=0?'profit':'loss'}>{netChange.toFixed(2)}%</td>
                <td className={parseFloat(dayChange)>=0?'profit':'loss'}>{dayChange}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Holding;