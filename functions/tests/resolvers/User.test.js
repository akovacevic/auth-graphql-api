import User from '../../src/resolvers/User'
import db from '../../src/infrastructure/db'

describe('User resolver', () => {

    const authorization = 'Bearer 123451234512345'

    test('get groups in success', async () => {
        const parent = {
            uid: '1'
        }
        const result = await User.inGroups(parent, undefined, { headers: { authorization }, db }, undefined)
        expect(result.length).toEqual(1)
    })
})