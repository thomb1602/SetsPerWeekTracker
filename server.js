console.log("SocketServer running");

// start with express
var express = require('express'); // these variables are function calls
const bodyParser = require('body-parser');
const fs = require('fs').promises;

var app = express();
var server = app.listen(3000);

app.use(express.static('public')); 
app.use(bodyParser.json());

app.post('/saveWorkoutData', async (req, res) => {
    const { filename, data } = req.body;
    console.log("/saveWorkoutData POST call received.")
    console.log(`filename: '${filename}'`)
    try {
        // Check if the file exists
        await fs.access(`public/stats/${filename}`);
        
        // File exists, append data
        await fs.appendFile(`public/stats/${filename}`, `${data}\n`);
        res.status(200).send('Data appended to existing file.');
    } catch {
        // File doesn't exist, create a new file
        console.log(`File '${filename}' doesn't exist, creating...`)
        await fs.writeFile(`public/stats/${filename}`, "Date,ExerciseId,NumberOfSets\n");
        await fs.appendFile(`public/stats/${filename}`, `${data}\n`);
        console.log("Created file")
        // save file to index
        await fs.appendFile("public/stats/index.txt", `${filename}\n`)
        res.status(201).send('New file created.');
    }
});

// serve favicon
// var favicon = require('serve-favicon');
// const path = require('path');
// app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
 
// setup socket
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);
function newConnection(socket)
{
    console.log('new connection: ' + socket.id);
}

