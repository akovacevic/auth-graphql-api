import Role from '../../src/resolvers/Role'
import db from '../../src/infrastructure/db'

describe('Role resolver', () => {

    const authorization = 'Bearer 123451234512345'

    test('get groups in success', async () => {
        const parent = {
            name: 'app1-reader'
        }
        const result = await Role.inGroups(parent, undefined, { headers: { authorization }, db }, undefined)
        expect(result.length).toEqual(1)
    })
})