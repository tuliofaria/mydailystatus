import React, { useEffect } from 'react'
import auth0 from '../lib/auth0'
import router from 'next/router'
import { db } from '../lib/db'
import { distance } from '../lib/geo'

const App = props => {
  useEffect(() => {
    if (!props.isAuth) {
      router.push('/')
    } else if (props.forceCreate) {
      router.push('/create-status')
    }
  })
  if (!props.isAuth || props.forceCreate) {
    return null
  }
  return (
    <div>
      <h1>Status próximos a você:</h1>
      <table>
        {props.checkins.map(checkin => {
          return (
            <tr>
              <td>{checkin.id === props.user.sub && 'Seu status'}</td>
              <td>{checkin.status}</td>
              <td>{JSON.stringify(checkin.coords)}</td>
              <td>{checkin.distance}</td>
            </tr>
          )
        })}
      </table>
    </div>
  )
}
export default App

export async function getServerSideProps ({ req, res }) {
  const session = await auth0.getSession(req)
  if (session) {
    const today = new Date()
    const currentDate =
      today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()
    const todaysCheckin = await db
      .collection('markers')
      .doc(currentDate)
      .collection('checks')
      .doc(session.user.sub)
      .get()
    const todaysData = todaysCheckin.data()
    let forceCreate = true
    if (todaysData) {
      // pode ver os outros checkins
      forceCreate = false
      const checkins = await db
        .collection('markers')
        .doc(currentDate)
        .collection('checks')
        .near({
          center: todaysData.coordinates,
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
            todaysData.coordinates.latitude, // -22.20292, //
            todaysData.coordinates.longitude, // -45.94367, //
            doc.data().coordinates.latitude,
            doc.data().coordinates.longitude
          ).toFixed(2)
        })
      })
      return {
        props: {
          isAuth: true,
          user: session.user,
          forceCreate: false,
          checkins: checkinsList
        }
      }
    }

    return {
      props: {
        isAuth: true,
        user: session.user,
        forceCreate
      }
    }
  }
  return {
    props: {
      isAuth: false,
      user: {}
    }
  }
}
