const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')

describe( 'total likes', () => {

    const listWithOneBlog = [
        { _id: '5a422aa71b54a676234d17f8', "title": "Blog 1", "author": "Bipin K", "url": "google.com",  likes: 20, __v: 0 }
    ]

    const listWithMultipleBlogs = [
        { _id: '56ygfcvbnjkjuhygfdcv4563', "title": "Blog 1", "author": "Ana", "url": "google.com",  likes: 34, __v: 0  },
        { _id: '56ygfcvbnjkjuhygfdcv4564', "title": "Blog 2", "author": "Ana", "url": "google.com",  likes: 76, __v: 0  },
        { _id: '56ygfcvbnjkjuhygfdcv4565', "title": "Blog 3", "author": "Ana", "url": "google.com",  likes: 12, __v: 0  },
        { _id: '56ygfcvbnjkjuhygfdcv4566', "title": "Blog 4", "author": "Ana", "url": "google.com",  likes: 6, __v: 0  },
        { _id: '56ygfcvbnjkjuhygfdcv4567', "title": "Blog 5", "author": "Ana", "url": "google.com",  likes: 36, __v: 0  }
    ]

    test('of empty list is zero', () => {
        const result = listHelper.countLikes( [] )
        expect(result).toBe(0)
    } )

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.countLikes(listWithOneBlog)
        expect(result).toBe(20)
    } )

    test('of a bigger list is calculated right', () => {
        const result = listHelper.countLikes(listWithMultipleBlogs)
        expect(result).toBe( 34+76+12+6+36 )
    } )

} )