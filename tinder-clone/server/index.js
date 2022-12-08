import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import env from 'dotenv'
import { Server } from 'socket.io'
import { createServer } from 'http'


const app = express();
env.config();

app.use(cors()) //allowing API access from cross origin
app.use(express.json())  //allow to get data from the request body for the post request in json format

const server = createServer(app);

const io = new Server(server, {
    cors: {
        methods: ['POST', 'PUT', 'GET'],
        origin: 'http://localhost:3000'
    }
});


// io.on('connection', (socket) => {
//     console.log('user is connected ', socket.id);

//     socket.on('joinRoom', (data) => {
//         const { user_id, first_name, firstName } = data
//         socket.join(user_id);
//         console.log(`joined ${user_id} room with ${first_name} with ${firstName}`);
//     })

//     socket.on('sendText', data => {
//         console.log('datatatat, ',data)
//     })
//     socket.on('disconnect', () => {
//         console.log('user is disconnected', socket.id);
//     })
// })
// server.listen(3000);
const PORT = 8001;
const MONGO_CONNECTION_URL = process.env.URI

server.listen(PORT, () => {
    console.log('server is listening to the port ', PORT);
})

// creating an enpoints

app.get('/', (req, res) => {
    res.send("hello world")
})


// creating endpoints where needs to be connected to MONGO database

app.get('/users', async (req, res) => {

    const databaseClient = new MongoClient(MONGO_CONNECTION_URL);

    try {
         await databaseClient.connect();
        const database = databaseClient.db('app-data');
        const userCollection = database.collection('users');

        const users = await userCollection.find().toArray();
        return res.status(200).send(users)
    } catch (e) {
        //nothing to do as error occured in the connection
    } finally {
        await databaseClient.close();
    }
})

// creating endpoint for database creating a new user if not exist 

app.post('/register', async (req, resp) => {
    const email = req.body.email;
    const password = req.body.password

    const generatedUserId = v4();

    const databaseClient = new MongoClient(MONGO_CONNECTION_URL);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await databaseClient.connect();
        const database = databaseClient.db('app-data');
        const userCollection = database.collection('users');
        const existingUser = await userCollection.findOne({ email })

        if (existingUser) {
            return resp.status(409).send('User is already existing')
        }

        const sanitizedEmail = email.toString().toLowerCase();
        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword,
        }

        const insertedUser = await userCollection.insertOne(data);

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 24 * 60,
        });

        return resp.status(201).send({
            token,
            userId: generatedUserId,
            email: sanitizedEmail
        })

    } catch (e) {
        console.log("error occured ", e);
    } finally {
        await databaseClient.close();
    }
})


// login user

app.post('/login', async (req, res) => {
    const databaseClient = new MongoClient(MONGO_CONNECTION_URL);
    const { email, password } = req.body

    try {
        await databaseClient.connect();
        const database = databaseClient.db('app-data');
        const userCollection = database.collection('users');

        const existingUser = await userCollection.findOne({ email })
        if (!existingUser) {
            return res.status(400).send("user not exist please sign up")
        }
        const matchedPassword = password && await bcrypt.compare(password, existingUser.hashed_password);

        if (!matchedPassword) {
            return res.status(400).send('incorrect password')
        }

        const token = jwt.sign(existingUser, email, {
            expiresIn: 24 * 60,
        })

        return res.status(201).send({
            token,
            userId: existingUser.user_id,
            email: existingUser.email
        })

    } catch (e) {
        res.status(405).send('Internal Error')
    }

    finally {
        databaseClient.close()
    }
})


// ----update the existing user

app.put('/update', async (req, resp) => {
    const { user_id, first_name, dob_day, dob_month, dob_year, show_gender, gender_identity, gender_interest, email, url, about, matches } = req.body;

    const mongoClient = new MongoClient(MONGO_CONNECTION_URL);

    try {
        await mongoClient.connect();
        const database = mongoClient.db('app-data')
        const userCollection = database.collection('users');

        const updateData = {
            $set: {
                user_id, first_name, dob_day, dob_month, dob_year, show_gender, gender_identity, gender_interest, email, url, about, matches
            }
        }

        const updatedStatus = await userCollection.updateOne({ user_id }, updateData);

        return resp.status(201).send(updatedStatus)

    } catch (e) {
        resp.status(405).send("Internal server error occured while processing")
    } finally {
        mongoClient.close();
    }
})

