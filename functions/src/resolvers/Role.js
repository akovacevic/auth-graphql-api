const Role = {
    async inGroups(parent, args, { req, res, db }, info) {
        return await db.roles.getGroups(parent.name)
    }

}

export { Role as default }