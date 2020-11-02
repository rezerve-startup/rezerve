import React from 'react';
import ReactDOM from 'react-dom';
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe('pk_test_51Hiu7WCrgvBRTZ4ZDfOmbitywAwqDCrPuACQBItzVMXTjQL4v8rW6GPXjTsh7ZdNkkq2dvIKphbvTFDkj8GKphap00GcsGQvqC')



function Checkout() {
    return (
        <>
            <button role="link">
                Checkout
            </button>
        </>
    );
}

export default Checkout