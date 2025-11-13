const express = require('express');
const admin = require('firebase-admin');

// Инициализация Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const app = express();

// Middleware для CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Обработка OPTIONS-запросов (preflight)
app.options('/api/token', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

// Основной эндпоинт
app.get('/api/token', async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "UID required" });
  }

  try {
    const customToken = await admin.auth().createCustomToken(uid);
    res.status(200).json({ token: customToken });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log(`Server running on port ${process.env.PORT || 10000}`);
});
