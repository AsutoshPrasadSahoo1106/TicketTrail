// filepath: c:\A MY FOLDERS\A study\CU\Study\SEM 4\MAJOR PROJECT\Code\TicketTrail\backend\config\stripe.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Add your Stripe Secret Key in .env
module.exports = stripe;
