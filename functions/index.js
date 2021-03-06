// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    admin.database().ref('/messages').push({original: original}).then(snapshot => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.redirect(303, snapshot.ref);
    });
});

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onWrite(event => {
        // Grab the current value of what was written to the Realtime Database.
        const original = event.data.val();
        console.log('Uppercasing', event.params.pushId, original);
        const uppercase = original.toUpperCase();
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        return event.data.ref.parent.child('uppercase').set(uppercase);
    });


exports.createCard = functions.firestore.document('cards/{cardId}')
    .onCreate(event => {
        const newValue = event.data.data();
        const name = newValue.name;
        const uppercase = name.toUpperCase();
        console.log("Card Add for " + name + " " + uppercase);

        return event.data.ref.set({
            uppercase_name: uppercase
        }, {merge: true});

    });

exports.createCard = functions.firestore.document('cards/{cardId}')
    .onUpdate(event => {
        const newValue = event.data.data();
        const name = newValue.name;
        const uppercase = name.toUpperCase();
        console.log("Card Update for " + name + " " + uppercase);

        return event.data.ref.set({
            uppercase_name: uppercase
        }, {merge: true});

    });