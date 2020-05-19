import { isAuthenticated } from "../utils/user"

const Mutation = {
    async makeAdmin(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)

        const user = await db.users.get(args.uid)

        if(!user)
            throw new Error('User does not exist')

        const result = await db.users.makeAdmin(user)

        return result
    },

    async importUsers(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        return await db.users.importUsers(args.emails)
    },

    async deleteUser(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        const user = await db.users.get(args.uid)

        if(!user) {
            throw new Error('User does not exist')
        }

        const groups = await db.users.getGroups(user.uid)

        const promises = groups.map(g => db.groups.removeUser(g.name, user.uid))
        promises.push(db.users.remove(user.uid))

        await Promise.all(promises)

        return user 
    },

    async createRole(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        return await db.roles.add(args.input)
    },

    async createGroup(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        return await db.groups.add(args.input)
    },

    async updateRole(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        let existing = await db.roles.get(args.input.name)

        if(!existing) {
            throw new Error('Role does not exist')
        }

        const role = await db.roles.update(args.input)

        const groups = await db.roles.getGroups(role.name)

        const promises = groups.map(g => db.groups.addRole(g.name, role))

        Promise.all(promises)
        return role
    },

    async deleteRole(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)
        const role = await db.roles.get(args.name)

        if(!role) {
            throw new Error('Role does not exists')
        }

        const groups = await db.roles.getGroups(role.name)

        const promises = []

        groups.forEach(g => {
            promises.push(db.groups.removeRole(g.name,role.name))
        })

        promises.push(db.roles.remove(role.name))

        await Promise.all(promises)

        return role
    },

    async addRoleToGroup(parent, args, { headers, req, res, db}, info) {
        const auth = await isAuthenticated(headers)
        const role = await db.roles.get(args.input.roleName)
        const group = await db.groups.get(args.input.groupName)

        
        if(!role) {
            throw new Error('Role is not found')
        }

        if(!group) {
            throw new Error('Group is not found')
        }

        const promises = []
        promises.push(db.groups.addRole(group, role))
        promises.push(db.roles.addGroup(role, group))

        await Promise.all(promises)

        return group
    },

    async removeRoleFromGroup(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)

        const promises = []
        promises.push(db.roles.removeGroup(args.input.roleName,args.input.groupName))
        promises.push(db.groups.removeRole(args.input.groupName, args.input.roleName))

        await Promise.all(promises)

        return await db.groups.get(args.input.groupName)
    },

    async addUserToGroup(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)

        const user = await db.users.get(args.input.userId)
        const group = await db.groups.get(args.input.groupName)

        if(!group)
            throw new Error('Group does not exist')
        
        if(!user)
            throw new Error('User does not exist')

        try {
            const promises = []
            promises.push(db.users.addGroup(user, group))
            promises.push(db.groups.addUser(group, user))
            await Promise.all(promises)

            return user
        } catch (e) {
            console.log({e})
            throw e
        }
    },

    async removeUserFromGroup(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)

        const user = await db.users.get(args.input.userId)
        const groups = await db.users.getGroups(user.uid)

        const filter = groups.filter(x => x.name === args.input.groupName)

        if(filter.length === 0) {
            throw new Error('User is not in that Group')
        }

        const promises = []
        promises.push(db.users.removeGroup(user.uid, args.input.groupName))
        promises.push(db.groups.removeUser(args.input.groupName,user.uid))

        await Promise.all(promises)

        return user
    },

    async deleteGroup(parent, args, { headers, req, res, db }, info) {
        const auth = await isAuthenticated(headers)

        const group = await db.groups.get(args.name)

        if(!group) {
            throw new Error('Group does not exist')
        }

        try {
            const roles = await db.groups.getRoles(group.name)
            const users = await db.groups.getUsers(group.name)
            const promises = roles.map(r => db.roles.removeGroup(r.name, group.name))
            const userPromises = users.map(u => db.users.removeGroup(u.uid, group.name))
            promises.concat(userPromises)
            promises.push(db.groups.remove(group.name))

            Promise.all(promises)

            return group

        } catch (e) {
            console.log({e})
            throw e
        }
    }
}

export { Mutation as default }