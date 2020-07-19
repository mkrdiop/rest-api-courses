const Joi = require('joi');
const express = require('express');
const app = express();
const logger = require('./logger')
const authenticate = require('./authenticate')



app.use(express.json())

// use of express.urlencoded() only is deprecated in this version of express
// see https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
// for more clientInformation.

app.use(express.urlencoded({ extended: true }))
//middleware for serving static files
app.use(express.static('public'));
app.use(authenticate);
app.use(logger);

const courses = [
    {id:1, name:'course 1'},
    {id:2, name:'course 2'},
    {id:3, name:'course 3'}
]



app.get('/', (req, res) =>{
    res.send("hello world")
});


app.get('/api/courses', (req, res) =>{
    res.send(courses)
});

app.get('/api/course/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('the courser with the given id not found');
   
    res.send(course);
    
});

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
    
});

app.put('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('the course is not found');

    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    
    
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('the course is not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1)
    res.send(course);

    
});
function validateCourse(course){
//     const schema = {
//         name: Joi.string().min(3).required()
//     };
    
//     result = schema.validate(course)
//    // result = Joi.validate(course, schema);
//     //console.log(result);
//     return result

    const schema = Joi.object({ name: Joi.string().min(3).required()
         });
        
    const validation = schema.validate(course);
    return validation
    

}



//PORT
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listining on port ${port}....`))