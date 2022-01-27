'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User } = require('./models');
const Course = require('./models').Course;
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();





// Route GET route that will return all properties and values for the currently authenticated User along 
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    password: user.password,
});
}));


// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// /api/courses GET works

router.get('/courses',  asyncHandler(async (req, res) => {
  let courses = await Course.findAll();
  res.json(courses);
}));

// /api/courses/:id GET works

router.get('/courses/:id', authenticateUser, asyncHandler(async (req, res)=>{
  //console.log()
  const course = await Course.findByPk(req.params.id);

  if(course ){
      res.json(course );
  } else {
      res.status(404).json({message: "course  not found."});
  }
}));


//  /api/courses POST works
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    await Course.create(req.body);
    res.status(201).json({ "message": "Course successfully created!" });
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));


// /api/courses/:id PUT  needs to be checked 

router.put('/courses/:id', authenticateUser, asyncHandler(async(req,res) => {
  const course = await Course.findByPk(req.params.id);
  if(course){
    course.title = req.body.title; 
    course.description = req.body.description;
    course.estimatedTime = req.body.estimatedTime; 
    course.materialsNeeded = req.body.materialsNeeded;
    course.id= req.body.id; 
    try {
      await course.save();  //maybe create and save 
      res.status(201).json({ "message": "Course successfully updated!" });
    } catch (error) {
      console.log('ERROR: ', error.name);
  
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }  
      res.status(204).end();
  } else {
      res.status(404).json({message: "Course Not Found"});
  }
}));

//  /api/courses/:id DELETE works!

router.delete("/courses/:id", authenticateUser, asyncHandler(async(req,res, next) => {
  const course = await Course.findByPk(req.params.id);
  await course.destroy();
  res.status(204).end();
}));


module.exports = router;