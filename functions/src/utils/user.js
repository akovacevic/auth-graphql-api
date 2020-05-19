import admin from './fbadmin';


function isAuthorized(auth) {
  
  if(auth.admin === true) {
    return true
  }
  
  return false
}

async function isAuthenticated(headers) {
  const { authorization } = headers;

  if (!authorization) {
    throw new Error('Authentication required')
  }

  if (!authorization.startsWith("Bearer"))
    throw new Error('Authentication required')

  const split = authorization.split("Bearer ");
  
  if (split.length !== 2)
    throw new Error('Authentication required')

  const token = split[1]

  try {
    const auth = await admin.auth().verifyIdToken(token)

    if(!auth) {
      throw new Error('Authentication required')
    }

    const authorized = isAuthorized(auth)

    if(!authorized) {
      throw new Error('Authentication required')
    }

    return auth
  } catch (err) {
    console.error(`${err.code} -  ${err.message}`);
    throw err
  }
}

export { isAuthenticated, isAuthorized}