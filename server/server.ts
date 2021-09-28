// tslint:disable-next-line: no-var-requires
const express = require('express');
const app = express();
// This is a sample test API key. Sign in to see examples pre-filled with your key.
// tslint:disable-next-line: no-var-requires
// Takes secret sk_test_....
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const cors = require('cors');

app.use(express.static('.'));
app.use(express.json());
app.use
  (cors({
    origin: "*",
    credentials: true,
  })
)



//Accepts payment from previous Setup Intent
app.post('/create-setup-intent', async (req, res) => {
  const action = req.body.action; //JSON sent in from CheckoutForm.tsx 
  
  if(action === 'setupIntent'){
  const customer = await stripe.customers.create();

  // Create a PaymentIntent with the order amount and currency
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
    description: "ReZerve Booking Fee",
  });

  res.send({
    clientSecret: setupIntent.client_secret,
    cID: customer.id
  });
} 
  else if (action === 'paymentIntent'){
  const cID = req.body.cID
  try {
    // List the customer's payment methods to find one to charge
    const paymentMethods = await stripe.paymentMethods.list({
      customer: cID,
      type: "card"
    });

    // Create and confirm a PaymentIntent with the order amount, currency, 
    // Customer and PaymentMethod ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 75,
      currency: "usd",
      description: "ReZerve Booking Fee",
      payment_method: paymentMethods.data[0].id,
      customer: cID,
      off_session: true,
      confirm: true
    });

    res.send({
      succeeded: true,
      clientSecret: paymentIntent.client_secret,
      publicKey: process.env.STRIPE_PUBLIC_KEY
    });
  } catch (err) {
    if (err.code === "authentication_required") {
      // Bring the customer back on-session to authenticate the purchase
      // You can do this by sending an email or app notification to let them know
      // the off-session purchase failed
      // Use the PM ID and client_secret to authenticate the purchase
      // without asking your customers to re-enter their details
      res.send({
        error: "authentication_required",
        paymentMethod: err.raw.payment_method.id,
        clientSecret: err.raw.payment_intent.client_secret,
        publicKey: process.env.STRIPE_PUBLIC_KEY,
        amount: 75,
        card: {
          brand: err.raw.payment_method.card.brand,
          last4: err.raw.payment_method.card.last4
        }
      });
    } else if (err.code) {
      // The card was declined for other reasons (e.g. insufficient funds)
      // Bring the customer back on-session to ask them for a new payment method
      res.send({
        error: err.code,
        clientSecret: err.raw.payment_intent.client_secret,
        publicKey: process.env.STRIPE_PUBLIC_KEY,
      });
    } else {
      console.log("Unknown error occurred", err);
    }
  }
  }
});

//Twilio Integration
app.post('/twilio', (req, res) => {
  const messageRecipient = req.body.recipient;
  const recievingNumber = req.body.phoneNumber;
  const businessName = req.body.businessName;
  const date = req.body.apptDate;

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json');
  
  if(messageRecipient === 'customer'){
    const customerMessage = 'ReZerve | ' + businessName + 'has accepted your appointment for ' + date;
    client.messages
    .create({
       body: customerMessage,
       from: '+14694059872',
       to: recievingNumber
     })
     .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
  } else if (messageRecipient === 'business') {
    const businessMessage = 'ReZerve | You have a new appointment request. Go to your ReZerve Dashboard to see appointment details at https://www.rezervebookings.com/' ;
    client.messages
    .create({
       body: businessMessage,
       from: '+14694059872',
       to: recievingNumber
     })
     .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
  }
});




// Use for live site
// tslint:disable-next-line: no-console
app.listen(process.env.PORT || 5000, () => console.log(`Node server listening on port ${process.env.PORT || 5000}!`));

// Use for local testing
// tslint:disable-next-line: no-console
//app.listen(4242, () => console.log('Node server listening on port 4242!'));