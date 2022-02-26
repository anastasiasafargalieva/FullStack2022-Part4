const listHelper = require('../utils/list_helper')
const sampleBlogs = require('../resources/sample_blogs')

describe( 'author with most likes from the list of ', () => {

    test('0 blogs is null', () => {
        const result = listHelper.mostLikes( [] )
        expect(result).toBe(null)
    } )

    test(' list of blogs return correct author name and the total sum of number of likes', () =>{
        const result = listHelper.mostLikes( sampleBlogs.blogs )
        const expected = {
            "author": "Edsger W. Dijkstra",
            "likes": 17
        }
        expect(result).toEqual( expected )
    })

})