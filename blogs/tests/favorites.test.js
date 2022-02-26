const listHelper = require('../utils/list_helper')
//const Blog = require('../models/blog')
const sampleBlogs = require('../resources/sample_blogs')

describe( 'favorite among ', () => {

    test('empty list of blogs is None', () => {
        const result = listHelper.favoriteBlog( [] )
        expect(result).toBe(null)
    } )

    test('singleton list of blogs is itself', () =>{
        const result = listHelper.favoriteBlog( sampleBlogs.blogs.slice(0,1) )
        expect(result).toEqual( sampleBlogs.blogs[0] )
    })

    test(' list of blogs is the one with highest likes', () =>{
        const result = listHelper.favoriteBlog( sampleBlogs.blogs )
        expect(result).toEqual( sampleBlogs.blogs[2] )
    })

})