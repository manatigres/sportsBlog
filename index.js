// load required packages
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const app = express()
const host = '0.0.0.0';
const API_PORT = process.env.PORT || 22650;
const bcrypt = require('bcrypt-nodejs')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const uuid = require('uuid');
const expressBasicAuth = require('express-basic-auth');

//set variables
//const url = `mongodb://${config.username}:${config.password}@${config.url}:${config.port}/${config.database}?authSource=admin`;
//const client = new MongoClient(url, { useUnifiedTopology: true });
const uri = "mongodb+srv://kds4:Mongo123@cluster0.oficb.mongodb.net/PRACTICAL-3?retryWrites=true&w=majority";
client =  new MongoClient(uri, {useUnifiedTopology: true})
let user_collection = null; //we will give this a value after we connect to the database
let groups = null;
let events = null;
let games = null;
let newsletter = null;
let group_user = null;
let game_user = null;
let event_user = null;
let admin = null;



const initializePassport = require('./configs/passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

let users = []

app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) //optional but useful for url encoded data
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

var myMongoAuthoriser = async function(username, password, callback) {
    return admin.findOne({_id: username, password: password })
    .then(user => {
        if ( user != null ) { console.log(username + " logged in"); return callback(null, true); }
        else { console.log(username + " invalid credentials");  return callback(null, false); }
    })
    .catch(err => { console.log("error logging in", err ); return callback(null, false)})
}

//register the valid username, password pairs with the express-basic-auth object
var authorise = expressBasicAuth({
    authorizer: myMongoAuthoriser,
    authorizeAsync: true,
	unauthorizedResponse: (req) => ((req.auth)? 'Credentials  rejected' : 'No credentials provided'),
	challenge: true	//make the browser ask for credentials if none/wrong are provided
})

// Router for the homepage
app.get('/', checkAuthenticated, (req, res) => {
    res.render('client.html', { name: req.user.name, email: req.user.email })
})

// Router for the login page
app.get('/login', checkNotAuthenticated, (req, res) => {
    user_collection.find({}).toArray()
        .then(docs => {
            users = docs
        })
    res.render('login.html')
})

// Post inforamtion to the server and check authentication
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// Router for register page
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.html', { error: "1" })
})

