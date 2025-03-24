import axios from "axios";
import { useState, useEffect } from "react";

const URL = "http://localhost:3000/find/position";

const Positions = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await axios.get(URL);
        setPositions(res.data);
      } catch (err) {
        console.log("Error:", err.message);
      }
    };

    fetchPositions(); // Call the async function
  }, []);

  return (
    <>
      <h3 className="title text-muted">Positions ({positions.length})</h3>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Instrument</th>
              <th scope="col">Qty.</th>
              <th scope="col">Avg.</th>
              <th scope="col">LTP</th>
              <th scope="col">P&L</th>
              <th scope="col">Chg.</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {positions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
