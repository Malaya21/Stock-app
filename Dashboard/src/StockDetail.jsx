import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function StockDetail({details}) {
    const {name} = useParams()
   const stockdetail =  details.find((item)=>item.name==name);
   console.log(stockdetail);
   const labels = ['Current P.', 'Opening P.', 'Closing P.Y', 'Lowest P.T', 'Highest P.T', '50 day Avg', '200 day Avg','Lowest P of 2025','Highest P. of 2025'];
   const data = {
    labels,
    datasets: [
      {
        label: stockdetail.fullName,
        data: [stockdetail.live,stockdetail.open,stockdetail.close,stockdetail.low,stockdetail.high,stockdetail.fiftyAvg ,stockdetail.twoHundredAvg ,stockdetail.yearLow,stockdetail.yearHigh
        ],
        backgroundColor: 'rgba(5, 255, 222, 0.92)',
      },
     
    ],
  };
    return ( 
    <div className="box"
      style={{ height: "80vh", overflowY: "auto", overflowX: "hidden" }}>
    <Bar  data={data} />
    <div className="container mt-3">
      <h3 className="text-center mb-3">{stockdetail.fullName}</h3>
      <p className="text-center mb-3">({stockdetail.name})</p>
      <table className="table table-striped table-bordered">
      <thead>
    <tr>
      <th scope="col">Details</th>
      <th scope="col">Value</th>    
    </tr>
  </thead>
        <tbody>
          <tr>
            <td><strong>Current Price</strong></td>
            <td>₹{stockdetail.live}</td>
          </tr>
          <tr>
            <td><strong>Open Price</strong></td>
            <td>₹{stockdetail.open}</td>
          </tr>
          <tr>
            <td><strong>Previous Close</strong></td>
            <td>₹{stockdetail.close}</td>
          </tr>
          <tr>
            <td><strong>Day Change</strong></td>
            <td>₹{stockdetail.dayChange} ({stockdetail.day})</td>
          </tr>
          <tr>
            <td><strong>High (Today)</strong></td>
            <td>₹{stockdetail.high}</td>
          </tr>
          <tr>
            <td><strong>Low (Today)</strong></td>
            <td>₹{stockdetail.low}</td>
          </tr>
          <tr>
            <td><strong>52-Week High</strong></td>
            <td>₹{stockdetail.yearHigh}</td>
          </tr>
          <tr>
            <td><strong>52-Week Low</strong></td>
            <td>₹{stockdetail.yearLow}</td>
          </tr>
          <tr>
            <td><strong>Market Cap</strong></td>
            <td>₹{(stockdetail.marketCap / 1e12).toFixed(2)} Trillion</td>
          </tr>
          <tr>
            <td><strong>P/E Ratio</strong></td>
            <td>{stockdetail.pe}</td>
          </tr>
          <tr>
            <td><strong>EPS</strong></td>
            <td>₹{stockdetail.eps}</td>
          </tr>
          <tr>
            <td><strong>Dividend</strong></td>
            <td>₹{stockdetail.dividend}</td>
          </tr>
          <tr>
            <td><strong>50-Day Avg.</strong></td>
            <td>₹{stockdetail.fiftyAvg}</td>
          </tr>
          <tr>
            <td><strong>200-Day Avg.</strong></td>
            <td>₹{stockdetail.twoHundredAvg}</td>
          </tr>
          <tr>
            <td><strong>Trading Volume</strong></td>
            <td>{stockdetail.volume.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div> );
}

export default StockDetail;