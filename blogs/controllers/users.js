const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('', async (request, response) => {
    if(request.body.username === undefined || request.body.password === undefined){
        response.status(400).send("Empty username or password")
        return
    }
    if(request.body.password.length < 3){
        response.status(400).send("Password less than 3 characters")
        return
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds)
    const user = new User( {
        username: request.body.username,
        password: passwordHash,
        name: request.body.name
    } )
    const savedUser = await user.save()
    response.json(savedUser)
})

module.exports = userRouter