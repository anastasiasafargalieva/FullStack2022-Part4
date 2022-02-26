const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const sampleBlogs = require('../resources/sample_blogs')

const {initialBlogs} = require("./test_helper");
const bcrypt = require('bcrypt')
const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    for( let user of helper.initialUsers){
        let userObject = new User( {
            username: user.username,
            password: await bcrypt.hash( user.password, 10 ),
            name: user.name
        } )
        await userObject.save()
    }
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map( blog => new Blog(blog) )
    const promiseArray = blogObjects.map( blog => blog.save() )
    await Promise.all(promiseArray)
}, 10000)


test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
        .expect(200).expect('Content-Type', /application\/json/)
}, 10000)

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength( helper.initialBlogs.length)
    const titles = []
    response.body.forEach( res => {
        titles.push(res.title)
        expect(res.id).toBeDefined()
    } )
    helper.initialBlogs.forEach( b => expect(titles).toContain(b.title) )
}, 10000)

test('new blog can be added', async () => {
    const user = helper.initialUsers[0]
    const loginResponse = await api.post('/api/login').send( { username:user.username, password: user.password } ).expect(200)
    const token = 'bearer ' + loginResponse.body.token
    const newBlog = sampleBlogs.blogs[0]
    newBlog._id = await helper.nonExistingId()

    const response = await api.post('/api/blogs').set({ "Authorization": token }).send(newBlog).expect(201)
        newBlog.user = user._id
        expect(response.body.title).toEqual( newBlog.title )

    const updatedEntriesInDb = await helper.blogsInDb()
    expect(updatedEntriesInDb).toHaveLength( helper.initialBlogs.length + 1)
    expect( updatedEntriesInDb.map( e => e.title) ).toContainEqual( newBlog.title )
}, 10000)

test('missing likes property will set it to 0 in db', async () => {
    const newBlog = sampleBlogs.blogs[0]
    delete newBlog.likes
    delete newBlog._id
    const response = await api.post('/api/blogs').send(newBlog)
        .expect(201).expect('Content-Type', /application\/json/)
    expect(response.body.likes).toEqual( 0)
})

test('missing title or url property will raise 400 response status code', async() => {
    let newBlog = sampleBlogs.blogs[0]
    delete newBlog._id
    delete newBlog.title
    await api.post('/api/blogs').send(newBlog).expect(400)

    newBlog = sampleBlogs.blogs[0]
    delete newBlog._id
    delete newBlog.url
    await api.post('/api/blogs').send(newBlog).expect(400)

    newBlog = sampleBlogs.blogs[0]
    delete newBlog._id
    delete newBlog.title
    delete newBlog.url
    await api.post('/api/blogs').send(newBlog).expect(400)

})

test('blog cannot be deleted by anonymous user', async() => {
    await api.delete('/api/blogs/'+helper.initialBlogs[0]._id).expect(200)
    const blogsInDb = await helper.blogsInDb()
    expect(blogsInDb).toHaveLength(initialBlogs.length-1)
    expect(blogsInDb).not.toContainEqual(initialBlogs[0])
}, 10000)

test('blog can be deleted by the creator', async() => {
    const user = helper.initialUsers[0]
    const loginResponse = await api.post('/api/login').send( { username:user.username, password: user.password } ).expect(200)
    const token = 'bearer ' + loginResponse.body.token

    const newBlog = {
        title: "new blog",
        author: "Anastasia Safargalieva",
        url: "https://reactpatterns.com/",
        likes: 100
    }
    const blogResponse = await api.post('/api/blogs').set("Authorization", token).send(newBlog).expect(201)

    await api.delete('/api/blogs/'+blogResponse.body.id).set({ "Authorization": token }).expect(204)
    const blogsInDb = await helper.blogsInDb()
    expect(blogsInDb).toHaveLength(initialBlogs.length)
    expect(blogsInDb).not.toContainEqual(blogResponse)

}, 10000)


test('blog cannot be deleted by user other than creator', async() => {
    let user = helper.initialUsers[0]
    let loginResponse = await api.post('/api/login').send( { username:user.username, password: user.password } ).expect(200)
    let token = 'bearer ' + loginResponse.body.token

    const newBlog = {
        title: "new blog",
        author: "Anastasia Safargalieva",
        url: "https://reactpatterns.com/",
        likes: 100
    }
    const blogResponse = await api.post('/api/blogs').set("Authorization", token).send(newBlog).expect(201)

    user = helper.initialUsers[1]
    loginResponse = await api.post('/api/login').send( { username:user.username, password: user.password } ).expect(200)
    token = 'bearer ' + loginResponse.body.token

    await api.delete('/api/blogs/'+blogResponse.body.id).set({ "Authorization": token }).expect(401)

}, 10000)


test('existing blog can be updated', async () => {
    let blogsInDb = await helper.blogsInDb()
    expect(blogsInDb).toHaveLength(initialBlogs.length)
    const blogToUpdate = blogsInDb[0]
    const updateRequest = {
        "likes": blogToUpdate.likes + 1,
        "url": blogToUpdate.url + "/refresh",
        "title": blogToUpdate.title + "-updated"
    }
    const response = await api.put('/api/blogs/'+blogToUpdate._id).send(updateRequest)
    expect(response.status).toEqual(200)
    expect(response.body.id).toEqual(blogToUpdate.id)
    expect(response.body.likes).toEqual(blogToUpdate.likes + 1)
    expect(response.body.url).toEqual(blogToUpdate.url + "/refresh")
    expect(response.body.title).toEqual(blogToUpdate.title + "-updated")
})

afterAll(() => {
    mongoose.connection.close()
})