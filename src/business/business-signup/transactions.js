const firestore = require('../../config/FirebaseConfig');

const userDocRef = firestore.collection('users').doc('vOGlKfpAayU4w9V3hj7TTZFyphZ2');
const empRef = firestore.collection('employees');

firestore.runTransaction((trans) => {
  return trans.get(userDocRef).then((userDoc) => {
    if (!userDoc.exists) {
      throw new Error("User doc doesnt exist")
    } else {
      console.log(userDoc)
      return userDoc.data()?.employeeId;
    }
  })
  .then((employeeId) => {
    console.log(employeeId)

    return trans.get(empRef.doc(employeeId)).then((employeeDoc) => {
      console.log(employeeDoc.data())
    })
  })
  .then(() => {
    console.log("Finished transaction")
  })
  .catch((e) => {
    console.log(e) 
  })
});
