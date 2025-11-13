const express = require('express');
const admin = require('firebase-admin');

// Инициализация Firebase Admin SDK
admin.initializeApp({
  credential: admin.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const app = express();

app.get('/api/token', async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "UID required" });
  }

  try {
    const customToken = await admin.auth().createCustomToken(uid);
    res.status(200).json({ token: customToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