// Post information to the server and regist the user
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        if (users.find(user => user.email === req.body.email)) {
            console.log("Email already taken")
            res.render('register.html', { error: "Email already taken" })
            return
        }
        if (req.body.newsletter === "true") {
            newsletter.insertOne({
                email: req.body.email
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        user_collection.insertOne({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        console.log("error")
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.render('firstPage.html')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

//Redirect to create group page
app.get('/derictGroup', (req, res) => {
    res.render('createGroup.html');
})

//Redirect to profile
app.get('/profile', (req, res) => {
    res.render('profile.html');
})

//Redirect to profile
app.get('/admin', authorise,function (req, res, next) {
    res.render('admin.html');
})

//Get news from newsapi
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('568f5052d1dd43a2839a5fa0dffd7e0f');

newsapi.v2.everything({
    q: 'sport',
    sources: 'bbc-news',
    domains: 'bbc.co.uk',
    language: 'en',
    page: 1
}).then(response => {
    app.get('/news', function (req, res) {
        console.log("Send news");
        res.send(response);
    })
});

//api from lastest Event information on home page
app.get('/newEvent', function (req, res) {
    console.log("Print new event");
    res.send(testingData.tempEvent);
})

//api from lastest Game information on home page
app.get('/newGame', function (req, res) {
    console.log("Print new game");
    res.send(testingData.tempGame);
})

// api for the creation page (group)
app.get('/groups/create', function (req, res) {
    console.log("Create a group you want")
    res.render('createGroup.html');
})

// api for creating the page
app.post('/groups/create',function(req,res){
    console.log(req.body);
    let name = req.body.name;
    let tags = req.body.tags;
    let description = req.body.description;
    groups.findOne({ name: name }, { projection: { _id: 1, name: "$name", description: 1, tags: 1 } })
        .then(group => {//Check if the game has already existed in the database
            if (group != null) res.status(404).send("Group name already exists.");
            else {
                groupId = uuid.v1();
                groups.insertOne({ _id: groupId, name: name, description: description, tags: tags })
                    .then(gop => {
                        console.log("Successfully insert with ID", gop.insertedId);
                        res.status(200).send(`Create group${name}`);
                    })
            }
        })
        .catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name == 'MongoError' || err.code == 11000) {
                res.status(400).send(`Cannot add ${name}. Group already exists.`);
            }
            else {
                console.log(`Cannot add ${name}. Unknown Error.`);
                res.status(400).send(`Cannot add ${name}. Unknown Error.`);
            }
        })
})

// api for find all groups information
app.get('/groups/all', function (req, res, next) {
    groups.find({}).toArray()
        .then(group => {
            res.status(200).json(group);
        })
        .catch(err => {
            res.status(400).send("Could not get group information", err.message);
        })
})

// api for find all the users information with respect to group
app.get('/groups/:groupname/users', function (req, res, next) {
    let groupname = req.params.groupname;
    group_user.find({ group: groupname }).toArray()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})

// api to find a user in groups -k
app.get('/groups/find/:userID', function (req, res, next) {
    let userID = req.params.userID;
    group_user.find({ userID: userID }).toArray()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})

// api for displaying group info and their members -k
app.get('/groups/:groupname', function (req, res, next) {
    let groupname = req.params.groupname;
    groups.findOne({ name: groupname })
        .then(group => {

            console.log(group)
            res.render('viewGroup.html', { group: group.name })
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})

// api for getting group description -k
app.get('/groups/description/:groupname', function (req, res, next) {
    let groupname = req.params.groupname;
    groups.findOne({ name: groupname })
        .then(group => {
            res.status(200).json(group)
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})

// api for getting group tags -k
app.get('/groups/tags/:groupname', function (req, res, next) {
    let groupname = req.params.groupname;
    groups.findOne({ name: groupname })
        .then(group => {
            res.status(200).json(group)
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})


// api for sign to a group:Require the email that the user used to register
app.post('/groups/:groupname/users/:userID', function (req, res) {
    let groupname = req.params.groupname;
    let userID = req.params.userID;
    console.log({ groupname: groupname, userID: userID })
    group_user.findOne({ userID: userID, group: groupname })
        .then(guser => {// Check if the user has already signed to this group
            if (guser != null) res.status(404).send("You have signed to this group");
            else {
                recordID = uuid.v1();
                console.log(recordID);
                group_user.insertOne({ _id: recordID, userID: userID, group: groupname })
                    .then(uop => {
                        console.log("Successfully insert with ID", uop.insertedId);
                        console.log(`User ${userID} has successfully join to group ${groupname}`);
                        res.status(200).send(`Successfully join to group ${groupname}`)

                    })
            }
        }).catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name == 'MongoError' || err.code == 11000) {
                res.status(400).send(`Cannot add ${groupname}. Record already exists.`);
            }
            else {
                console.log(`Cannot add ${groupname}. Unknown Error.`);
                res.status(400).send(`Cannot add ${groupname}. Unknown Error.`);
            }
        })
})


// api for sign to a group:Require the email that the user used to register
app.post('/groups/delete/:groupname/users/:userID', function (req, res) {
    let groupname = req.params.groupname;
    let userID = req.params.userID;
    group_user.deleteOne({userID: userID, group: groupname})
    .then(res => console.log("deleted user", res.deletedCount))
    .catch(err => {
            console.log("Could not delete one ", err.message);
        })
})





// api for the creation page (events)
app.get('/events/create', function (req, res) {
    console.log("Create an event you want")
    res.render('createEvent.html');
})

// api for creating the events
app.post('/events/create', function (req, res) {
    let name = req.body.name;
    let time = req.body.time;
    let location = req.body.location;
    events.findOne({ name: name }, { projection: { _id: 1, name: "$name", location: 1, time: 1 } })
        .then(event => {// Check if the event has already existed in the database
            if (event != null) res.status(404).send("Event name already exists.");
            else {
                eventId = uuid.v1();
                events.insertOne({ _id: eventId, name: name, location: location, time: time })
                    .then(gop => {
                        console.log("Successfully insert with ID", gop.insertedId);
                        res.status(200).send(`Create game${name}`);
                    })
            }
        })
        .catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name == 'MongoError' || err.code == 11000) {
                res.status(400).send(`Cannot add ${name}. Group already exists.`);
            }
            else {
                console.log(`Cannot add ${name}. Unknown Error.`);
                res.status(400).send(`Cannot add ${name}. Unknown Error.`);
            }
        })
})

// api for find all events information
app.get('/events/all', function (req, res, next) {
    events.find({}).toArray()
        .then(event => {
            res.status(200).json(event);
        })
        .catch(err => {
            res.status(400).send("Could not get game information", err.message);
        })
})

// api for sign to a event:Require the email that the user used to register
app.post('/events/:eventsname/users/:userID', function (req, res) {
    let eventname = req.params.eventsname;
    let userID = req.params.userID;
    console.log({ eventname: eventname, userID: userID })
    event_user.findOne({ userID: userID, event: eventname })
        .then(euser => {// Check if the user has already joined this event
            if (euser != null) res.status(404).send("You have signed to this event");
            else {
                recordID = uuid.v1();
                console.log(recordID);
                event_user.insertOne({ _id: recordID, userID: userID, event: eventname })
                    .then(uop => {
                        console.log("Successfully insert with ID", uop.insertedId);
                        console.log(`User ${userID} has successfully join to event ${eventname}`);
                        res.status(200).send(`Successfully join the event: ${eventname}`)

                    })
            }
        }).catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name == 'MongoError' || err.code == 11000) {
                res.status(400).send(`Cannot add ${eventname}. Record already exists.`);
            }
            else {
                console.log(`Cannot add ${eventname}. Unknown Error.`);
                res.status(400).send(`Cannot add ${eventname}. Unknown Error.`);
            }
        })
})

