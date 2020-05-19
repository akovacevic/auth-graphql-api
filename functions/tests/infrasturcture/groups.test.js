import groups from '../../src/infrastructure/groups'

describe('firestore groups db', () => {
    test('get all groups success', async () => {
        const pag = {
            page:1,
            size:5
        }

        const result = await groups.getAll(pag)
        expect(result.length).toEqual(2)
    })

    test('get group by name success', async () => {
        const group = await groups.get('it')
        expect(group.name).toBe('it')

    })

    test('add group success', async () => {
        const group = await groups.add({
            name: 'newGroup'
        })

        expect(group.name).toBe('newgroup')
    })

    test('add group fails - group with that name already exists', () => {
        expect(groups.add({ name: 'it' }))
            .rejects.toThrow(new Error('Group with that name already exists'))
    })

    test('remove group success', async () => {
        const result = await groups.remove('it')
        expect(result).toBe(true)
    })

    test('get roles success', async () => {
        const roles = await groups.getRoles('it')
        expect(roles.length).toBe(1)
    })

    test('add role success', async () => {
        const group = { 
            name: 'it'
        }
        const role = {
            name: 'newRole'
        }

        const result  = await groups.addRole(group, role)

        expect(result.name).toBe('it')
    })

    test('add role fails - group must be provided', () => {
        expect(groups.addRole(undefined, undefined))
            .rejects.toThrow(new Error('Group must be provided'))
    })

    test('add role fails - role must be provided', () => {
        expect(groups.addRole({ name: 'it' }, undefined))
            .rejects.toThrow(new Error('Role must be provided'))
    })

    test('remove role success', async () => {
        const result = await groups.removeRole('it', 'app1-admin')
        expect(result).toBe(true)
    })

    test('get users success', async () => {
        const users = await groups.getUsers('it')

        expect(users.length).toBe(1)
    })

    test('add user success', async () => {
        const group = {
            name: 'marketing'
        }

        const user = {
            uid:'test',
            admin: true
        }

        const result = await groups.addUser(group, user)

        expect(result.name).toBe('marketing')
    })

    test('remove user', async() => {
        const result = await groups.removeUser('it', '1')
        expect(result).toBe(true)
    })

})