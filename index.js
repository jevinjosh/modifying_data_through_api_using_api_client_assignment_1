const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define MenuItem Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

// Routes

// POST /menu - Add a new menu item
app.post("/menu", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ message: "Name and price are required." });
    }

    const newItem = new MenuItem({ name, description, price });
    await newItem.save();
    
    res.status(201).json({ message: "Menu item added", menuItem: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding menu item", error });
  }
});

// GET /menu - Fetch all menu items
app.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items", error });
  }
});

// Start Server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));