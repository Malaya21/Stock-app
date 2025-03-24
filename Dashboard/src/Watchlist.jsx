
import { Tooltip } from "@mui/material";
import { useState,useEffect } from "react";

import BuyOrderModal from "./BuyOrderModal";

function Watchlist({watchlist}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const handleBuyClick = (stock) => {
    setSelectedStock(stock); // Open the modal
  };

  return (
    <>
      {/* Search bar section */}
      <div
        style={{ marginLeft: "-4rem" }}
        className="d-flex justify-content-evenly mt-3"
      >
        {/* Floating Order Modal */}
        {selectedStock && (
          <BuyOrderModal 
            stock={selectedStock} 
            onClose={() => setSelectedStock(null)} 
          />
        )}
        <i className="fa-solid fa-magnifying-glass mt-3 mx-2"></i>
        <input
          type="text"
          style={{ width: "120%", border: "none" }}
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="form-control shadow-none fs-5 fw-light"
        />
        <span className="mt-3 fw-light">{watchlist.length}/50</span>
      </div>
      <hr className="m--" />

      {/* Watchlist section */}
      <div
        className="box"
        style={{ height: "70%", overflowY: "auto", overflowX: "hidden" }}
      >
        {watchlist.map((stock, index) => {
          let isProfit = parseFloat(stock.day)<0 ? "text-danger" : "text-success";

          return (
            <div key={index}> {/* Moved key here */}
              <div
                className="row my-4 p-2 position-relative"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Stock Name */}
                <div className="col-3 fw-light">
                  <span className={isProfit}>{stock.name}</span>
                </div>

                <div className="col-3"></div>

                {/* Percentage Change */}
                <div className="col-2 position-relative">
                  <span className={isProfit}>{stock.day}</span>
                  {hoverIndex === index && (
                    <div
                      className="position-absolute d-flex gap-2"
                      style={{ top: "-.5rem", left: ".2rem" }}
                    >
                      <Tooltip title="Buy (B)" arrow>
                        <button
                          onClick={() => handleBuyClick(stock)}
                          className="buy-sell bg-primary text-light"
                        >
                          B
                        </button>
                      </Tooltip>
                      <Tooltip title="Sell (S)" arrow>
                        <button
                          className="buy-sell"
                          style={{ background: "orange", color: "white" }}
                        >
                          S
                        </button>
                      </Tooltip>
                      <Tooltip title="Share" arrow>
                        <button className="buy-sell share">
                          <i className="fa-solid fa-signal"></i>
                        </button>
                      </Tooltip>
                      <Tooltip title="More" arrow>
                        <button
                          className="buy-sell"
                          onClick={() => console.log("Hello")} 
                        >
                          <i className="fa-solid fa-bars"></i>
                        </button>
                      </Tooltip>
                    </div>
                  )}
                </div>

                {/* Arrow Indicator */}
                <div className="col-1">
                  <span className={isProfit}>
                    {parseFloat(stock.day)<0 ? (
                      <i className="fa-solid fa-arrow-down"></i>
                    ) : (
                      <i className="fa-solid fa-arrow-up"></i>
                    )}
                  </span>
                </div>

                {/* Price and Tooltip */}
                <div
                  className="col-2 position-relative"
                  style={{ top: "-.5rem", left: ".2rem" }}
                >
                  {stock.live}
                </div>
              </div>
              <div className="row">
                <hr className="col-12" />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Watchlist;
