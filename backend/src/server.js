const express = require("express");
const cors = require("cors");
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/newcourse", async (req, res) => {
  const { name, description, tags, email } = req.body;

  if (!name) {
    return res.status(400).send({ error: "Please enter a name." });
  }

  const chapters = [
    {
      name: "Default Chapter",
      sets: [],
    },
  ];

  try {
    await db.collection("courses").add({ name, description, tags, email, chapters });
    return res.status(200).send({ message: "Course added successfully." });
  } catch (error) {
    console.error("Error adding document: ", error);
    return res.status(500).send({ error: "Failed to add course." });
  }
});

app.get("/mycourses", async (req, res) => {
  try {
    console.log("/mycourses fetch");
    const email = req.query.email;
    const snapshot = await db
      .collection("courses")
      .where("email", "==", email)
      .get();
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).send(courses);
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return res.status(500).send({ error: "Failed to fetch courses." });
  }
});

app.get("/courses", async (req, res) => {
  try {
    console.log("/courses fetch");
    const snapshot = await db.collection("courses").get();
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).send(courses);
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return res.status(500).send({ error: "Failed to fetch courses." });
  }
});

app.get("/courseinfo", async (req, res) => {
  try {
    const ref = db.collection("courses").doc(req.query.courseid);
    const doc = await ref.get();
    console.log("/courseinfo fetch");
    //console.log(doc.data().chapters[1].name);
    return res
      .status(200)
      .send({ name: doc.data().name, chapters: doc.data().chapters });
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return res.status(500).send({ error: "Failed to fetch course info." });
  }
});

app.post("/newchapter", async (req, res) => {
  const { courseid, name, description, tags } = req.body;

  if (!name) {
    return res.status(400).send({ error: "Please enter a name." });
  }

  const new_chapter = {
    name: name,
    description: description,
    tags: tags,
    sets: [],
  };

  try {
    const ref = db.collection("courses").doc(courseid);
    const doc = await ref.get();
    const chapter_field = doc.data().chapters;
    chapter_field.push(new_chapter);
    await db
      .collection("courses")
      .doc(courseid)
      .update({ chapters: chapter_field });
    return res.status(200).send({ message: "Chapter added successfully." });
  } catch (error) {
    console.error("Error adding field: ", error);
    return res.status(500).send({ error: "Failed to add chapter." });
  }
});

app.post("/newSet", async (req, res) => {
  const { id, index, name, description, cards } = req.body;
  const newSet = { name: name, description: description, cards: cards };

  if (!id) {
    return res.status(400).send({ error: "Please provide a document ID." });
  }

  try {
    const courseRef = db.collection("courses").doc(id);
    const doc = await courseRef.get();
    const courseData = doc.data();
    courseData.chapters[index].sets.push(newSet);
    await courseRef.update(courseData);
    return res.status(200).send({ message: "Course updated successfully." });
  } catch (error) {
    console.error("Error updating document: ", error);
    return res.status(500).send({ error: "Failed to update course." });
  }
});

// This handles the saving of an edited set by reading and overwriting the set that was changed
app.post("/editSet", async (req, res) => {
  const { id, index, setindex, name, description, cards } = req.body;
  const newSet = { name: name, description: description, cards: cards };
  console.log("/editSet fetch");
  if (!id) {
    return res.status(400).send({ error: "Please provide a document ID." });
  }

  try {
    const courseRef = db.collection("courses").doc(id);
    const doc = await courseRef.get();
    const courseData = doc.data();
    courseData.chapters[index].sets[setindex] = newSet;
    await courseRef.update(courseData);
    return res.status(200).send({ message: "Course updated successfully." });
  } catch (error) {
    console.error("Error updating document: ", error);
    return res.status(500).send({ error: "Failed to update course." });
  }
});

// This deletes a specified set from the specified chapter by reading and returning a new array without the element to the db
app.post("/deleteSet", async (req, res) => {
  const { id, index, setindex } = req.body;
  console.log("/deleteSet fetch");
  if (!id) {
    return res.status(400).send({ error: "Please provide a document ID." });
  }

  try {
    // Reads in data from the db
    const courseRef = db.collection("courses").doc(id);
    const doc = await courseRef.get();
    const courseData = doc.data();
    // Removes the set specified from the chapters set array
    courseData.chapters[index].sets.splice(setindex, 1);
    // Updates the course changes in the db
    await courseRef.update(courseData);
    // Return an ok status
    return res.status(200).send({ message: "Course updated successfully." });
  } catch (error) {
    // Display error in console
    console.error("Error updating document: ", error);
    // Return error status
    return res.status(500).send({ error: "Failed to update course." });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
