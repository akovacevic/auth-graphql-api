import Group from '../../src/resolvers/Group'
import db from '../../src/infrastructure/db'

describe('Group resolver', () => {

    const authorization = 'Bearer 123451234512345'

    test('get roles used success', async () => {
        const parent = {
            name: 'it'
        }
        const result = await Group.hasRoles(parent, undefined, { headers: { authorization }, db }, undefined)
        expect(result.length).toEqual(1)
    })

    test('get members success', async () => {
        const parent = {
            name: 'it'
        }
        const result = await Group.members(parent, undefined, { headers: { authorization }, db }, undefined)
        expect(result.length).toEqual(1)
    })
})