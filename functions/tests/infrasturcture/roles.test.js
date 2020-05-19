import roles from '../../src/infrastructure/roles'
import admin from '../__mocks__/firebase-admin'

describe('firestore roles db', () => {

    test('get all roles success', async () => {
        const pag = {
            page:1,
            size:5
        }
        const result = await roles.getAll(pag)
        expect(result.length).toEqual(2)
    })

    test('get role by name success', async () => {
        const role = await roles.get('app1-admin')
        expect(role.name).toBe('app1-admin')
        expect(role.permissions.length).toBe(3)
    })

    test('get role by name fails - role does not exist', () => {
        expect(roles.get('god'))
            .rejects.toThrow(new Error('Role does not exist'))
    })

    test('add role success', async () => {
        const role = await roles.add({
            name: 'newrole1',
            permissions: [
                'full',
                'access'
            ]
        })

        expect(role.name).toBe('newrole1')
        expect(role.permissions.length).toBe(2)
    })

    test('add role fails - role already exists', () => {
        expect(roles.add({
            name: 'app1-admin',
            permissions: [
                'full',
                'access'
            ]
        })).rejects.toThrow(new Error('Role with that name already exists'))
    })

    test('remove role success', async () => {
        const result = await roles.remove('app1-reader')

        expect(result).toBe(true)
    })

    test('update role success', async () => {
        const update = await roles.update({
            id: 'app1-admin',
            name: 'app1-admin',
            permissions: [
                'full'
            ]
        })
        expect(update.permissions.length).toBe(1)
    })

    test('get groups success', async () => {
        const groups = await roles.getGroups('app1-admin')

        expect(groups.length).toBe(1)
    })

    test('get group fails - role name is missing', () => {
        expect(roles.getGroups(undefined))
            .rejects.toThrow(new Error('Role name is missing'))
    })

    test('add group success', async () => {
        const role = {
            name: 'app1-admin'
        }

        const group = {
            name: 'marketing'
        }

        const result = await roles.addGroup(role, group)

        expect(result.name).toBe('app1-admin')
    })

    test('remove group success', async () => {
        const result = await roles.removeGroup('app1-admin', 'it')
        expect(result).toBe(true)
    })

})