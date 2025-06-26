const express = require('express');
const app = express();
const CORS = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const PORT = process.env.PORT || 8082;

const url = "mongodb+srv://jokerdeva18:CtCjfgyTyxNagxCm@cluster0.31bwl.mongodb.net/";
const client = new MongoClient(url);

// Middleware
app.use(CORS());
app.use(express.json());

let db_instance = null;

const connectDB = async() => {
  if (!db_instance) {
    try {
      await client.connect();
      db_instance = await client.db('flight');
      console.log('Connected to DB');
    } catch {
      console.log('failed to connect');
    }
  }
  return db_instance;
};

const InsertionRecord = async(record, collection_name) => {
  const db = await connectDB();
  const collection = db.collection(collection_name);
  const res = await collection.insertOne(record);
  if (res?.acknowledged) {
    console.log('inserted');
    return { type:'insert', status:true };
  } else {
    console.log('fail');
    return { type:'insert', status:false };
  }
};

const UpdateRecord = async(filter, update, collection_name) => {
  const db = await connectDB();
  const collection = db.collection(collection_name);
  const res = await collection.updateOne(filter, update);
  if (res?.acknowledged) {
    console.log('updated');
    return { type:'updated', status:true };
  } else {
    console.log('fail');
    return { type:'update', status:false };
  }
};

const FindRecord = async (query, collection_name, n = 1, projection = {}) => {
  try {
    const db = await connectDB();
    const collection = db.collection(collection_name);
    if (query._id && typeof query._id === 'string') {
      try {
        query._id = ObjectId.createFromHexString(query._id);
      } catch (err) {
        return { status: false, message: 'Invalid ObjectId format' };
      }
    }
    let res;
    if (n !== 1) {
      res = await collection.find(query, { projection }).toArray();
    } else {
      res = await collection.findOne(query);
    }
    if (res && (Array.isArray(res) ? res.length > 0 : true)) {
      return { type:'find', status:true, records:res };
    } else {
      return { type:'find', status:false, records:[] };
    }
  } catch (err) {
    console.error('Error finding records:', err);
    return { type:'find', status:false, error:err.message };
  }
};

app.get('/', (req, res) => {
  return res.json({ message:'working' });
});

// ==================== AUTH ENDPOINTS ====================
app.post('/login', async (req, res) => {
  const { type, user, pwd } = req.body;

  const result = await FindRecord({ user, pwd }, type);
  if (result.status) {
    return res.status(200).json({ status:true, user, id: result.records._id });
  } else {
    return res.status(401).json({ status:false });
  }
});

app.post('/signup', async (req, res) => {
  const { type, user, pwd, email, address, phone, age } = req.body;

  const result = await FindRecord({ user }, type);
  if (result.status) {
    return res.status(401).json({ type:'already', status:false });
  }

  if (type === 'user') {
    const insertResult = await InsertionRecord({ user, pwd, email, address, phone, age }, 'user');
    return res.status(200).json(insertResult);
  }
});

// ==================== FLIGHT ENDPOINTS ====================
app.post('/flight', async (req, res) => {
  const { departureCity, destinationCity, journeyDate } = req.body;

  if (!departureCity || !destinationCity || !journeyDate) {
    return res.json({ status:false, message:'Missing fields' });
  }

  const result = await InsertionRecord({ departureCity, destinationCity, journeyDate }, 'flights');
  if (result.status) {
    return res.json({ status:true, message:'Flight added successfully' });
  } else {
    return res.json({ status:false, message:'Error adding flight' });
  }
});

app.get('/flights', async (req, res) => {
  const { departureCity, destinationCity, journeyDate } = req.query;

  const query = {};
  if (departureCity) query.departureCity = departureCity;
  if (destinationCity) query.destinationCity = destinationCity;
  if (journeyDate) query.journeyDate = journeyDate;

  const result = await FindRecord(query, 'flights', 2);
  if (result.status) {
    return res.json({ status:true, data: result.records });
  } else {
    return res.json({ status:false, message:'No flights found' });
  }
});

// ==================== BOOKING ENDPOINTS ===================
app.post('/book', async (req, res) => {
  const { userId, flightId } = req.body;

  if (!userId || !flightId) {
    return res.json({ status:false, message:'Missing fields' });
  }

  const result = await InsertionRecord({ userId, flightId, bookedAt: new Date() }, 'bookings');
  if (result.status) {
    return res.json({ status:true, message:'Flight booked successfully' });
  } else {
    return res.json({ status:false, message:'Error booking flight' });
  }
});

app.post('/bookkings', async (req, res) => {
  const { type } = req.body;

  const result = await FindRecord({}, type, 2);
  if (result.status) {
    return res.status(200).json({ status:true, data: result.records });
  }
  return res.status(401).json({ status:false });
});

// ==================== CANCEL BOOKING ENDPOINT ===================
app.post('/cancelBooking', async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.json({ status: false, message: 'Missing bookingId' });
  }

  const result = await UpdateRecord({ _id: new ObjectId(bookingId) }, { $set: { status: 'canceled' } }, 'bookings');

  if (result.status) {
    return res.json({ status: true, message: 'Booking canceled successfully' });
  } else {
    return res.json({ status: false, message: 'Unable to cancel booking' });
  }
});

app.post("/flightDetails", async (req, res) => {
  const { flightId } = req.body;

  console.log(flightId)

  if (!flightId) {
    return res.json({ status: false, message: "Missing flightId" });
  }

  const result = await FindRecord({ _id: flightId }, "flights");
  if (result.status) {
    return res.json({ status: true, data: result.records });
  } else {
    return res.json({ status: false, message: "Flight not found" });
  }
});

app.post("/all_bookkings_for_admin", async (req, res) => {
  try {
    const result = await FindRecord({}, "bookkings", 2);
    if (!result.status) {
      return res.json({ status: false, message: "No bookings found" });
    }

    const data = await Promise.all(
      result.records.map(async (b) => {
        // Get Flight Details
        const flightResult = await FindRecord({ _id: b.flightId }, "flights");
        // Get User Details
        const userResult = await FindRecord({ _id: b.userId }, "user");

        return {
          ...b,
          flightDetails: flightResult.records || {},
          userDetails: userResult.records || {},
        };
      })
    );

    res.json({ status: true, data });
  } catch (error) {
    console.error(error);
    res.json({ status: false, message: "Internal error" });
  }
});




// ==================== START SERVER ===================
app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log('Running... On Port', PORT);
});
