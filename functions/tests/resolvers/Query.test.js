import Query from '../../src/resolvers/Query'
import db from '../../src/infrastructure/db'

describe('Query resolver', () => {

    const authorization = 'Bearer 123451234512345'

    test('get all users success', async () => {
        const args = {
            input: { size: 5,
                    page: 1 }
        }
        const result = await Query.users(undefined, args, { headers: { authorization }, db }, undefined)
        expect(result.length).toEqual(2)
    })

    test('get user by id success', async () => {
        const args = {
            uid: '1'
        }
        const result = await Query.user(undefined, args, { headers: { authorization }, db }, undefined)
        expect(result.uid).toEqual('1')
    })

    test('get all roles success', async () => {
        const args = {
            input: { size: 5,
                    page: 1 }
        }
        const result = await Query.roles(undefined, args, { headers: { authorization }, db }, undefined)
        expect(result.length).toEqual(2)
    })

    test('get role by name success', async () => {
        const args = {
            name: 'app1-admin'
        }
        const result = await Query.role(undefined, args, { headers: { authorization }, db }, undefined)
        expect(result.name).toEqual('app1-admin')
    })

    test('get all groups success', async () => {
        const args = {
            input: { size: 5,
                    page: 1 }
        }
        const result = await Query.groups(undefined, args, { headers: { authorization }, db }, undefined)
        expect(result.length).toEqual(2)
    })

    test('get group by name success', async () => {
        const args = {
            name: 'it'
        }
        const result = await Query.group(undefined, args, { headers: { authorization }, db }, undefined)
        expect(result.name).toEqual('it')
    })

})