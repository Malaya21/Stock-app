import { useState, useEffect } from "react";
import axios from "axios";

const url = "http://localhost:3000/find/holdings";

const SellOrderModal = ({ stock, watchlist, onClose }) => {
  const [holdings, setHoldings] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null); // Added for error handling

  // Fetch holdings from API
  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await axios.get(url);
        setHoldings(res.data);

        // Set initial values after fetching holdings
        const matchingHolding = res.data.find(item => item.name === stock.name);
        const matchingItem = watchlist.find(item => item.name === stock.name);
        if (matchingHolding && matchingItem) {
          setQuantity(matchingHolding.qty || 0);
          setPrice((matchingItem.live || 0) * (matchingHolding.qty || 0));
        }
      } catch (err) {
        console.error("Data not found:", err.message);
        setError("Failed to fetch holdings data");
      }
    };

    fetchHoldings();
  }, [stock, watchlist]); // Dependencies added

  if (!stock) return null; // Don't render if no stock is selected

  const onChangeQuantity = (e) => {
    const newQuantity = parseFloat(e.target.value) || 0;
    setQuantity(newQuantity);
    setPrice((stock.live || 0) * newQuantity); // Fallback to 0 if stock.live is undefined
  };

  const onChangePrice = (e) => {
    const newPrice = parseFloat(e.target.value) || 0;
    setPrice(newPrice);
    setQuantity(stock.live ? newPrice / stock.live : 0); // Avoid division by zero
  };

  // Function to handle sell order submission
  const handleSell = async () => {
    try {
      await AddOrder({ name: stock.name, qty: quantity, mode: "Sell", price, ltp: stock.live });
      onClose(); // Close the modal after successful sell
    } catch (err) {
      setError("Failed to place sell order");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{stock.name}</h3>
        <p>📈 NSE</p>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Error display */}

        <label>Qty:</label>
        <input
          type="text"
          value={quantity}
          onChange={onChangeQuantity}
        />

        <label>Price:</label>
        <input
          type="text"
          value={price}
          onChange={onChangePrice}
        />

        <button className="buy-button" onClick={handleSell}>
          Sell
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

// Async function to place order
async function AddOrder({ name, qty, mode, price, ltp }) {
  try {
    const response = await axios.post("http://localhost:3000/newOrder", {
      name,
      qty,
      mode,
      price,
      ltp
    });
    console.log("Order placed successfully:", response.data);
  } catch (error) {
    console.error("Error placing order:", error.message);
    throw error; // Re-throw to handle in handleSell
  }
}

export default SellOrderModal;