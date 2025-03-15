// The dotenv library is used to load the environment variables from the .env file
// into the process.env object. This is useful for hiding sensitive information
// such as API keys and database connection strings.
require('dotenv').config();

const express = require('express'); // import the express module
const bodyParser = require('body-parser');

const templateRoutes = require('./routes/template');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const userResumeRoutes = require('./routes/userResume');
const userInfoRoutes = require('./routes/userInfo');


require('./config/db');

const app = express(); // create a new express app
const cors = require('cors');

// middleware
app.use(express.json())
app.use(cors());

app.use(bodyParser.json());


app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// Set up a route for handling requests to the resumes API
app.use('/api/templates', templateRoutes);

//set up a route for admin dashboard
app.use('/api/admin', adminRoutes);

//set up a route for user 
app.use('/api/user', userRoutes);

//set up a route for user resumes
app.use('/api/resume', userResumeRoutes);

//set up a route for user info
app.use('/api/info', userInfoRoutes);

app.listen(process.env.PORT, () => { // start the server and listen on the specified port
  console.log(`Server started on port`, process.env.PORT); // log a message to the console indicating that the server has started
});
