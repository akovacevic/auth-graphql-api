import admin from '../utils/fbadmin'
import * as functions from 'firebase-functions'
import { v4 as uuidv4 } from 'uuid'

const auth = admin.auth()
const collection = process.env.USERS_COLLECTION || functions.config().collection.users || 'users'
const groups_collection = process.env.GROUPS_COLLECTION || functions.config().collection.groups || 'groups'
const field = 'email'


async function page(ref, size, pageNumber) {
    return await ref.orderBy(field).limit(size).offset(size * (pageNumber -1)).get()
}

async function getAll(pagination) {
    try {
        const db = admin.firestore()
        const result = await page(db.collection(collection), pagination.size, pagination.page)
        const users = result.docs.map(doc => doc.data())
        return users
    } catch (e) {
        throw e
    }
}

async function get(uid) {
    try { 
        if(!uid) {
            throw new Error("uid is required")
        }
        const db = admin.firestore()
        const result = await db.collection(collection).doc(uid).get()

        if(!result.exists) {
            throw new Error('User does not exist')
        }
        
        
        return result.data()
    } catch (e) {
        throw e
    }
}

async function remove(uid) {
    try {
        const db = admin.firestore()

        const groups = await getGroups(uid)

        const promises = groups.map(g => db.collection(collection).doc(uid).collection(groups_collection).doc(g.name).delete())

        promises.push(db.collection(collection).doc(uid).delete())

        const del = await Promise.all(promises)

        if(del) {
            await auth.deleteUser(uid)
        }
        return true
    } catch (e) {
        throw e
    }
}

async function add(user) {
    try {
        const db = admin.firestore()

        if(!user || !user.uid) {
            throw new Error('User data missing')
        }

        const u = await db.collection(collection).doc(user.uid).get()

        if(u.exists){
            throw new Error('User already exists')
        }

        const add  = await db.collection(collection).doc(user.uid).set(user)

        if(!add) {
            throw new Error('Failed to add User')
        }

        return user
    } catch (e) {
        throw e
    }
}

async function update(user) {
    try { 
        const db = admin.firestore()

        if(!user || !user.uid) {
            throw new Error('User data missing')
        }

        await db.collection(collection).doc(user.uid).update(user)
        return user

    } catch (e) {
        throw e
    }
}

async function importUsers(emails) {
    try {
        const db = admin.firestore()
        const batch = db.batch()

        const users = emails.map(e => {
            const user =  {
                uid: uuidv4().replace('-',''),
                //displayName: 'John Doe',
                email: e,
                //photoURL: 'http://www.example.com/12345678/photo.png',
                emailVerified: true,
                //phoneNumber: '+11234567890',
                customClaims: { admin: false },
                // User with Google provider.
                providerData: [{
                    uid: 'google-uid',
                    email: e,
                    //displayName: 'John Doe',
                    //photoURL: 'http://www.example.com/12345678/photo.png',
                    providerId: 'google.com'
                }]
            }
            batch.set(db.collection(collection).doc(user.uid), {
                email: user.email,
                emailVerified: true,
                ... user.customClaims,
                uid: user.uid
            })

            return user
        })

        await batch.commit()
        const result = await auth.importUsers(users)
        return true;
    } catch (e) {
        throw e
    }
    
}

async function getGroups(uid) {
    try {
        const db = admin.firestore()

        const result = await db.collection(collection).doc(uid).collection(groups_collection).get()

        const res = result.docs.map(r => r.data())

        return res
    } catch (e) {
       throw e
    }
}

async function addGroup(user, group) {
    try {
        if(!user || !group)
        throw new Error('User and Group must be provided')
        const db = admin.firestore()

        if(!user.uid) {
            throw new Error('User uid missing')
        }

        if(!group.name) {
            throw new Error('Group name missing')
        }

        const u = await db.collection(collection).doc(user.uid).collection(groups_collection).doc(group.name).get()

        if(u.exists){
            throw new Error('User is already in that Group')
        }
        
        const add = await db.collection(collection).doc(user.uid).collection(groups_collection).doc(group.name).set(group)

        if (!add)
            throw new Error('Failed to add Group to User')

        const groups = await getGroups(user.uid)

        const customClaims = { admin: user.admin, groups: groups}
        await auth.setCustomUserClaims(user.uid, customClaims)
        return user
    } catch (e) {
        throw e
    }
}

async function removeGroup(uid, groupName) {
    try {
        const db = admin.firestore()

        const del = await db.collection(collection).doc(uid).collection(groups_collection).doc(groupName).delete()

        const user = await get(uid)
        const groups = await getGroups(uid)

        const customClaims = { admin: user.admin, groups: groups }

        await auth.setCustomUserClaims(uid, customClaims)
        return true
    } catch (e) {
        throw e
    }
}

async function makeAdmin(user) {
    try {
        if(!user || !user.uid) {
            throw new Error('User data missing')
        }
        user.admin = true
        await update(user)
    
        const groups = await getGroups(user.uid)
    
        const customClaims = { admin: user.admin, groups: groups }
        await auth.setCustomUserClaims(user.uid, customClaims)
    
        return user
    } catch (e) {
        throw e
    }
}
    
const users = {
    add,
    remove,
    update,
    getAll,
    get,
    importUsers,
    addGroup,
    makeAdmin,
    getGroups,
    removeGroup
}

export { users as default }