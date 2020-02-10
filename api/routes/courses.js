import express from 'express';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';
import multer from 'multer';
import Courses from "../models/courses";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img-uploads')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname); 
    }
});
const imgUploads = multer({storage: storage});

// const imgUploads = multer({ dest: 'img-uploads/' });
// const courses = [
//     {id:1, name: 'csc100'},
//     {id:2, name: 'csc101'},
//     {id:3, name: 'csc102'},
// ]



// get all courses
router.get('/all', (req, res, next) => {
    Courses.find()
        // .select('_id name code')
        .exec()
        .then(doc => {
            // console.log(doc);
            const results = {
                count: doc.length,
                myCourses: doc.map(ppty => {
                    return{
                        name: ppty.name,
                        code: ppty.code,
                        quoteImage: ppty.quoteImage,
                        _id: ppty._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/courses/' + ppty._id
                        }
                    }
                })
            }
            res.status(200).json(results);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});

// add a course
router.post('/', imgUploads.single('quoteImage'), (req, res, next) => {
    console.log(req.file)
    const newCourse = new Courses({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        code: req.body.code,
        quoteImage: req.file.path
    });
    newCourse
        .save()
        .then(result => {
            // console.log(result);
            res.status(201).json({
                status: 'course created successfully',
                courses: {
                    name: result.name,
                    code: result.code,
                    quoteImage: result.quoteImage,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/courses/' + result._id
                    }
                }
            });    
        })
        .catch(err => {
            console.log(err); 
            res.status(500).json(err);    
        });
    
});

// Get a particular course
router.get('/:id', (req, res, next) => {
    const courseId = req.params.id;
    Courses.findById(courseId)
        .select('name code _id quoteImage')
        .exec()
        .then(doc => {
            // console.log(doc);
            if (doc) {
                res.status(200).json({
                    courseAdded: doc,
                    request: {
                        type: 'GET',
                        url: 'http://local:3000/courses/' + doc._id
                    }
                });
            }
            else{
                res.status(404).json({errorMessage: "No entry found for the ID"});
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
})

// update the courses
router.put('/:id', (req, res, next) => {
    // check if course exist 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) 
    {
       res.status(404).send('Course not found');
    }
    else
    {
        // Validate course
        const {error} = validateCourse(req.body);
        if (error) {
           res.status(400).send(error.details[0].message);
        }
        else{
            // Update courses 
            course.name = req.body.name;
            res.send(course);
        } 
    }
});

// Delete a course 
router.delete('/:id', (req, res, next) => {
    const deletecourse = req.params.id;
   Courses.deleteMany({_id: deletecourse})
    .exec() 
    .then(result => {
        // console.log(result);
        res.status(200).json({
             message: 'Course deleted successfully',
             request: {
                 type: 'POST',
                 url: 'http://localhost:3000/courses/',
                 body:{
                     name: 'String',
                     code: 'Number'
                 }
             }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



// Validate course function to be reused 
// the function call returns 2 values error and value 
// we use object destructuring to get only the error message 
// hence replace result.error with {error}  
function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(6).required()
    });

   return schema.validate(course, {abortEarly: false});
}


export default router;