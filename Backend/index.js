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
  'INFY.NS', 'ONGC.NS', 'TCS.NS', 'KPITTECH.NS', 'QUICKHEAL.NS',
  'WIPRO.NS', 'M&M.NS', 'RELIANCE.NS'
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
    name: name,
    qty: qty,
    mode: mode,
    price: price,
    ltp: ltp

  });
  const holding = await HoldingsModel.findOne({ name });



  try {
    await order1.save();
    if (holding) {
      const avrage = (holding.avg + price) / (1 + qty);
      const Tprice = holding.Tprice + price;
      const Quantity = holding.qty + qty;
      await HoldingsModel.findOneAndUpdate(
        { name: name },
        {
          $set: {
            avg: avrage,
            Tprice: Tprice,
            ltp: ltp,
            qty: Quantity
          }
        }
      );


    } else {
      const HoldingObj = await HoldingsModel({

        name: name,
        avg: ltp,
        Tprice: price,
        ltp: ltp,
        qty: qty
      })
     await HoldingObj.save();
    }

    res.status(201).send('Order placed successfully');
  } catch (error) {
    res.status(500).send('Failed to place order');
  }
});

app.get('/find/holdings', async (req, res) => {
  const data = await HoldingsModel.find({});
  res.send(data);
});
app.get('/find/orders', async (req, res) => {
  const data = await OrderModel.find({});
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