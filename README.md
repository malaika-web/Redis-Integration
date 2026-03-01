

# 🚀 Backend Project – Redis Caching Integration

This project integrates **Redis caching** with backend GET routes to improve performance and reduce database load.

---

## 📌 Overview

Redis has been integrated into the backend to cache GET API responses.

When a client requests data:

1. Server checks Redis cache first.
2. If data exists → returns cached data.
3. If not → fetches from database.
4. Stores result in Redis.
5. Returns response to client.

This significantly improves response time and scalability.

---

## ⚡ Why Redis?

* Faster response time
* Reduced database queries
* Better performance under heavy traffic
* Temporary in-memory data storage
* Scalable architecture

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* Redis
* MongoDB / SQL (your DB)

---

## 📦 Installation

### 1️⃣ Clone Repository

```bash
https://github.com/malaika-web/Redis-Integration/new/main?filename=README.md
```

### 2️⃣ Install Dependencies

```bash
yarn/npm  install
```

### 3️⃣ Install Redis (if not installed)

Download and install Redis locally
or use Docker:

```bash
docker run -d -p 6379:6379 redis
```

---

## 🔌 Redis Configuration

Example Redis connection:

```js
const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379"
});

client.connect();
```

---

## 🧠 Caching Logic (GET Route Example)

```js
app.get("/api/products", async (req, res) => {
  const cacheKey = "products";

  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }

  const products = await Product.find();

  await client.set(cacheKey, JSON.stringify(products), {
    EX: 60 // cache expires in 60 seconds
  });

  res.json(products);
});
```

---

## ⏳ Cache Expiration

* Cache expires after 60 seconds (configurable)
* Prevents stale data
* Automatically refreshes on next request

---

## 📈 Performance Improvement

Before Redis:

* Every request hits database

After Redis:

* Only first request hits database
* Subsequent requests served from cache

Result:

* Faster API responses
* Reduced DB load
* Better scalability

---

## 🧪 How to Test

1. Start backend server
2. Make GET request (Postman / Browser)
3. First request → slower (DB hit)
4. Second request → faster (Cache hit)

---

## 🛡️ Production Notes

* Use environment variables for Redis URL
* Use proper error handling
* Use cache invalidation on data update
* Consider separate Redis instance for production

---

## 📌 Future Improvements

* Implement cache invalidation on POST/PUT/DELETE
* Use Redis clustering for scalability
* Add logging for cache hits & misses

---

## 👩‍💻 Author

Malaika Javed
BS Computer Science Student
Backend Developer | Web Developer
---


