import fs from 'fs'
import path from 'path'
import * as functions from 'firebase-functions'
import admin from './utils/fbadmin'
import { ApolloServer, gql } from 'apollo-server-cloud-functions'
import db from './infrastructure/db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Group from './resolvers/Group'
import Role from './resolvers/Role'


const typeDefs = gql(fs.readFileSync(path.join(__dirname,'../src/schema.graphql'), 'utf8'))

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        User,
        Group,
        Role
    },
    context: ({ req, res }) => ({
        headers: req.headers,
        req,
        res,
        db
    }),
    playground: true,
    introspection: true
})

const handler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true
    }
})

exports.graphql = functions.https.onRequest(handler)

exports.userCreated = functions.auth.user().onCreate(async (user) => {
    const result = await admin.onBoard(user)

    user.customClaims = result

    await db.users.add({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        ... user.customClaims,
        photoURL: user.photoURL
    })

    return true;
})

exports.userDeleted = functions.auth.user().onDelete(async (user) => {
    console.log({user})

    console.log('user deleted')

    const dbUser = await db.users.get(user.uid)
    
    if(!dbUser) {
        return true
    }

    const del = await db.users.remove(user.uid)

    if(!del)
        throw new Error('failed to delete User')

    const delPromise = []
    if(dbUser.customClaims.groups) {
        dbUser.customClaims.groups.forEach(g => {
            delPromise.push(db.groups.removeMember(g.name, dbUser.uid))
        })
    }

    await Promise.all(delPromise)
    await Notify('User Deleted', user);
    return true 
})