const express = require('express');
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require('path');
const db = require("./Develop/db/db.json");
const { v4: uuidv4 } = require('uuid');
const { response } = require('express');

const app = express();
// Middleware 
app.use(express.static('./Develop/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function filterByQuery(query, db) {
    let filteredResults = db;
    //See comments below for origin of queries
    if (query.noteTitle) {
        filteredResults = filteredResults.filter(
            (db) => (db.noteTitle = query.noteTitle)
        );
    }
    if (query.id) {
        filteredResults = filteredResults.filter((db) => (db.id = query.id));
    }
    return filteredResults;
}

app.get('/api/notes', (res, req) => {
    //READ 'db.json' file
    let data = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8'));
    console.log(JSON.stringify(data));
    // Send read data to response of 'get' request
    // req.json(data)
    req.json(data)


})


// API POST REQUEST
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    console.log(JSON.stringify(newNote));

    // assigns a unique ID number to the new note
    newNote.id = uuidv4();

    // reads data from db.json and saves new note
    let data = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8'));
    data.push(newNote);

    fs.writeFileSync('./Develop/db/db.json', JSON.stringify(data));

    res.json(data);
});

// API DELETE REQUEST
app.delete('/api/notes/:id', (req, res) => {
    let noteId = req.params.id.toString();
    console.log(`delete request for noteId: ${noteId}`);
    let data = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8'));
    const newData = data.filter(note => note.id.toString() !== noteId);
    fs.writeFileSync('./Develop/db/db.json', JSON.stringify(newData));
    console.log(`successfully deleted note with id of: ${noteId}`);
    res.json(newData);
});







// creat routes 
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'))
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})