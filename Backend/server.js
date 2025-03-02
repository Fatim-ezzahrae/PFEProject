// The dotenv library is used to load the environment variables from the .env file
// into the process.env object. This is useful for hiding sensitive information
// such as API keys and database connection strings.
require('dotenv').config();

const express = require('express'); // import the express module

const resumeRoutes = require('./routes/resume');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

require('./config/db');

const app = express(); // create a new express app

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// Set up a route for handling requests to the resumes API
app.use('/api/resumes', resumeRoutes);

//set up a route for admin dashboard
app.use('/api/admin', adminRoutes);

//set up a route for user 
app.use('/api/user', userRoutes);

app.listen(process.env.PORT, () => { // start the server and listen on the specified port
  console.log(`Server started on port`, process.env.PORT); // log a message to the console indicating that the server has started
});
