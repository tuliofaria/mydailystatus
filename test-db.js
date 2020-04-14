const admin = require('firebase-admin')
const secret = require('./firebase-secret.json')
const { GeoFirestore } = require('geofirestore')

admin.initializeApp({
  credential: admin.credential.cert(secret)
})

const db = admin.firestore()
const dbgeo = new GeoFirestore(db)

dbgeo
  .collection('test')
  .add({
    test: 1,
    coordinates: new admin.firestore.GeoPoint(-20.21899, -45.93906)
  })
  .then(() => {
    console.log('ok')
  })
