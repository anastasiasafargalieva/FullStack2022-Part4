const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')

describe( 'favorite among ', () => {

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

    test('empty list of blogs is None', () => {
        const result = listHelper.favoriteBlog( [] )
        expect(result).toBe(null)
    } )

    test('singleton list of blogs is itself', () =>{
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])
    })

    test(' list of blogs is the one with highest likes', () =>{
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        expect(result).toEqual(listWithMultipleBlogs[4])
    })

})