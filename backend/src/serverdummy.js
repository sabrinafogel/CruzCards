const express = require("express");
const cors = require("cors");
dummydata = require("../classes.json");
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
  const { name, description, tags, email, editors } = req.body;

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
    fs.readFile("./classes.json", "utf8", function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        let arr = JSON.parse(data);
        let currentDate = new Date();
        arr.push({
          name: name,
          id: arr.length + 1,
          description: description,
          tags: tags,
          owner: email,
          editors: editors,
          last_modified: currentDate.getDate(),
          chapters: chapters,
          playCount: 0,
        });

        let json = JSON.stringify(arr);

        fs.writeFile("./classes.json", json, "utf8", function (err) {
          if (err) {
            console.log("Error writing file:", err);
          } else {
            console.log("File written successfully");

            // Read the JSON file again to reset the data in the server
            try {
              let data = fs.readFileSync("./classes.json", "utf8");
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
    console.log("/mycourses fetch");
    return res.status(200).send(courses);
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return res.status(500).send({ error: "Failed to fetch courses." });
  }
});

app.post("/courseplay", async (req, res) => {
  const { courseid } = req.body;

  try {
    const courseIndex = dummydata.findIndex(
      (course) => course.id === parseInt(courseid)
    );

    if (courseIndex !== -1) {
      dummydata[courseIndex].playCount += 1;
      let json = JSON.stringify(dummydata);
      fs.writeFileSync("./classes.json", json, "utf8");
      console.log("File written successfully");

      return res.status(200).send({
        message: "Course play count incremented successfully.",
      });
    } else {
      return res.status(404).send({ error: "Course not found." });
    }
  } catch (error) {
    console.error("Error updating play count: ", error);
    return res
      .status(500)
      .send({ error: "Failed to update play count for the course." });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const courses = dummydata;
    console.log("/courses fetch");
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
    console.log("/courseinfo fetch");

    return res.status(200).send(doc);
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return res.status(500).send({ error: "Failed to fetch course info." });
  }
});

app.post("/newchapter", async (req, res) => {
  const { courseid, name, description } = req.body;

  if (!name) {
    return res.status(400).send({ error: "Please enter a name." });
  }
  const courses = dummydata;
  const doc = courses.find((course) => course.id === parseInt(courseid));

  const new_chapter = {
    name: name,
    description: description,
    sets: [],
  };
  doc.chapters.push(new_chapter);
  let json = JSON.stringify(courses);

  // Write the modified JSON back to the file
  fs.writeFile("./classes.json", json, "utf8", function (err) {
    if (err) {
      console.log("Error writing file:", err);
    } else {
      console.log("File written successfully");
      try {
        let data = fs.readFileSync("./classes.json", "utf8");
        dummydata = JSON.parse(data); // Reset the data in the server
        return res
          .status(200)
          .send({ message: "chapter created successfully." });
      } catch (err) {
        console.log(err);
      }
    }
  });

  console.log(doc);
});

app.post("/newSet", async (req, res) => {
  const { id, index, name, description, cards } = req.body;
  let courseindex = dummydata.findIndex((course) => course.id === Number(id));
  console.log(dummydata[courseindex]);

  const newSet = { name: name, description: description, cards: cards };
  dummydata[courseindex].chapters[index].sets.push(newSet);
  let json = JSON.stringify(dummydata);

  try {
    fs.writeFileSync("./classes.json", json, "utf8");
    console.log("File written successfully");
    let data = fs.readFileSync("./classes.json", "utf8");
    dummydata = JSON.parse(data); // Reset the data in the server
    return res.status(200).send({ message: "set created successfully." });
  } catch (err) {
    console.log("Error writing or reading file:", err);
  }
});

app.post("/editSet", async (req, res) => {
  const { id, index, setindex, name, description, cards } = req.body;
  let courseindex = dummydata.findIndex((course) => course.id === Number(id));
  console.log("/editSet fetch");

  console.log(dummydata[courseindex]);
  const newSet = { name: name, description: description, cards: cards };
  dummydata[courseindex].chapters[index].sets[setindex] = newSet;
  let json = JSON.stringify(dummydata);

  try {
    fs.writeFileSync("./classes.json", json, "utf8");
    console.log("File written successfully");
    let data = fs.readFileSync("./classes.json", "utf8");
    dummydata = JSON.parse(data); // Reset the data in the server
    return res.status(200).send({ message: "set created successfully." });
  } catch (err) {
    console.log("Error writing or reading file:", err);
  }
});

app.post("/deleteSet", async (req, res) => {
  const { id, index, setindex } = req.body;
  let courseindex = dummydata.findIndex((course) => course.id === Number(id));
  console.log("/deleteSet fetch");
  console.log(index);

  dummydata[courseindex].chapters[index].sets.splice(setindex, 1);
  let json = JSON.stringify(dummydata);

  try {
    fs.writeFileSync("./classes.json", json, "utf8");
    console.log("File written successfully");
    let data = fs.readFileSync("./classes.json", "utf8");
    dummydata = JSON.parse(data); // Reset the data in the server
    return res.status(200).send({ message: "set created successfully." });
  } catch (err) {
    console.log("Error writing or reading file:", err);
  }
});

app.post("/editChapter", async (req, res) => {
  const { id, index, name, description, course_tags, chapter_tags } = req.body;
  let courseindex = dummydata.findIndex((course) => course.id === Number(id));
  console.log("/editChapter fetch");

  console.log(description);
  const newChapter = {
    name: name,
    description: description,
    course_tags: course_tags,
    chapter_tags: chapter_tags,
    sets: dummydata[courseindex].chapters[index].sets,
  };

  dummydata[courseindex].chapters[index] = newChapter;
  let json = JSON.stringify(dummydata);

  try {
    fs.writeFileSync("./classes.json", json, "utf8");
    console.log("File written successfully");
    let data = fs.readFileSync("./classes.json", "utf8");
    dummydata = JSON.parse(data); // Reset the data in the server
    return res.status(200).send({ message: "set created successfully." });
  } catch (err) {
    console.log("Error writing or reading file:", err);
  }
});

app.post("/editCourse", async (req, res) => {
  const { id, name, description, course_tags } = req.body;
  let courseindex = dummydata.findIndex((course) => course.id === Number(id));
  console.log("/editCourse fetch");

  dummydata[courseindex].name = name;
  dummydata[courseindex].description = description;

  let json = JSON.stringify(dummydata);

  try {
    fs.writeFileSync("./classes.json", json, "utf8");
    console.log("File written successfully");
    let data = fs.readFileSync("./classes.json", "utf8");
    dummydata = JSON.parse(data); // Reset the data in the server
    return res.status(200).send({ message: "course edited successfully" });
  } catch (err) {
    console.log("Error writing or reading file:", err);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
