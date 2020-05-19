const Group = {
    async hasRoles(parent, args, { headers, req, res, db }, info){
        return await db.groups.getRoles(parent.name)
    },

    async members(parent, args, { headers, req, res, db }, info) {
        return await db.groups.getUsers(parent.name)
    }
}

export { Group as default }