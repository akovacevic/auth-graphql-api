const User = {
    async inGroups(parent, args, { req, res, db }, info) {
        return await db.users.getGroups(parent.uid)
    }

}

export { User as default }