import { db } from '../lib/db'
import { distance } from '../lib/geo'
import admin from 'firebase-admin'
import { getCurrentDate } from '../lib/datetime'

export const checkExists = async user => {
  const currentDate = getCurrentDate()
  const todaysCheckin = await db
    .collection('markers')
    .doc(currentDate)
    .collection('checks')
    .doc(user)
    .get()
  const todaysData = todaysCheckin.data()
  return todaysData
}
export const findChecksNearbyCheckin = async checkin => {
  const currentDate = getCurrentDate()
  const checkins = await db
    .collection('markers')
    .doc(currentDate)
    .collection('checks')
    .near({
      center: checkin.coordinates,
      radius: 1000
    })
    .get()
  const checkinsList = []
  checkins.docs.forEach(doc => {
    checkinsList.push({
      id: doc.id,
      status: doc.data().status,
      coords: {
        lat: doc.data().coordinates.latitude,
        long: doc.data().coordinates.longitude
      },
      distance: distance(
        checkin.coordinates.latitude, // -22.20292, //
        checkin.coordinates.longitude, // -45.94367, //
        doc.data().coordinates.latitude,
        doc.data().coordinates.longitude
      ).toFixed(2)
    })
  })
  return checkinsList
}

export const setStatus = async (user, dados) => {
  const currentDate = getCurrentDate()
  await db
    .collection('markers')
    .doc(currentDate)
    .collection('checks')
    .doc(user)
    .set({
      status: dados.status,
      user: user,
      coordinates: new admin.firestore.GeoPoint(
        dados.coords.lat,
        dados.coords.long
      )
    })
}
