
import * as functions from 'firebase-functions';
// import * as firebase from 'firebase';
// const admin = require('firebase-admin');
// admin.initializeApp();
// Firebase function
/*
    take the user credentials from the CMS_Users collection (email/password)
    create an account in the auth
*/
exports.createNotification = functions.firestore.document('test/{uid}').onCreate((change, context) => {
    console.log('Document change', change.data(), 'Document context', context);
    const text = change.get('res');
    // const password = change.get('pwd');
    console.log(text);
    

})