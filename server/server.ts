// tslint:disable-next-line: no-var-requires
const express = require('express');
const app = express();
// This is a sample test API key. Sign in to see examples pre-filled with your key.
// tslint:disable-next-line: no-var-requires
// Takes secret sk_test_....
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);

var cors = require('cors');

app.use(express.static('.'));
app.use(express.json());
app.use(cors());


app.post('/create-payment-intent', async (req, res) => {
  const price = req.body; //JSON sent in from CheckoutForm.tsx 

  // const customer = await stripe.customers.create({
    // source: tokenized mastercard,
    // email: email here, 
//  });

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 75,
    currency: 'usd',
	description: 'Rezerve Booking Fee'
  });

  // Transfer to business
  //const transfer =  await strip.tranfer.create({ 
    // amount: ,
    // currency: ,
    // destination: `{{CONNECTED_STRIPE_ACCOUNT_ID}}`,
    // transfer_group: `{id}` ,
  // }); 

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Use for live site
// tslint:disable-next-line: no-console
//app.listen(process.env.PORT || 5000, () => console.log(`Node server listening on port ${process.env.PORT || 5000}!`));

// Use for local testing
// tslint:disable-next-line: no-console
app.listen(4242, () => console.log('Node server listening on port 4242!'));
