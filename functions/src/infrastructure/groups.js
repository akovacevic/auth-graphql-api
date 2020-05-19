import admin from '../utils/fbadmin'
import * as functions from 'firebase-functions'

const collection = process.env.GROUPS_COLLECTION || functions.config().collection.groups || 'groups'
const users_collection = process.env.USERS_COLLECTION || functions.config().collection.users || 'users'
const roles_collection = process.env.ROLES_COLLECTION || functions.config().collection.roles || 'roles'
const field = 'name'

async function page(ref, size, pageNumber) {
    return await ref.orderBy(field).limit(size).offset(size * (pageNumber -1)).get()
}

async function getAll(pagination) {
    try {
        const db = admin.firestore()

        const result = await page(db.collection(collection), pagination.size, pagination.page)
        const groups = result.docs.map(doc => doc.data())

        return groups
    } catch (e) {
        throw e
    }
}

async function get(name) {
    try {
        const db = admin.firestore()   
        const result = await db.collection(collection).doc(name).get()

        if(!result.exists) {
            throw new Error('Group does not exist')
        }
        const group = result.data()

        return group
    } catch (e) {
        throw e
    }
    
}

async function getRoles(name) {
    try {
        const db = admin.firestore()

        const result = await db.collection(collection).doc(name).collection(roles_collection).get()

        const res = result.docs.map(r => r.data())

        return res
    } catch (e) {
        throw e
    }   
}

async function getUsers(name) {
    try {
        const db = admin.firestore()

        const result = await db.collection(collection).doc(name).collection(users_collection).get()

        const res = result.docs.map(r => r.data())

        return res
    } catch (e) {
        throw e
    }   
}

async function add(group) {
    try {
        const db = admin.firestore()

        group.name = group.name.toLowerCase().trim()
        const exist = await db.collection(collection).doc(group.name).get()

        if(exist.exists) {
            throw new Error('Group with that name already exists')
        }

        await db.collection(collection).doc(group.name).set(group)
        return group
    } catch (e) {
        throw e
    }
}

async function addUser(group, user) {
    try {
        const db = admin.firestore()

        const u = await db.collection(collection).doc(group.name).collection(users_collection).doc(user.uid).get()

        if(u.exists){
            return group
        }

        await  await db.collection(collection).doc(group.name).collection(users_collection).doc(user.uid).set(user)

        return group
    } catch (e) {
        throw e
    }
}

async function addRole(group, role) {
    try {

        if(!group) {
            throw new Error('Group must be provided')
        }

        if(!role) {
            throw new Error('Role must be provided')
        }

        const db = admin.firestore()

        const add = await db.collection(collection).doc(group.name).collection(roles_collection).doc(role.name).set(role)

        return group

    } catch (e) {
        throw e
    }
}

async function removeUser(groupName, userId) {
    try {
        const db = admin.firestore()

        const del = await db.collection(collection).doc(groupName).collection(users_collection).doc(userId).delete()

        return true
    } catch (e) {
        throw e
    }
}

async function removeRole(groupName, roleName) {
    try {
        const db = admin.firestore()

        const del = await db.collection(collection).doc(groupName).collection(roles_collection).doc(roleName).delete()

        return true
    } catch (e) {
        throw e
    }
}

async function remove(name) {
    try {
        const db = admin.firestore()
        const roles = await getRoles(name)
        const users = await getUsers(name)

        const promises = roles.map(g => db.collection(collection).doc(name).collection(roles_collection).doc(g.name).delete())
        const userPromises = users.map(u => db.collection(collection).doc(name).collection(users_collection).doc(u.uid).delete())

        promises.concat(userPromises)

        promises.push(db.collection(collection).doc(name).delete())

        await Promise.all(promises)

        return true
        
    } catch (e) {
        throw e
    }
}

const groups = { 
    getAll,
    get,
    remove,
    add,
    getRoles,
    getUsers,
    removeUser,
    removeRole,
    addRole,
    addUser,
}

export { groups as default }