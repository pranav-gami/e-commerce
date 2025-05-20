import express from "express";
import { initiatePayment } from "../../controller/stripePaymentController.js";

const router = express.Router();

router.post("/initiate", initiatePayment);
router.post("/webhook", initiatePayment);

export default router;

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const handleStripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("❌ Stripe webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // ✅ Handle the checkout session completed event
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;

//     const userId = session.metadata?.userId;
//     const amount = session.metadata?.totalAmout;

//     console.log("✅ Payment success for user:", userId);

//     if (userId && amount) {
//       try {
//         await placeOrderAndClearCart(userId, amount);
//         console.log("🛒 Order placed and cart cleared for user:", userId);
//       } catch (e) {
//         console.error("❌ Failed to place order or clear cart:", e.message);
//       }
//     }
//   }

//   res.status(200).json({ received: true });
// };
