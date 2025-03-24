import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState,useEffect } from "react";
import Holding from "./Holding";
import Positions from "./Positions";
import Summary from "./Summary";
import Watchlist from "./WatchList";
import Orders from "./Order";
import Funds from "./Funds";
import axios from "axios";
const url = 'http://localhost:3000/stocks'

function DashBoard() {
  const [watchlist,setWatchlist] = useState([]);
  
   useEffect(() => {
      const fetchWatlist = async () => {
        try {
          const res = await axios.get(url);
          setWatchlist(res.data);
        } catch (err) {
          console.log("Data not found", err.message);
        }
      };
  
      fetchWatlist(); // Call the async function
    }, []);
  return (
    <div className="container ">
      <div className="row">
        <div className="col-4 border-end" >
           <Watchlist watchlist={watchlist}/>
        </div>
        <div className="col-8 my-5">
          {/* <BrowserRouter>
            <Routes>
              
              <Route path="/dashboard"></Route>
              <Route path="/position"></Route>
              
              <Route path="/holding"></Route>
            </Routes>
          </BrowserRouter> */}
         
          <Routes>
          <Route path="/" element={<Summary/>}></Route>
            <Route path='/holding' element={<Holding watchlist={watchlist}/>}></Route>
            <Route path='/position' element={<Positions/>}></Route>
            <Route path="/orders" element={<Orders/>}></Route>
           <Route path="/fund" element={<Funds/>}></Route>
          </Routes>
        
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
