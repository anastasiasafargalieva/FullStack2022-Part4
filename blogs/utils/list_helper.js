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

module.exports = {
    dummy, countLikes, favoriteBlog
}
