// tslint:disable-next-line: no-var-requires
const express = require('express');
const app = express();
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);
const cors = require('cors');
app.use(express.static('.'));
app.use(express.json());
app.use(cors());
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
} else if (action === 'paymentIntent'){
  const cID = req.body.cID
  const paymentMethods = await stripe.paymentMethods.list({
    customer: cID,
    type: "card"
  });
  // Create and confirm a PaymentIntent with the order amount, currency, 
  // Customer and PaymentMethod ID
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 95,
    currency: "usd",
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
  }
});

app.listen(process.env.PORT || 5000, () => console.log(`Node server listening on port ${process.env.PORT || 5000}!`));
