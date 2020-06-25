const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const PORT = process.env.PORT || 3000;

const db = require('./models');
const { Workout } = require('./models');

// use if putting routes in separate folder
// require('./routes/api-routes')(app);
// require('./routes/html-routes')(app);

const app = express();

app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://egrenegar:workouttracker1@ds051788.mlab.com:51788/heroku_43f9ck1n', { useNewUrlParser: true });

//==========API ROUTES===========//
app.get('/api/workouts', (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post('/api/workouts', (req, res) => {
  const workout = new Workout(req.body);
  db.Workout.create(workout)
  .then(Workout => {
    res.json(Workout);
  })
  .catch(err => {
    res.json(err);
  });
})

app.put("/api/workouts/:id", ({body}, res) => {
  db.Workout.create(body)
    .then(({_id}) => db.Workout.findOneAndUpdate({}, { $push: { exercises: _id } }, { new: true }))
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/api/workouts/range', (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

//=========== HTML ROUTES ===========//
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname, './public/exercise.html'));
});

app.get('/stats', (req, res)=> {
  res.sendFile(path.join(__dirname, './public/stats.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});