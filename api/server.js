// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()
server.use(express.json())

// [PUT] /api/users/:id                                                                                                                               
//√ [12] responds with updated user (5 ms)                                                                                                         
//√ [13] saves the updated user to the db (3 ms)
//√ [14] responds with the correct message & status code on bad id (3 ms)                                                                          
//√ [15] responds with the correct message & status code on validation problem (7 ms)  
// When the client makes a `PUT` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

// - respond with HTTP status code `404` (Not Found).
// - return the following JSON object: `{ message: "The user with the specified ID does not exist" }`.

// - If the request body is missing the `name` or `bio` property:

// - respond with HTTP status code `400` (Bad Request).
// - return the following JSON response: `{ message: "Please provide name and bio for the user" }`.

// - If there's an error when updating the _user_:

// - respond with HTTP status code `500`.
// - return the following JSON object: `{ message: "The user information could not be modified" }`.

// - If the user is found and the new information is valid:

// - update the user document in the database using the new information sent in the `request body`.
// - respond with HTTP status code `200` (OK).
// - return the newly updated _user document_.
server.put('/api/users/:id', async (req, res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if (!possibleUser) {
            res.status(404).json({
                message: "The user with the specified ID does not exist",
            })
        } else {
           if (!req.body.name || !req.body.bio) {
               res.status(400).json({
                   message: "Please provide name and bio for the user",
               })
           } else {
            const updatedUser = await User.update(req.params.id, req.body)
            res.status(200).json(updatedUser)
           }
        }
    } catch (err) {
        res.status(500).json({
            message: "The user information could not be modified",
            err: err.message,
            stack: err.stack
        })
    }
})

// [DELETE] /api/users/:id                                                                                                                            
// √ [9] responds with deleted user (6 ms)                                                                                                          
// √ [10] deletes the user from the db (2 ms)                                                                                                       
// √ [11] responds with the correct message & status code on bad id (2 ms) 

// When the client makes a `DELETE` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist" }`.

// - If there's an error in removing the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The user could not be removed" }`.

server.delete('/api/users/:id', async (req, res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if(!possibleUser) {
            res.status(404).json({
                message: "The user with the specified ID does not exist",
            })
        } else {
            const deleteUser = await User.remove(possibleUser.id)
            res.status(200).json(deleteUser)
        }
    } catch (err) {
        res.status(500).json({
            message: "The user could not be removed",
            err: err.message,
            stack: err.stack,
        })
    }
})

// [POST] /api/users                                                                                                                                  
// √ [1] responds with a new user (37 ms)                                                                                                           
// √ [2] adds a new user to the db (5 ms)                                                                                                           
// √ [3] responds with the correct status code on success (2 ms)                                                                                    
// √ [4] responds with the correct message & status code on validation problem (9 ms) 

// When the client makes a `POST` request to `/api/users`:

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ message: "Please provide name and bio for the user" }`.

// - If the information about the _user_ is valid:

//   - save the new _user_ the the database.
//   - respond with HTTP status code `201` (Created).
//   - return the newly created _user document_ including its id.

// - If there's an error while saving the _user_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON object: `{ message: "There was an error while saving the user to the database" }`.

server.post('/api/users', (req, res) => {
    const user = req.body
    if (!user.name || !user.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user",
        })
    } else {
        User.insert(user)
        .then(createdUser => {
            res.status(201).json(createdUser)
        })
        .catch (err => {
            res.status(500).json({
                message: "There was an error while saving the user to the database",
                err: err.message,
                stack: err.stack,
            })
        })
    }
})

// [GET] /api/users                                                                                                                                   
// √ [5] can get all the users (3 ms)                                                                                                               
// √ [6] can get the correct users (3 ms)

// When the client makes a `GET` request to `/api/users`:

// - If there's an error in retrieving the _users_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The users information could not be retrieved" }`.

server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: "The users information could not be retrieved",
            err: err.message,
            stack: err.stack,
        })
    })
})

// [GET] /api/users/:id                                                                                                                               
// √ [7] responds with the correct user (5 ms)                                                                                                      
// √ [8] responds with the correct message & status code on bad id (4 ms)

// When the client makes a `GET` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist" }`.

// - If there's an error in retrieving the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ message: "The user information could not be retrieved" }`.

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if (!user) {
            res.status(404).json({
                message: "The user with the specified ID does not exist",
            })
        }
        res.json(user)
    })
    .catch(err => {
        res.status(500).json({
            message: "The user information could not be retrieved",
            err: err.message,
            stack: err.stack,
        })
    })
})
server.use('*', (req, res) => {
    res.status(404).json({
        message: "not found"
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
