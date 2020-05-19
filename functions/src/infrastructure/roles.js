import admin from '../utils/fbadmin'
import * as functions from 'firebase-functions'

const collection = process.env.ROLES_COLLECTION || functions.config().collection.roles || 'roles'
const groups_collection = process.env.GROUPS_COLLECTION || functions.config().collection.groups || 'groups'
const field = 'name'

async function page(ref, size, pageNumber) {
    return await ref.orderBy(field).limit(size).offset(size * (pageNumber -1)).get()
}

async function getAll(pagination) {
    try {
        const db = admin.firestore()
        const result = await page(db.collection(collection), pagination.size, pagination.page)
        const roles = result.docs.map(doc => doc.data())
        return roles
    } catch (e) {
        throw e
    }
}

async function get(name) {
    try { 
        const db = admin.firestore()
        const result = await db.collection(collection).doc(name).get()

        if(!result.exists)
            throw new Error('Role does not exist')

        return result.data()
    } catch (e) {
        throw e
    }
}

async function add(role) {
    try {
        const db = admin.firestore()

        role.name = role.name.toLowerCase().trim()
        const exist = await db.collection(collection).doc(role.name).get()

        if(exist.exists) {
            throw new Error('Role with that name already exists')
        }

        await db.collection(collection).doc(role.name).set(role)
        return role
    } catch (e) {
        throw e
    }
}

async function remove(name) {
    try {
        const db = admin.firestore()
        const groups = await getGroups(name)

        const promises = groups.map(g => db.collection(collection).doc(name).collection(groups_collection).doc(g.name).delete())

        promises.push(db.collection(collection).doc(name).delete())

        await Promise.all(promises)

        return true
        
    } catch (e) {
        throw e
    }
}

async function update(role) {
    try{
        const db = admin.firestore()
        role.name = role.name.toLowerCase().trim()
        await db.collection(collection).doc(role.name).update(role)

        return role
    } catch(e) {
        throw e
    }
}

async function getGroups(name) {
    try {
        const db = admin.firestore()

        if(!name) {
            throw new Error("Role name is missing")
        }
        const result = await db.collection(collection).doc(name).collection(groups_collection).get()

        const res = result.docs.map(r => r.data())
        return res
    } catch (e) {
        throw e
    }
}

async function addGroup(role, group) {
    try {
        const db = admin.firestore()

        await  await db.collection(collection).doc(role.name).collection(groups_collection).doc(group.name).set(group)

        return role

    } catch (e) {
        throw e
    }
}

async function removeGroup(roleName, groupName) {
    try {
        const db = admin.firestore()

        const del = await db.collection(collection).doc(roleName).collection(groups_collection).doc(groupName).delete()

        return true
    } catch (e) {
        throw e
    }
}

const roles = {
    getAll,
    get,
    update,
    add,
    remove,
    getGroups,
    addGroup,
    removeGroup
}

export { roles as default }