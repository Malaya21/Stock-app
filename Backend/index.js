require('dotenv').config();
const PositionModel = require('./MongooseModels/PositionModel');
const HoldingsModel = require('./MongooseModels/HoldingModel');
const OrderModel = require('./MongooseModels/OrderModel');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;

const app = express();
app.use(express.json());
app.use(cors());

// Using .env variables
const url = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Stock symbols for Indian market (NSE)
const stockSymbols = [
  'INFY.NS',        // Infosys Limited
  'ONGC.NS',        // Oil and Natural Gas Corporation Limited
  'TCS.NS',         // Tata Consultancy Services Limited
  'KPITTECH.NS',    // KPIT Technologies Limited
  'QUICKHEAL.NS',   // Quick Heal Technologies Limited
  'WIPRO.NS',       // Wipro Limited
  'M&M.NS',         // Mahindra & Mahindra Limited
  'RELIANCE.NS',    // Reliance Industries Limited
  'HDFCBANK.NS',    // HDFC Bank Limited
  'ICICIBANK.NS',   // ICICI Bank Limited
  'SBIN.NS',        // State Bank of India
  'AXISBANK.NS',    // Axis Bank Limited
  'TATASTEEL.NS',   // Tata Steel Limited
  'HINDUNILVR.NS',  // Hindustan Unilever Limited
  'ITC.NS',         // ITC Limited
  'BHARTIARTL.NS',  // Bharti Airtel Limited
  'ADANIENT.NS',    // Adani Enterprises Limited
  'BAJFINANCE.NS',  // Bajaj Finance Limited
  'LT.NS',          // Larsen & Toubro Limited
  'SUNPHARMA.NS',   // Sun Pharmaceutical Industries Limited
  'MARUTI.NS',      // Maruti Suzuki India Limited
  
  'ASIANPAINT.NS',  // Asian Paints Limited
  'KOTAKBANK.NS',   // Kotak Mahindra Bank Limited
  
  'HCLTECH.NS',     // HCL Technologies Limited
  'TATAMOTORS.NS',  // Tata Motors Limited
  'ULTRACEMCO.NS'   // UltraTech Cement Limited
];

// New endpoint to fetch stock data from Yahoo Finance
app.get('/stocks', async (req, res) => {
  try {
    const stockData = await Promise.all(stockSymbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        if (!quote || !quote.regularMarketPrice) {
          return {
            name: symbol.split('.')[0],
            live: null,
            value: null,
            day: "N/A",
            net: "N/A",
            isLoss: false,
            error: "No data available"
          };
        }

        const live = quote.regularMarketPrice;

        const dayPercent = ((live - quote.regularMarketPreviousClose) / quote.regularMarketPreviousClose * 100).toFixed(2);



        return {
          name: symbol.split('.')[0],
          live,
          day: `${dayPercent > 0 ? '+' : ''}${dayPercent}%`,

          fullName: quote.longName,
          shortName: quote.shortName,
          dayChange: quote.regularMarketChange,
          open: quote.regularMarketOpen,
          high: quote.regularMarketDayHigh,
          low: quote.regularMarketDayLow,
          close: quote.regularMarketPreviousClose,
          volume: quote.regularMarketVolume,
          bid: quote.bid,
          ask: quote.ask,
          bidSize: quote.bidSize,
          askSize: quote.askSize,
          yearHigh: quote.fiftyTwoWeekHigh,
          yearLow: quote.fiftyTwoWeekLow,
          yearChange: quote.fiftyTwoWeekLowChange,
          yearPercent: (quote.fiftyTwoWeekLowChangePercent * 100).toFixed(2),
          marketCap: quote.marketCap,
          pe: quote.trailingPE,
          eps: quote.epsTrailingTwelveMonths,
          dividend: quote.dividendYield,
          shares: quote.sharesOutstanding,
          book: quote.bookValue,
          fiftyAvg: quote.fiftyDayAverage,
          twoHundredAvg: quote.twoHundredDayAverage,
          fiftyChange: quote.fiftyDayAverageChange,
          twoHundredChange: quote.twoHundredDayAverageChange,
          currency: quote.currency,
          market: quote.market,
          type: quote.quoteType,
          delay: quote.exchangeDataDelayedBy,
          time: quote.regularMarketTime,
          timezone: quote.exchangeTimezoneName,
          gmtOffset: quote.gmtOffSetMilliseconds,
          state: quote.marketState
        };
      } catch (err) {
        console.error(`Error for ${symbol}:`, err.message);
        return {
          name: symbol.split('.')[0],

          live: null,
          value: null,
          day: "N/A",
          net: "N/A",
          isLoss: false,
          error: err.message
        };
      }
    }));


    res.status(200).json(stockData);
  } catch (error) {
    console.error('General error fetching stock data:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});



// Existing endpoints
app.get('/', (req, res) => {
  res.send('Hello world by Malaya');
});

app.post('/newOrder', async (req, res) => {
  const { name, qty, mode, price, ltp } = req.body;

  const order1 = new OrderModel({
    name,
    qty,
    mode,
    price,
    ltp,
  });

  try {
    await order1.save();
    const holding = await HoldingsModel.findOne({ name });

    if (mode === 'buy') { // Buy logic
      if (holding) {
        const avrage = (holding.avg * holding.qty + price) / (holding.qty + qty); // Weighted average
        const Tprice = holding.Tprice + price;
        const Quantity = holding.qty + qty;
        await HoldingsModel.findOneAndUpdate(
          { name },
          {
            $set: {
              avg: avrage,
              Tprice,
              ltp,
              qty: Quantity,
            },
          }
        );
      } else {
        const HoldingObj = new HoldingsModel({
          name,
          avg: price / qty, // Initial average price
          Tprice: price,
          ltp,
          qty,
        });
        await HoldingObj.save();
      }
    } else { // Sell logic
      if (!holding) {
        return res.status(400).send('No holdings found to sell');
      }
      if (qty > holding.qty) {
        return res.status(400).send('Cannot sell more than you own');
      }

      const Quantity = holding.qty - qty;
      const Tprice = holding.Tprice - price;

      if (Quantity === 0) {
        // Delete holding if all shares are sold
        await HoldingsModel.findOneAndDelete({ name });
      } else {
        // Update holding with remaining shares
        const avrage = Tprice / Quantity; // Safe: Quantity > 0
        await HoldingsModel.findOneAndUpdate(
          { name },
          {
            $set: {
              avg: avrage,
              Tprice,
              ltp,
              qty: Quantity,
            },
          }
        );
      }
    }

    res.status(201).send('Order placed successfully');
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send('Failed to place order');
  }
});

app.get('/find/holdings', async (req, res) => {
  const data = await HoldingsModel.find({}).sort({date:-1,time:-1});
  res.send(data);
});
app.get('/find/orders', async (req, res) => {
  const data = await OrderModel.find({}).sort({date:-1,time:-1});
  res.send(data);
});

app.get('/find/position', async (req, res) => {
  const data = await PositionModel.find({});
  res.send(data);
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
// app.get('/delete/orders',async (req,resp)=>{
//   const data = await OrderModel.deleteMany({});
//   console.log(data);
  
//    resp.send('sucessfully deleted');
// })