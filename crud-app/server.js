// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Початкові дані
let items = [
  { id: 1, name: "Laptop", price: 1500 },
  { id: 2, name: "Phone", price: 800 },
  { id: 3, name: "Monitor 24\"", price: 220 },
  { id: 4, name: "Wireless Mouse", price: 30 },
];


app.get("/api/items", (req, res) => {
  const q = (req.query.q || "").trim().toLowerCase();
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
  const sort = req.query.sort || null;

  let result = items.slice();

  if (q) {
    result = result.filter(it =>
      String(it.name).toLowerCase().includes(q) ||
      String(it.id).includes(q) ||
      String(it.price).toLowerCase().includes(q)
    );
  }

  if (!isNaN(minPrice) && minPrice !== null) {
    result = result.filter(it => it.price >= minPrice);
  }
  if (!isNaN(maxPrice) && maxPrice !== null) {
    result = result.filter(it => it.price <= maxPrice);
  }

  if (sort) {
    if (sort === "price_asc") result.sort((a,b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a,b) => b.price - a.price);
    if (sort === "name_asc") result.sort((a,b) => a.name.localeCompare(b.name));
    if (sort === "name_desc") result.sort((a,b) => b.name.localeCompare(a.name));
  }

  res.json(result);
});

// CREATE
app.post("/api/items", (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  items.push(newItem);
  res.status(201).json(newItem);
});

// UPDATE
app.put("/api/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: "Item not found" });

  items[index] = { id, ...req.body };
  res.json(items[index]);
});

// DELETE
app.delete("/api/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  items = items.filter((i) => i.id !== id);
  res.status(204).end();
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