// api for find all the users information with respect to events
app.get('/events/:eventname/users', function (req, res, next) {
    let eventname = req.params.eventname;
    event_user.find({ eventgame: eventname }).toArray()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})


// api to find a user in events -k
app.get('/events/find/:userID', function (req, res, next) {
    let userID = req.params.userID;
    event_user.find({ userID: userID }).toArray()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})


// api for the creation page (games)
app.get('/games/create', function (req, res) {
    console.log("Create a game you want")
    res.render('createGame.html');
})

// api for create the game
app.post('/games/create', function (req, res) {
    let name = req.body.name;
    let time = req.body.time;
    let location = req.body.location;
    games.findOne({ name: name }, { projection: { _id: 1, name: "$name", location: 1, time: 1 } })
        .then(game => {// Check if the game has already existed in the database
            if (game != null) res.status(404).send("Game name already exists.");
            else {
                gameId = uuid.v1();
                games.insertOne({ _id: gameId, name: name, location: location, time: time })
                    .then(gop => {
                        console.log("Successfully insert with ID", gop.insertedId);
                        res.status(200).send(`Create game${name}`);
                    })
            }
        })
        .catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name == 'MongoError' || err.code == 11000) {
                res.status(400).send(`Cannot add ${name}. Game already exists.`);
            }
            else {
                console.log(`Cannot add ${name}. Unknown Error.`);
                res.status(400).send(`Cannot add ${name}. Unknown Error.`);
            }
        })
})

// api for find all games information
app.get('/games/all', function (req, res, next) {
    games.find({}).toArray()
        .then(group => {
            res.status(200).json(group);
        })
        .catch(err => {
            res.status(400).send("Could not get group information", err.message);
        })
})

// api for sign to a game:Require the email that the user used to register
app.post('/games/:gamename/users/:userID', function (req, res) {
    let gamename = req.params.gamename;
    let userID = req.params.userID;
    console.log({ gamename: gamename, userID: userID })
    game_user.findOne({ userID: userID, game: gamename })
        .then(guser => {// Check if the user has already join to this game
            if (guser != null) res.status(404).send("You have signed to this game");
            else {
                recordID = uuid.v1();
                console.log(recordID);
                game_user.insertOne({ _id: recordID, userID: userID, game: gamename })
                    .then(uop => {
                        console.log("Successfully insert with ID", uop.insertedId);
                        console.log(`User ${userID} has successfully join to game ${gamename}`);
                        res.status(200).send(`Successfully join the game ${gamename}`)

                    })
            }
        }).catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name == 'MongoError' || err.code == 11000) {
                res.status(400).send(`Cannot add ${gamename}. Record already exists.`);
            }
            else {
                console.log(`Cannot add ${gamename}. Unknown Error.`);
                res.status(400).send(`Cannot add ${gamename}. Unknown Error.`);
            }
        })
})


// api for find all the users information with respect to games
app.get('/games/:gamename/users', function (req, res, next) {
    let gamename = req.params.gamename;
    game_user.find({ gamename: gamename }).toArray()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})

// api to find a user in games -k
app.get('/games/find/:userID', function (req, res, next) {
    let userID = req.params.userID;
    game_user.find({ userID: userID }).toArray()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})



