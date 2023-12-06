# CruzCards
## Table of Contents
1. [General Information](https://github.com/sabrinafogel/CruzCards/blob/main/README.md#general-information)
2. [Inspiration](https://github.com/sabrinafogel/CruzCards/blob/main/README.md#inspiration)
3. [How to Run CruzCards](https://github.com/sabrinafogel/CruzCards/blob/main/README.md#how-to-run-cruzcards)
4. [How to Use CruzCards](https://github.com/sabrinafogel/CruzCards/blob/main/README.md#how-to-use-cruzcards)\
  4.1. [General Design and Log-In/Sign-Up](https://github.com/sabrinafogel/CruzCards/blob/main/README.md#general-design-and-log-insign-up)\
  4.2. [Courses vs. Chapters vs. Sets](https://github.com/sabrinafogel/CruzCards/blob/main/README.md#courses-vs-chapters-vs-sets)

## General Information
<ins>Class:</ins> CSE 115A, Fall 2023, UCSC \
<ins>Professor:</ins> Professor R. Jullig \
<ins>TA:</ins> Roy Shadmon \
<ins>Team Members:</ins> \
Sabrina Fogel (Product Owner)\
Noble Foley \
Teresa Joseph \
Ryan Nelson \
Mitchell Tansey

## Inspiration
Many students, both at the high school and university level, use some form of flashcard system to help them study for classes and exams. This method of studying, although effective, can be tedious or clunky; often times, physical flashcards take a long time to make and can easily get lost or damaged. Some online flashcard services exist, but they often put useful features (for example, flashcard games) behind paywalls.\
CruzCards aims to combat these issues to provide a free, intuitive flashcard service made by and for students, particularly dedicated to UCSC students.

## How to Run CruzCards
To run CruzCards, navigate to the `frontend\flashcards` directory and run `npm start`. Additionally, navigate to the `backend` directory and run `node src/server.js`. This runs CruzCards in the development mode. You can open [http://localhost:3000](http://localhost:3000) to view CruzCards in your browser.\
In order to run `npm start`, you must have Node.js and npm installed on your computer.

## How to Use CruzCards
### General Design and Log-In/Sign-Up
The CruzCards website consists of several interlocking webpages. These webpages can all be viewed on [CruzCard's Figma Page](https://www.figma.com/file/grfde2xX7sgQS6c5Q4uPTy/CSE-115A-CruzCards?type=design&node-id=796269-448&mode=design&t=QOh0fLt0nvj1LUST-0). Initially, the CruzCards website will prompt a user to Log-In or Sign-Up in order to access the rest of the website. The user will then be taken to the CruzCards homepage, which consists of all of a user's classes.

### Courses vs. Chapters vs. Sets
CruzCards uses three different general structures to organize flashcard data. \
\
**Courses** correspond to the real courses that a user is taking. A user can have any number of courses, and they are the highest level of organization within the CruzCards website. Courses can be given tags, to help with labeling and recognizing within the CruzCards database system.\
**Chapters** correspond to the chapters/sections within any given course. A user can create any number of chapters in a given course, or they can choose to have just one "chapter" that contains all of the course's information. Chapters are associated with coureses and, upon creation, are auto-populated with the correct course tag. Chapters can also be given tags, to help with labeling and recognizing within the CruzCards database system.\
**Sets** are the actual flashcard sets that a user can create. A user can create any number of sets within a given chapter. Sets can be made up of any number of flashcards, each with a front and a back.

## Scrum Documents
https://drive.google.com/drive/folders/1FAJe83GM1FTf3Ky96upeRWSxDjAcVICm?usp=sharing
