const startDebugger = require('debug')('app:startup')
const config = require('config')
const helmet = require('helmet')
const morgan = require('morgan')
const Joi = require('joi');
const express = require('express');
const logger = require('./middleware/logger')
const courses = require('./routes/courses')
const home = require('./routes/home')
const authenticate = require('./authenticate')

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json())
app.use('/api/course', courses);
app.use('/', home);

// use of express.urlencoded() only is deprecated in this version of express
// see https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
// for more clientInformation.

app.use(express.urlencoded({ extended: true }))
//middleware for serving static files
app.use(express.static('public'));
app.use(authenticate);
app.use(logger);

// loading helmet third party middleware which is for sercure http

app.use(helmet());


//dealing with configuration file from the module config
startDebugger('Application Name :' + config.get('name'))
startDebugger('Mail Server:' + config.get('mail.host'))
//console.log('Mail Password :' + config.get('mail.password'))

// loading morgan third party middleware which is for logging requests
// the param tiny show few details about the request see other params in doc

if (app.get('env')==='development') {
    app.use(morgan('tiny'));
    startDebugger('morgan enabled')
}





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