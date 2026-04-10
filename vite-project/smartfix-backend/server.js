const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Database Linked! (Cloud)");
  } catch (err) {
    console.log("DB Error: ", err.message);
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

const ticketSchema = new mongoose.Schema({
  ticketId: String,
  title: String,
  description: String,
  status: { type: String, default: "Pending" },
  date: String,
  userName: String
});
const Ticket = mongoose.model('Ticket', ticketSchema);

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Resident' }
});
const User = mongoose.model('User', userSchema);

app.post('/api/tickets', async (req, res) => {
  try {
    const newTicket = new Ticket(req.body);
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ _id: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tickets/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedTicket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, username, password, role } = req.body;
    const newUser = new User({ fullName, username, password, role });
    await newUser.save();
    res.status(201).json({ message: "Account Created Successfully!" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists!" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username, password, role });
    if (user) {
      res.json({ success: true, user: { fullName: user.fullName, username: user.username, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid Credentials!" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../dist');
  app.use(express.static(frontendPath));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));