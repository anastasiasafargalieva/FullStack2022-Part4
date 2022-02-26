const listHelper = require('../utils/list_helper')
const sampleBlogs = require('../resources/sample_blogs')

describe( 'author with most blogs from the list of ', () => {

    test('0 blogs is null', () => {
        const result = listHelper.mostBlogs( [] )
        expect(result).toBe(null)
    } )

    test(' list of blogs return correct author name and the number of blogs', () =>{
        const result = listHelper.mostBlogs( sampleBlogs.blogs )
        const expected = {
            "author": "Robert C. Martin",
            "blogs": 3
        }
        expect(result).toEqual( expected )
    })

})