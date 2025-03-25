import { useState, useEffect } from "react";
import axios from "axios";

const url = "http://localhost:3000/find/holdings";

const SellOrderModal = ({ stock, watchlist, onClose }) => {
  const [holdings, setHoldings] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await axios.get(url);
        setHoldings(res.data);

        const matchingHolding = res.data.find((item) => item.name === stock.name);
        const matchingItem = watchlist.find((item) => item.name === stock.name);

        const qty = matchingHolding?.qty || 0;
        const livePrice = matchingItem?.live || 0;

        setQuantity(qty);
        setPrice(livePrice * qty);

        if (qty === 0 || livePrice === 0) {
          setWarning("You do not have any shares of this stock currently.");
        }
      } catch (err) {
        console.error("Data not found:", err.message);
        setError("Failed to fetch holdings data");
      }
    };

    if (stock) fetchHoldings();
  }, [stock, watchlist]);

  if (!stock) return null;

  const maxQuantity = holdings.find((item) => item.name === stock.name)?.qty || 0;
  const livePrice = stock.live || 0;
  const maxPrice = livePrice * maxQuantity;

  const onChangeQuantity = (e) => {
    const newQuantity = parseFloat(e.target.value) || 0;
    const clampedQty = Math.min(newQuantity, maxQuantity);

    if (maxQuantity === 0) {
      setWarning("You do not have any shares of this stock currently.");
      return;
    }
    if (newQuantity > maxQuantity) {
      setWarning(`Quantity cannot exceed ${maxQuantity}`);
    } else {
      setWarning(null);
    }

    setQuantity(clampedQty);
    setPrice(livePrice * clampedQty);
  };

  const onChangePrice = (e) => {
    const newPrice = parseFloat(e.target.value) || 0;
    const clampedPrice = Math.min(newPrice, maxPrice);

    if (maxPrice === 0) {
      setWarning("You do not have any shares of this stock currently.");
      return;
    }
    if (newPrice > maxPrice) {
      setWarning(`Price cannot exceed ${maxPrice.toFixed(2)}`);
    } else if (livePrice && newPrice / livePrice > maxQuantity) {
      setWarning(`Price implies quantity exceeding ${maxQuantity}`);
    } else {
      setWarning(null);
    }

    setPrice(clampedPrice);
    setQuantity(livePrice ? Math.min(clampedPrice / livePrice, maxQuantity) : 0);
  };

  const handleSell = async () => {
    if (maxQuantity === 0 || maxPrice === 0) {
      setWarning("You do not have any shares of this stock currently.");
      return;
    }
    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    if (quantity > maxQuantity) {
      setWarning(`Quantity cannot exceed ${maxQuantity}`);
      return;
    }
    if (price > maxPrice) {
      setWarning(`Price cannot exceed ${maxPrice.toFixed(2)}`);
      return;
    }

    try {
      await AddOrder({
        name: stock.name,
        qty: quantity,
        mode: "Sell",
        price,
        ltp: stock.live,
      });
      onClose();
    } catch (err) {
      setError("Failed to place sell order");
    }
  };

  const isSellDisabled = maxQuantity === 0 || maxPrice === 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{stock.name}</h3>
        <p>📈 NSE</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {warning && <p style={{ color: "orange" }}>{warning}</p>}

        <label>Qty:</label>
        <input
          type="number"
          value={quantity}
          onChange={onChangeQuantity}
          min="0"
          max={maxQuantity}
          step="1"
          disabled={maxQuantity === 0}
        />

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={onChangePrice}
          min="0"
          max={maxPrice}
          step="0.01"
          disabled={maxPrice === 0}
        />

        <button
          className="buy-button"
          onClick={handleSell}
          disabled={isSellDisabled}
          style={{ opacity: isSellDisabled ? 0.5 : 1 }} // Optional: Visual feedback
          
        >
          Sell
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

async function AddOrder({ name, qty, mode, price, ltp }) {
  try {
    const response = await axios.post("http://localhost:3000/newOrder", {
      name,
      qty,
      mode,
      price,
      ltp,
    });
    console.log("Order placed successfully:", response.data);
  } catch (error) {
    console.error("Error placing order:", error.message);
    throw error;
  }
}

export default SellOrderModal;