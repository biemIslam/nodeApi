import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './api/routes/courses';


mongoose.connect(
    'mongodb+srv://node-DB:' + 
    process.env.MONGO_ATLAS_PW + 
    '@nodeapi-react-gsrlw.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

// import quotes from './database/db';
// Set up the express app


const courseList = router;

// app.use(express.json());
// Parse incoming requests data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(router);

app.use('/courses', courseList);

// export default app;
export default app;

// app.get('/', (req, res) => {
    // res.send('Hello world')
//   res.status(200).send({
//     success: 'true',
//     message: 'Quotes retrieved successfully',
//     quotes_db: quotes
//   })
// });




