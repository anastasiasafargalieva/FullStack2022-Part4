const listHelper = require('../utils/list_helper')
//const Blog = require('../models/blog')
const sampleBlogs = require('../resources/sample_blogs')

describe( 'total likes', () => {


    test('of empty list is zero', () => {
        const result = listHelper.countLikes( [] )
        expect(result).toBe(0)
    } )

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.countLikes( sampleBlogs.blogs.slice(0,1) )
        expect(result).toBe( 7 )
    } )

    test('of a bigger list is calculated right', () => {
        const result = listHelper.countLikes( sampleBlogs.blogs )
        expect(result).toBe( 36 )
    } )

} )