// get all user records -k
app.get('/users/all', function (req, res) {
    user_collection.find({}).toArray()
        .then(records => {
            res.status(200).json(records);
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})


// api for getting user info -k
app.get('/users/:userID', function (req, res) {
    let userID = req.params.userID;
    user_collection.findOne({ email: userID, })
        .then(user => {
            res.json({ name: user.name })

        })
        .catch(err => {
            console.log("Could not find ", userID, err.message);
        })
})

// api for getting users info: which groups/games/events have joined
app.get('/users/:userID/groups', function (req, res) {
    let userID = req.params.userID;
    group_user.find({ userID: userID }).toArray()
        .then(records => {
            console.log(records);
            res.json(records);
        })
        .catch(err => {
            console.log("Could not find ", userID, err.message);
        })
})

// api for getting users info: which groups/games/events have joined
app.get('/users/:userID/games', function (req, res) {
    let userID = req.params.userID;
    game_user.find({ userID: userID }).toArray()
        .then(records => {
            console.log(records);
            res.json(records);
        })
        .catch(err => {
            console.log("Could not find ", userID, err.message);
        })
})

// api for getting users info: which groups/games/events have joined
app.get('/users/:userID/events', function (req, res) {
    let userID = req.params.userID;
    event_user.find({ userID: userID }).toArray()
        .then(records => {
            console.log(records);
            res.json(records);
        })
        .catch(err => {
            console.log("Could not find ", userID, err.message);
        })
})


// api for users to post comments
app.post('/comments/users/:username/groups/:groupname', function (req, res) {
    let groupname = req.params.groupname;
    let username = req.params.username;
    let postTime = req.body.time;
    let message = req.body.message;
    comments.insertOne({ username: username, message: message, group: groupname, time: postTime })
        .then(comment => {
            console.log("Successfully insert with ID", comment.insertedId);
            res.status(200).send("Post Comments");
        })
        .catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name == 'MongoError' || err.code == 11000) {
                res.status(400).send(`Cannot add ${username}.`);
            }
            else {
                console.log(`Cannot add ${username}. Unknown Error.`);
                res.status(400).send(`Cannot add ${username}. Unknown Error.`);
            }
        })
})

// api for fetch comments information
app.get('/comments/groups/:groupname', function (req, res, next) {
    let groupname = req.params.groupname;
    comments.find({ group: groupname }).toArray()
        .then(comment => {
            console.log(comment);
            res.json(comment);
        })
        .catch(err => {
            res.status(400).send("Could not get group information", err.message);
        })
})

// api for displaying the individual profile -k
app.get('/profile/:userID', function (req, res, next) {
    let userID = req.params.userID;
    user_collection.findOne({ email: userID })
        .then(user => {
            res.render('viewProfile.html', { email: user.email, name: user.name })
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})

//api for displaying the admin summary
app.get('/admin/:userId/summary', authorise,function (req, res, next) {

    res.status(200).render('admin.html');
    res.end();
})




// api test to see collections data -k
app.get('/content', function (req, res, next) {
    group_user.find({}).toArray()
        .then(users => {
            console.log(users)
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})

// api test to get username based on email -k
app.get('/username/:userID', function (req, res, next) {
    let userID = req.params.userID;
    user_collection.findOne({email: userID})
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send("Could not get user information", err.message);
        })
})

client.connect()
    .then(conn => {
        // connect to the database
        user_collection = client.db("PRACTICAL-3").collection("users");
        groups = client.db("PRACTICAL-3").collection("groups");
        events = client.db("PRACTICAL-3").collection("events");
        games = client.db("PRACTICAL-3").collection("games");
        newsletter = client.db("PRACTICAL-3").collection("newsletter");
        game_user = client.db("PRACTICAL-3").collection("game_user");
        event_user = client.db("PRACTICAL-3").collection("event_user");
        group_user = client.db("PRACTICAL-3").collection("group_user");
        comments = client.db("PRACTICAL-3").collection("comments");
        admin = client.db("PRACTICAL-3").collection("admin");
        console.log("Connected!", conn.s.url.replace(/:([^:@]{1,})@/, ':****@'))
    })
    .catch(err => { console.log(`Could not connect to ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err); throw err; })
    // tell the server to listen on the given port and log a message to the console
    .then(() => app.listen(API_PORT, host, () => console.log(`Listening on localhost: ${API_PORT}`)))
    .catch(err => console.log(`Could not start server`, err))

