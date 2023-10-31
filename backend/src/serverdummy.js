const express = require("express");
const cors = require("cors");
dummydata = require("./classes.json");
const fs = require("fs");
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
  const { name, description, email } = req.body;

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
    fs.readFile("classes.json", "utf8", function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        let arr = JSON.parse(data);
        let currentDate = new Date();
        arr.push({
          name: name,
          id: arr.length + 1,
          description: description,
          tag: [],
          owner: email,
          editors: [],
          last_modified: currentDate.getDate(),
          chapters: chapters,
        });

        let json = JSON.stringify(arr);

        fs.writeFile("classes.json", json, "utf8", function (err) {
          if (err) {
            console.log("Error writing file:", err);
          } else {
            console.log("File written successfully");

            // Read the JSON file again to reset the data in the server
            try {
              let data = fs.readFileSync("classes.json", "utf8");
              dummydata = JSON.parse(data); // Reset the data in the server
            } catch (err) {
              console.log(err);
            }
          }
        });
      }
    });
    return res.status(200).send({ message: "Course added successfully." });
  } catch (error) {
    console.error("Error adding document: ", error);
    return res.status(500).send({ error: "Failed to add course." });
  }
});

app.get("/mycourses", async (req, res) => {
  try {
    courses = dummydata;

    return res.status(200).send(courses);
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return res.status(500).send({ error: "Failed to fetch courses." });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const courses = dummydata;

    return res.status(200).send(courses);
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return res.status(500).send({ error: "Failed to fetch courses." });
  }
});

app.get("/courseinfo", async (req, res) => {
  try {
    const courses = dummydata;
    const doc = courses.find(
      (course) => course.id === parseInt(req.query.courseid)
    );

    return res.status(200).send(doc);
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return res.status(500).send({ error: "Failed to fetch course info." });
  }
});

app.post("/newchapter", async (req, res) => {
  const { courseid, name } = req.body;

  if (!name) {
    return res.status(400).send({ error: "Please enter a name." });
  }

  const new_chapter = {
    name: name,
    cards: [],
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

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