// ===for dashboard

app.get('/user', async (req, res) => {
    const userId = req.query.userId;
    const mongoClient = new MongoClient(MONGO_CONNECTION_URL);
    try {
        await mongoClient.connect()
        const database = mongoClient.db('app-data')
        const userCollection = database.collection('users');
        const currentUser = await userCollection.findOne({ user_id: userId })
        return res.status(201).send(currentUser);
    } catch (e) {
        res.status(405).send("Internal server error occured")
    } finally {
        await mongoClient.close();
    }
})

//endpoint for getting the user of interested gender

app.get('/genered-users', async (req, resp) => {

    const { gender } = req.query;
    const mongoClient = new MongoClient(MONGO_CONNECTION_URL);
    try {
        await mongoClient.connect();
        const database = mongoClient.db('app-data')
        const userCollection = database.collection('users');
        const findUsers = await userCollection.find({ gender_identity: gender }).toArray();
        return resp.status(200).send(findUsers);
    } catch (e) {
        return resp.status(405).send("Internal server error please try again")
    } finally {
        await mongoClient.close()
    }

})

// adding match to the account list

app.post('/add-match', async (req, resp) => {
    const { user_id, swipedUserId } = req.body;

    const mongoClient = new MongoClient(MONGO_CONNECTION_URL);

    try {
        await mongoClient.connect();
        const database = mongoClient.db('app-data')
        const userCollection = database.collection('users');

        const pushQuery = {
            $addToSet: { matches: { user_id: swipedUserId } }
        }
        const updateResult = await userCollection.updateOne({ user_id }, pushQuery);
        return resp.status(201).send('user successfully added ')
    } catch {
        //logging to the thing
    } finally {
        await mongoClient.close()
    }
})

//creating an endpoint for getting full profile of matched user

app.get('/user-matched', async (req, resp) => {
    const matchedArray = req.query.matchedUsers;
    const mongoClient = new MongoClient(MONGO_CONNECTION_URL);
    try {
        await mongoClient.connect();
        const database = mongoClient.db('app-data');
        const userCollection = database.collection('users');

        const pipeline = [
            {
                $match: {
                    user_id: {
                        $in: matchedArray
                    }
                }
            }
        ]
        const users = await userCollection.aggregate(pipeline).toArray();
        return resp.status(201).send(users);
    } catch {

    } finally {
        await mongoClient.close()
    }
})

// creating an enpoints now for looking in to the messages database collection

app.get('/messages', async (req, resp) => {
    const { senderId, recieverId } = req.query;

    const mongoClient = new MongoClient(MONGO_CONNECTION_URL);
    try {
        await mongoClient.connect();
        const database = mongoClient.db('app-data');
        const messageCollection = database.collection('messages');

        const query = {
            from_userId: senderId,
            to_userId: recieverId
        }

        const messages = await messageCollection.find(query).toArray();
        return resp.status(200).send(messages);
    } catch (e) {
        console.log('error occured ', e);
        return resp.status(500).send('internal server error occurred');
    } finally {
        await mongoClient.close()
    }
})

//creating endpoint for sending the message

app.post('/send-message', async (req, resp) => {
    const { fromUserId, toUserId, timeStamp, message } = req.body

    const mongoClient = new MongoClient(MONGO_CONNECTION_URL);
    try {
        await mongoClient.connect();
        const database = mongoClient.db('app-data');
        const messageCollection = database.collection('messages');

        const dataObject = {
            timestamp: timeStamp,
            from_userId: fromUserId,
            to_userId: toUserId,
            message: message
        }
        const result = await messageCollection.insertOne(dataObject);
        return resp.status(201).send('message inserted succesfully');
    } catch (e) {
        return resp.status(500).send('internal server error')
    } finally {
        await mongoClient.close();
    }
})
