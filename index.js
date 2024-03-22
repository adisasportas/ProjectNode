const express = require('express');
const db = require('./db');
const app = express();
const port = 5001;

// Connect to the database
db.connect();

// Middleware to parse JSON bodies
app.use(express.json());


app.get('/ping', (req, res) => {
    console.log('I got ping!');
    res.send('Pong!');
});

// User routes
app.use('/users', require('./routes/usersRoutes'));

// Task routes
app.use('/tasks', require('./routes/Taskroutes')); 

// Category routes
app.use('/categories', require('./routes/CategoriesRoutes')); 
// Listen on the configured port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});