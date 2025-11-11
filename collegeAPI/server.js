const express = require ('express');
const bcrypt = require('bcryptjs');
const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;

const app= express();

app.use(express.json());

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
};

app.use(requestLogger);

const colleges =[
    {id: 1, name: 'Harvard University', location: 'Cambridge, MA'},
    {id: 2, name: 'Stanford University', location: 'Stanford, CA'},
    {id: 3, name: 'MIT', location: 'Cambridge, MA'},
    {id: 4, name: 'Princeton University', location: 'Princeton, NJ'},
    {id: 5, name: 'Yale University', location: 'New Haven, CT'}
]

const users = [];

passport.use(new LocalStrategy(
    function(username, password, done) {
        const user = users.find((user) => user.username === username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
));

app.use(passport.initialize());

const isAuthenticated = passport.authenticate('local', { session: false });



app.post('/register',async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = users.find((user) => user.username === username);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const emailExists = users.find((user) => user.email === email);
        if (emailExists) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = { 
            id: users.length + 1,
            username, 
            email, 
            password: hashedPassword
        };

        users.push(newUser);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the College API');
});

app.get('/colleges', isAuthenticated, (req, res) => {
    res.json(colleges);
});

app.get('/colleges/:id', isAuthenticated, (req, res) => {
    // const collegeId = parseInt(req.params.id);
    // const college = colleges.find(c => c.id === collegeId);
    // if (college) {
    //     res.json(college);
    // } else {
    //     res.status(404).send('College not found');
    // }

    try {
        const college = colleges.find((college) => college.id === parseInt(req.params.id));
        if (!college){
            res.status(404).json({ message: 'College not found' });
        }
        else{
            res.send(college);
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/colleges', isAuthenticated, (req, res) => {
    try {
        const { name, location } = req.body;
        
        const newCollege = {
            id: colleges.length + 1,
            name,
            location
        };
        colleges.push(newCollege);
        res.status(201).json({ message: 'College created successfully', newCollege });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.put('/colleges/:id', isAuthenticated, (req, res) => {
    try {
        const collegeId = parseInt(req.params.id);
        const { name, location } = req.body;
        const college = colleges.find((college) => college.id === collegeId);
        if (!college) {
            res.status(404).json({ message: 'College not found' });
            return;
        }
        else {
            college.name = req.body.name || college.name;
            college.location = req.body.location || college.location;
            res.status(200).json({ message: 'College updated successfully', college });
        } 
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/colleges/:id', isAuthenticated, (req, res) => {
    try {
        const collegeId = parseInt(req.params.id);
        const collegeIndex = colleges.findIndex((college) => college.id === collegeId);
        if (collegeIndex === -1) {
            res.status(404).json({ message: 'College not found' });
            return;
        }
        else {
            colleges.splice(collegeIndex, 1);
            res.status(200).json({ message: 'College deleted successfully' });
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});