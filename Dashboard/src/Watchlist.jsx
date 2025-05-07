import { Tooltip } from "@mui/material";
import { useState } from "react";
import SellOrderModal from "./SellOrderModal";
import BuyOrderModal from "./BuyOrderModal";
import { DoughnutChart } from "./DoughnutChart";
import { Link } from "react-router-dom";
function Watchlist({ watchlist }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedStockBuy, setSelectedStockBuy] = useState(null);
  const [selectedStockSell, setSelectedStockSell] = useState(null);
  const [inputStock,setInputStock] = useState(null);

  const handleBuyClick = (stock) => {
    setSelectedStockBuy(stock);
  };

  const handleSellClick = (stock) => {
    setSelectedStockSell(stock);
  };

  return (
    <>
      {/* Search bar section */}
      <div
        style={{ marginLeft: "-4rem" }}
        className="d-flex justify-content-evenly mt-3"
      >
        {selectedStockBuy && (
          <BuyOrderModal
            stock={selectedStockBuy}
            onClose={() => setSelectedStockBuy(null)}
          />
        )}
        {selectedStockSell && (
          <SellOrderModal
            stock={selectedStockSell}
            watchlist={watchlist}
            onClose={() => setSelectedStockSell(null)}
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
        style={{ height: "80vh", overflowY: "auto", overflowX: "hidden" }}
      >
        {watchlist.map((stock, index) => {
          let isProfit =
            parseFloat(stock.day) < 0 ? "text-danger" : "text-success";

          return (
            <div key={index}>
              <div
                className="row my-4 p-2 position-relative"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="col-3 fw-light">
                  <span className={isProfit}>{stock.name}</span>
                </div>
                <div className="col-3"></div>
                <div className="col-2 position-relative">
                  <span className={isProfit}>{stock.day}</span>
                  {hoverIndex === index && (
                    <div
                      className="position-absolute d-flex gap-2"
                      style={{ top: "-.5rem", right: "-3.3rem" }}
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
                          onClick={() => handleSellClick(stock)}
                          className="buy-sell"
                          style={{ background: "orange", color: "white" }}
                        >
                          S
                        </button>
                      </Tooltip>

                      <Tooltip title="Share" arrow>
                        <button className="buy-sell btn-primary share">
                          <Link to={"/stockdetail/" + stock.name}>
                            {" "}
                            <i className="fa-solid fa-signal"></i>
                          </Link>
                        </button>
                      </Tooltip>
                      <Tooltip title="More" arrow>
                        <button
                          className="buy-sell"
                          onClick={() => console.log("More clicked")}
                        >
                          <a href="#doughnut">
                            {" "}
                            <i className="fa-solid fa-bars"></i>
                          </a>
                        </button>
                      </Tooltip>
                    </div>
                  )}
                </div>
                <div className="col-1">
                  <span className={isProfit}>
                    {parseFloat(stock.day) < 0 ? (
                      <i className="fa-solid fa-arrow-down"></i>
                    ) : (
                      <i className="fa-solid fa-arrow-up"></i>
                    )}
                  </span>
                </div>
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
        {/* Place DoughnutChart inside the box */}
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h4 id="doughnut">Watchlist Price Distribution</h4>
          <DoughnutChart watchlist={watchlist} />
        </div>
      </div>
    </>
  );
}

export default Watchlist;
