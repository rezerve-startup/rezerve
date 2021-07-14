// tslint:disable-next-line: no-var-requires
const express = require('express');
const app = express();
// This is a sample test API key. Sign in to see examples pre-filled with your key.
// tslint:disable-next-line: no-var-requires
// Takes secret sk_test_....
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);

const cors = require('cors');

app.use(express.static('.'));
app.use(express.json());
app.use(cors());

//Accepts payment from previous Setup Intent
app.post('/create-setup-intent', async (req, res) => {
  const price = req.body; //JSON sent in from CheckoutForm.tsx 

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
});

//Creates Setup Intent at Checkout
app.post('/create-payment', async (req, res) => {
  const cID = req.body

  // const paymentMethods = await stripe.paymentMethods.list({
  //   customer: cID,
  //   type: "card"
  // });

  // Create and confirm a PaymentIntent with the order amount, currency, 
  // Customer and PaymentMethod ID
  const paymentIntent =  await stripe.paymentIntents.create({
    amount: 95,
    currency: "usd",
    payment_method: "pm_1JCKpFG4OM4l9C1diFEJzudS",
    customer: cID,
    off_session: true,
    confirm: true
  });

  res.send({
    succeeded: true,
    clientSecret: paymentIntent.client_secret
    //pm: paymentMethods.data[0].id,
  });



  // try {
  //   // List the customer's payment methods to find one to charge
  //   const paymentMethods = await stripe.paymentMethods.list({
  //     customer: cID,
  //     type: "card"
  //   });

  //   // Create and confirm a PaymentIntent with the order amount, currency, 
  //   // Customer and PaymentMethod ID
  //   const paymentIntent = await stripe.paymentIntents.create({
  //     amount: 95,
  //     currency: "usd",
  //     payment_method: paymentMethods.data[0].id,
  //     customer: cID,
  //     off_session: true,
  //     confirm: true
  //   });

  //   res.send({
  //     succeeded: true,
  //     clientSecret: paymentIntent.client_secret,
  //     publicKey: process.env.STRIPE_PUBLIC_KEY
  //   });
  // } catch (err) {
  //   if (err.code === "authentication_required") {
  //     // Bring the customer back on-session to authenticate the purchase
  //     // You can do this by sending an email or app notification to let them know
  //     // the off-session purchase failed
  //     // Use the PM ID and client_secret to authenticate the purchase
  //     // without asking your customers to re-enter their details
  //     res.send({
  //       error: "authentication_required",
  //       paymentMethod: err.raw.payment_method.id,
  //       clientSecret: err.raw.payment_intent.client_secret,
  //       publicKey: process.env.STRIPE_PUBLIC_KEY,
  //       amount: 95,
  //       card: {
  //         brand: err.raw.payment_method.card.brand,
  //         last4: err.raw.payment_method.card.last4
  //       }
  //     });
  //   } else if (err.code) {
  //     // The card was declined for other reasons (e.g. insufficient funds)
  //     // Bring the customer back on-session to ask them for a new payment method
  //     res.send({
  //       error: err.code,
  //       clientSecret: err.raw.payment_intent.client_secret,
  //       publicKey: process.env.STRIPE_PUBLIC_KEY,
  //     });
  //   } else {
  //     console.log("Unknown error occurred", err);
  //   }
  // }
});




// Use for live site
// tslint:disable-next-line: no-console
app.listen(process.env.PORT || 5000, () => console.log(`Node server listening on port ${process.env.PORT || 5000}!`));

// Use for local testing
// tslint:disable-next-line: no-console
//app.listen(4242, () => console.log('Node server listening on port 4242!'));