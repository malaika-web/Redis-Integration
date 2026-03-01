const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");

const app = express();
app.use(express.json());

// 🔹 MongoDB Atlas Connection
mongoose.connect("mongodb+srv://malaika:mj12345@cluster0.vhdou6j.mongodb.net/todoApp?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Atlas Connected 🟢"))
  .catch(err => console.log("MongoDB Atlas Connection Error ❌", err));

// 🔹 Redis Cloud Connection
const redisClient = redis.createClient({
  url: "redis://default:I3vBjDbdUM1UYqsIa19kRlGjdnOHnqDH@redis-11994.c13.us-east-1-3.ec2.cloud.redislabs.com:11994"
});

redisClient.on("error", (err) => console.log("Redis Error ❌", err));

(async () => {
  await redisClient.connect();
  console.log("Redis Cloud Connected 🔥");
})();

// 🔹 Mongoose Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model("User", userSchema);

// 🔹 Add User Route
app.post("/add-user", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    await redisClient.del("users"); // clear cache
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 GET Users Route with Redis Cache
app.get("/users", async (req, res) => {
  try {
    const cachedData = await redisClient.get("users");

    if (cachedData) {
      console.log("Data from Redis 🔥");
      return res.json(JSON.parse(cachedData));
    }

    const users = await User.find();
    await redisClient.setEx("users", 60, JSON.stringify(users)); // cache 60 sec

    console.log("Data from MongoDB 💾");
    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Start Server
app.listen(5000, () => {
  console.log("Server Running on port 5000 🚀");
});