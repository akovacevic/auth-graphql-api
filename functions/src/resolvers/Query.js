import { isAuthenticated } from '../utils/user'

const Query = {
    async users(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        return await db.users.getAll(args.input)
    },

    async user(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        return await db.users.get(args.uid)
    },

    async roles(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        return db.roles.getAll(args.input)
    },

    async role(parent, args, {headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        return await db.roles.get(args.name)
    },

    async groups(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        return await db.groups.getAll(args.input)
    },

    async group(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        return await db.groups.get(args.name)
    }
}

export { Query as default }