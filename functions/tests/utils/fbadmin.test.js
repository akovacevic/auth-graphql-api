import admin from '../../src/utils/fbadmin'

describe('user util', () => {
    const headers = {
        authorization: 'Bearer 123451234512345'
    }

    test('onboard success', async () => {
        const result = await admin.onBoard({
            email: 'test@fastsigns.com'
        })
        expect(result.admin).toEqual(false)
    })

    test('onboard fails - incorrect domain', async () => {
        const result = await admin.onBoard({
            email: 'test@simpson.com'
        })
        expect(result.admin).toEqual(undefined)
    })
})