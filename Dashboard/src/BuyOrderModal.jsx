import { useState } from "react";
import axios from "axios";

const BuyOrderModal = ({ stock, onClose }) => {
  if (!stock) return null; // Don't render if no stock is selected

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stock.live);
 

  const onChangeQuantity = (e) => {
    const newQuantity = parseFloat(e.target.value) || 0;
    setQuantity(newQuantity);
    setPrice(stock.live * newQuantity); // Update price dynamically
  };

  const onChangePrice = (e) => {
    const newPrice = parseFloat(e.target.value) || 0;
    setPrice(newPrice);
    setQuantity(newPrice / stock.live); // Update quantity dynamically
  };

  // Function to handle buy order submission
  const handleBuy = () => {
    AddOrder({ name: stock.name, qty: quantity, mode: "buy", price,ltp:stock.live });
    onClose(); // Close the modal after placing order
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{stock.name}</h3>
        <p>📈 NSE</p>

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

        <button className="buy-button" onClick={handleBuy}>Buy</button>
        <button className="cancel-button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

async function AddOrder({ name, qty, mode, price ,ltp}) {
  try {
    axios.post("http://localhost:3000/newOrder",{name, qty, mode, price,ltp}); 
  }
    
   catch (error) {
    console.log('Error occurs',error.message);
    
    
}}

export default BuyOrderModal;
