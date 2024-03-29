import firebase from 'firebase';
import { 
  setUserEmployeeInfo,
  setUserCustomerInfo, 
  setBusinessAvailability,
  logoutUser,
  setAuthChanging
} from '../shared/store/actions';
import store from '../shared/store/store';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'rezerve-develop.firebaseapp.com',
  databaseURL: 'https://rezerve-develop.firebaseio.com/',
  projectId: 'rezerve-develop',
  storageBucket: 'rezerve-develop.appspot.com',
  messagingSenderId: '425070059413',
  appId: '1:425070059413:web:d88eb9ea40cdd7d595a09c',
  measurementId: 'G-CRN3J3ZPFW',
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const unsubscribe = auth.onAuthStateChanged((user) => {
  store.dispatch(setAuthChanging(true));
  //console.log("user: " + user);
  if (user) {
    firestore
      .collection('users')
      .doc(`${user.uid}`)
      .get()
      .then((userObj) => {
        const userInfo = userObj.data();
        if (userInfo && userInfo.customerId !== '') {
          firestore.collection('customers').doc(userInfo.customerId).get()
            .then((customerObj) => {
              const customerInfo = customerObj.data();
              console.log(customerInfo);
              const customerInfoToAdd = {}
              userInfo.customerInfo = customerInfoToAdd;
              console.log( "UseInfo: " + userInfo)
              store.dispatch(setUserCustomerInfo(userInfo));
              store.dispatch(setAuthChanging(false));
            })
        } else if (userInfo && userInfo.employeeId !== '') {
          firestore.collection('employees').doc(userInfo.employeeId).get()
            .then((employeeObj) => {
              const employeeInfo = employeeObj.data();

              const employeeInfoToAdd = {
                availability: employeeInfo?.availability,
                isOwner: employeeInfo?.isOwner,
                position: employeeInfo?.position,
                services: employeeInfo?.services,
                todos: employeeInfo?.todos,
                businessId: employeeInfo?.businessId,
              }
              userInfo.employeeInfo = employeeInfoToAdd;
            })
            .then(() => {
              firestore.collection('businesses').where('employees', 'array-contains', `${userInfo.employeeId}`).get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((businessDoc) => {
                    const businessInfoData = businessDoc.data();

                    const businessAvailability = {
                      daysOpen: businessInfoData.about.daysOpen,
                      openingTime: businessInfoData.about.openingTime,
                      closingTime: businessInfoData.about.closingTime
                    };

                    store.dispatch(setBusinessAvailability(businessAvailability));
                  })
                })
            })
            .then(() => {
              store.dispatch(setUserEmployeeInfo(userInfo));
              store.dispatch(setAuthChanging(false))
            })
          }
        }
      )
      .catch((err) => {
        // console.log(err);
      })
  } else {
    store.dispatch(logoutUser());
    store.dispatch(setAuthChanging(false))
  }
})