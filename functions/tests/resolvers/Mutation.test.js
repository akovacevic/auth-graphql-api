import Mutation from '../../src/resolvers/Mutation'
import db from '../../src/infrastructure/db'

describe('Mutation resolver', () => {
    const authorization = 'Bearer 123451234512345'

    test('make admin sucdess', async () => {
        const args = {
            uid: '1'
        }
        const result = await Mutation.makeAdmin(undefined, args, { headers: { authorization }, db }, undefined)
        expect(result.email).toEqual('homer@simpson.com')
    })

    test('import users success', async () => {
        const args = {
            emails: [
                'user1@simpson.com'
            ]
        }

        const result = await Mutation.importUsers(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result).toBe(true)
    })

    test('delete user success', async () => {
        const args = {
            uid: '1'
        }

        const result = await Mutation.deleteUser(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.uid).toBe('1')
    })

    test('delete user fails', async () => {
        const args = {
            uid: '10'
        }

        expect(Mutation.deleteUser(undefined, args, { headers: { authorization }, db}, undefined))
            .rejects.toThrow(new Error('User does not exist'))
    })

    test('create role success', async () => {
        const args = {
            input: {
                name: 'newrole',
                permissions: [
                    'newPerm'
                ]
            }
        }

        const result = await Mutation.createRole(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.name).toBe('newrole')
    })

    test('create role fails - role already exists', async () => {
        const args = {
            input: {
                name: 'app1-admin',
                permissions: [
                    'newPerm'
                ]
            }
        }

        expect(Mutation.createRole(undefined, args, { headers: { authorization }, db}, undefined))
            .rejects.toThrow(new Error('Role with that name already exists'))
    })

    test('create group success', async () => {
        const args = {
            input: {
                name: 'new_group'
            }
        }

        const result = await Mutation.createGroup(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.name).toBe('new_group')
    })

    test('create group fails - role already exists', async () => {
        const args = {
            input: {
                name: 'it',
            }
        }

        expect(Mutation.createGroup(undefined, args, { headers: { authorization }, db}, undefined))
            .rejects.toThrow(new Error('Group with that name already exists'))
    })

    test('update role success', async () => {
        const args = {
            input: {
                name: 'app1-admin',
                permissions: [
                    'editor'
                ]
            }
        }

        const result = await Mutation.updateRole(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.name).toBe('app1-admin')
    })

    test('update role fails - role does not exist', async () => {
        const args = {
            input: {
                name: 'fake_role',
                permissions: [
                    'editor'
                ]
            }
        }

        expect(Mutation.updateRole(undefined, args, { headers: { authorization }, db}, undefined))
            .rejects.toThrow(new Error('Role does not exist'))
    })

    test('delete role success', async () => {
        const args = {
            name: 'app1-admin'
        }

        const result = await Mutation.deleteRole(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.name).toBe('app1-admin')
    })

    test('delete group success', async () => {
        const args = {
            name: 'it'
        }

        const result = await Mutation.deleteGroup(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.name).toBe('it')
    })

    test('delete user success', async () => {
        const args = {
            uid: '1'
        }

        const result = await Mutation.deleteUser(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.uid).toBe('1')
        expect(result.email).toBe('homer@simpson.com')
    })

    test('add role to group success', async () => {
        const args = {
            input: {
                roleName: 'app1-reader',
                groupName: 'it'
            }
        }

        const result = await Mutation.addRoleToGroup(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.name).toBe('it')
    })

    test('remove role from group success', async () => {
        const args = {
            input: {
                roleName: 'app1-admin',
                groupName: 'it'
            }
        }

        const result = await Mutation.removeRoleFromGroup(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.name).toBe('it')
    })

    test('add user to group success', async () => {
        const args = {
            input: {
                userId: '2',
                groupName: 'it'
            }
        }

        const result = await Mutation.addUserToGroup(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.uid).toBe('2')
    })

    test('add user to group fails - group does not exist', async () => {
        const args = {
            input: {
                userId: '2',
                groupName: 'fake'
            }
        }

        expect(Mutation.addUserToGroup(undefined, args, { headers: { authorization }, db}, undefined))
            .rejects.toThrow(new Error('Group does not exist'))
    })

    test('remove user from group success', async () => {
        const args = {
            input: {
                userId: '1',
                groupName: 'it'
            }
        }

        const result = await Mutation.removeUserFromGroup(undefined, args, { headers: { authorization }, db}, undefined)
        expect(result.uid).toBe('1')
    })

    test('remove user from group fails - user is not in that group', async () => {
        const args = {
            input: {
                userId: '2',
                groupName: 'it'
            }
        }

        expect(Mutation.removeUserFromGroup(undefined, args, { headers: { authorization }, db}, undefined))
            .rejects.toThrow('User is not in that Group')
    })


})