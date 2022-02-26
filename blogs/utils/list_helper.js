const lodash = require('lodash')


const dummy = (blogs) => {
    return 1
}


const countLikes = (blogs) => {
    const reducer = (sum, blog) => { return sum + blog.likes }
    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (prev, curr) => { return prev.likes > curr.likes ? prev : curr }
    return blogs.length === 0 ? null : blogs.reduce(reducer);
}


const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const reducer = (blogCountMap, blog) => {
        return blogCountMap[blog.author] === undefined ?
            { ...blogCountMap, [blog.author]: 1 } :
            { ...blogCountMap, [blog.author]: blogCountMap[blog.author] + 1 }
    }
    const authorAndBlogCount = blogs.reduce( reducer, {} )
    const authorWithMaxBlogs = Object.keys(authorAndBlogCount)
        .sort( (a1, a2) => authorAndBlogCount[a2] - authorAndBlogCount[a1] )[0];
    return {
        author: authorWithMaxBlogs,
        blogs: authorAndBlogCount[authorWithMaxBlogs]
    }
};


module.exports = {
    dummy, countLikes, favoriteBlog, mostBlogs
}
