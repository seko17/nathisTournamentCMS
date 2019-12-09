
import * as functions from 'firebase-functions';
// const admin = require('firebase-admin');
// import * as firebase from 'firebase';
import admin = require('firebase-admin');
admin.initializeApp()

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

const tokens = 'fbo-_hrbyu4:APA91bFiMUca8o54oNcooEM7m8BFn-7B7jZY_GsvKMKAO_lyKOo-ycTYQYPOmb_xLrblcNn0SHTGqSG0PmxKbGtl8aqWrCju4uULkXqv3udxet1xZLerkqL70eXrtAlAB6zhTH3JUfkk'
    const payload = {
        notification: {
          title: 'You have a new follower!',
          body: 'szd',
          icon: ''
        }
      };
    return  admin.messaging().sendToDevice(tokens, payload);
// return promise.all(response)
})