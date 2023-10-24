const express = require('express');

const cors = require('cors'); // Import the cors package
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json"); // Update this line

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());


app.post('/newcourse', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).send({ error: 'Please enter a name.' });
  }

  try {
    await db.collection('courses').add({ name, description });
    return res.status(200).send({ message: 'Course added successfully.' });
  } catch (error) {
    console.error('Error adding document: ', error);
    return res.status(500).send({ error: 'Failed to add course.' });
  }
});

app.get('/mycourses', async (req, res) => {
  try {
    const snapshot = await db.collection('courses').get();
    const courses = snapshot.docs.map(doc => doc.data());
    return res.status(200).send(courses);
  } catch (error) {
    console.error('Error fetching documents: ', error);
    return res.status(500).send({ error: 'Failed to fetch courses.' });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
