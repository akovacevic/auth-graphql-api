import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.applicationDefault()
})

admin.onBoard = async (user) => {

    // Add the user to the default group/role
    let customClaims = { 
        admin: false
     }
     
     //Create default account with permissions to the api
     if(user.email == 'admin@admin.com') {
         customClaims.admin = true
     }

    var set = await admin.auth().setCustomUserClaims(user.uid, customClaims)
    return customClaims

}

export { admin as default }