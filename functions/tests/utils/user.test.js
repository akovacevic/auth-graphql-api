import { isAuthenticated, isAuthorized } from '../../src/utils/user'

describe('user util', () => {
    const headers = {
        authorization: 'Bearer 123451234512345'
    }

    test('is authenticated success', async () => {
        const result = await isAuthenticated(headers)
        expect(result.uid).toEqual('test')
    })

    test('is authenticated fails - no auth header provided', async() => {
        expect(isAuthenticated({ }))
            .rejects.toThrow(new Error('Authentication required'))
    })

    test('is authorized success', async () => {
        const result = isAuthorized({ admin: true })
        expect(result).toBe(true)
    })

    test('is authorized fails - admin not true', async () => {
        const result = isAuthorized({ admin: false})
        expect(result).toBe(false)
    })

    test('is authorized fails - no admin', async () => {
        const result = isAuthorized({})
        expect(result).toBe(false)
    })
})