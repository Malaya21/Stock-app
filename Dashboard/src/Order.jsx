import axios from "axios";
import { useState, useEffect } from "react";
const url = "http://localhost:3000/find/orders";
import { Link } from "react-router-dom";

const Orders = () => {
  const [Order, setOrder] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(url);
        setOrder(res.data);
      } catch (err) {
        console.log("Data not found", err.message);
      }
    };

    fetchOrders(); // Call the async function
  }, []);
  return (<div
    className="box"
    style={{ height: "80vh", overflowY: "auto", overflowX: "hidden" }}>
    <h3 className="text-muted">Orders ({Order.length})</h3>
    {Order.length==0?<div className="container">
      <div className="text center">
        <p>You haven't placed any orders yet</p>

        <Link to={"/"} className="btn btn-primary">
          Get started
        </Link>
      </div>
    </div>:
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Stock</th>
          <th scope="col">Qty.</th>
          <th scope="col">Price</th>
          <th scope="col">Mode</th>
          <th scope="col">Date</th>         
          <th scope="col">Time</th>         
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {Order.map((stock, index) => {
         

          return (
            <tr key={index}>
              <td>{stock.name}</td>
              <td>{stock.qty}</td>
              <td>{stock.price.toFixed(2)}</td>
              <td>{stock.mode}</td>
              <td>{stock.date}</td>
              <td>{stock.time}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
}
  </div>
  );
};

export default Orders;
