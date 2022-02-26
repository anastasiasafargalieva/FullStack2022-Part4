const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogRouter.get('', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', {username: 1, name: 1, id: 1})
    response.json( blogs )
})

blogRouter.post('', async (request, response) => {
    const user = request.user
    if(user === null) response.status(401).json({ error: 'token missing or invalid' })
    const blog = new Blog(request.body)
    blog.user = user._id
    if(blog.title === undefined || blog.url === undefined){
        response.status(400).send('Title and URL cannot be empty')
        return
    }
    blog.likes = request.body.likes || 0
    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response, next) => {
    const user = request.user
    if(user === null) response.status(401).json({ error: 'token missing or invalid' })
    const blog = await Blog.findById(request.params.id)
    if ( blog.user.toString() !== user._id.toString() ){
        response.status(401).send('only the creator can delete the blog')
    }
    blog.remove()
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
    const updateRequest = request.body
    const blog = await Blog.findOneAndUpdate(request.params.id, updateRequest, {new: true})
    response.json(blog)
})

module.exports = blogRouter