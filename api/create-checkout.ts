import Stripe from "stripe";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !secretKey.startsWith("sk_")) {
    return res.status(500).json({ error: "Stripe secret key not configured on server" });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

  try {
    const {
      dinnerDate,
      guestCount,
      wineCount,
      cheeseCount,
      name,
      email,
      allergies,
      successUrl,
      cancelUrl,
    } = req.body;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "eur",
          product_data: { name: `Dinner ${dinnerDate} — 4 courses` },
          unit_amount: 7000,
        },
        quantity: guestCount,
      },
    ];

    if (wineCount > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Wine pairing" },
          unit_amount: 2000,
        },
        quantity: wineCount,
      });
    }

    if (cheeseCount > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Cheese course" },
          unit_amount: 1300,
        },
        quantity: cheeseCount,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "bancontact"],
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
      metadata: {
        dinner_date: dinnerDate,
        guest_count: String(guestCount),
        wine_count: String(wineCount),
        cheese_count: String(cheeseCount),
        guest_name: name,
        allergies: allergies || "",
      },
      success_url: successUrl || `${req.headers.origin}/thank-you`,
      cancel_url: cancelUrl || `${req.headers.origin}/?payment=cancelled`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: err.message });
  }
}
