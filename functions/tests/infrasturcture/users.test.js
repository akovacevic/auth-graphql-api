import users from '../../src/infrastructure/users'
import admin from '../__mocks__/firebase-admin'

describe('firestore users db', () => {

    test('get all users success', async () => {
        const pagination = { 
            page:1,
            size:5 
        }
        const result = await users.getAll(pagination)
        expect(result.length).toBe(2)
    })

    test('get user by id success', async () => {
        const result = await users.get('1')
        expect(result.email).toBe('homer@simpson.com')
        expect(result.emailVerified).toBe(true)
        
    })

    test('add user fails - missing uid', () => {
        expect(users.add({ email: 'test@fastsigns.com' }))
            .rejects.toThrow(new Error('User data missing'))
    })

    test('add user fails - user already exists', () => {
        expect(users.add({ uid: '1'}))
            .rejects.toThrow(new Error('User already exists'))
    })

    test('add user success', async () => {
        const add = await users.add({
            uid: '4',
            email: 'test@fastsigns.com'
        })

        expect(add.uid).toBe('4')
        expect(add.email).toBe('test@fastsigns.com')
    })

    test('get groups success', async () => {
        const result = await users.getGroups('1')
        expect(result.length).toBe(1)
    })

    test('add group to user success', async () => {
        const result = await users.addGroup({ uid: '1'}, { name: 'marketing'})
        expect(result.uid).toBe("1")
    })

    test('add user to group fails - user already in that group', async() => {
        expect(users.addGroup({uid:'1'}, {name: 'it' }))
            .rejects.toThrow(new Error('User is already in that Group'))
    })

    test('add user to group fails - missing uid', async () => {
        expect(users.addGroup({ email:'homer@simpson.com'}, { name: 'it'}))
            .rejects.toThrow(new Error('User uid missing'))
    })

    test('add user to group fails - missing group name', async () => {
        expect(users.addGroup({ uid: '1'}, {  }))
            .rejects.toThrow(new Error('Group name missing'))
    })

    test('remove group success', async () => {
        const result = await users.removeGroup('1', 'it')
        expect(result).toBe(true)
    })

    test('remove user success', async () => {
        const del = await users.remove('1')
        expect(del).toBe(true)
    })

    test('update user success', async () => {
        const update = await users.update({
            uid: '1',
            email: 'updated@fastsigns.com'
        })

        expect(update.uid).toBe('1')
        expect(update.email).toBe('updated@fastsigns.com')
    })

    test('update user fails - user data missing', async () => {
        expect(users.update({ email: 'updated@fastsigns.com'}))
            .rejects.toThrow(new Error('User data missing'))
    })

    test('make admin success', async () => {
        const result = await users.makeAdmin({
            uid:'2'
        })
        expect(result.admin).toBe(true)
    })

    test('make admin fails - user data missing', () => {
        expect(users.makeAdmin({ email: 'test@test.com'}))
            .rejects.toThrow(new Error('User data missing'))
    })

    test('import users success', async () => {
        const result = await users.importUsers([
            'import@fastsigns.com'
        ])
        expect(result).toBe(true)
    })
})