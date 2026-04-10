// Configuration for external integrations
// Update these URLs when deploying to production

// Stripe Checkout: URL of your serverless function that creates a Checkout Session
// Example for Vercel: https://your-app.vercel.app/api/create-checkout
// Example for Netlify: https://your-app.netlify.app/.netlify/functions/create-checkout
export const STRIPE_CHECKOUT_API_URL = "https://chef-lil-j-s-table.vercel.app/api/create-checkout";

// Webhook URL for sending reservation data to Google Sheets (via Make/Zapier)
// Example: https://hook.eu2.make.com/abc123...
export const WEBHOOK_URL = "https://hook.eu1.make.com/ccuktvu8gevh7j9n79hof133se4ettb3";
