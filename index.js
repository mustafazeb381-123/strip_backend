const express = require("express")
const bodyParser = require("body-parser")
const stripe = require('stripe')('sk_test_51M9mTZCx9BzIRwrvFSOY60LY28wdhj9Q69ARS4G7RaSBd4VC8PhUOcSMTEO9vrbGESkN8FG29owx4nczvNoIMTsR00Ep2GNTIN');


const app = express()
const PORT = 3001
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.

    const { amount, currency } = req.body;
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2023-10-16' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method_types: ['card'],
    });
    // const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amount,
    //     currency: currency,
    //     customer: customer.id,
    //     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    //     automatic_payment_methods: {
    //         enabled: true,
    //     },
    // });

    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: 'pk_test_51M9mTZCx9BzIRwrvXAiM9RsNBhXARd4hIv5eHMeaVOng3khXuJr80OgDpYdcZiMRqXWNX63K2s5IRbBLVzAWwv8d006J7xvZId'
    })
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})