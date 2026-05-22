# Sri Praharsha Silk Sarees (SPS) - Cashfree Payment Gateway Integration

This document outlines the Cashfree Payment Gateway integration design implemented for SPS Sarees, providing step-by-step configuration sequences to activate secure online checkouts for pure silk saree orders.

---

## 🏗️ Architectural Overview & Flow

The Cashfree integration uses a **Hybrid Server-Authoritative Model** designed to be highly secure, PCI-DSS compliant, and completely resilient in restricted deployment sandboxes (like browser iFrames):

1. **Order Initiation (Backend)**: When the customer submits a cart for online payment, the frontend issues a `POST /api/orders` request. The backend initializes `paymentStatus` to `"Pending"`, calculates totals, and invokes the Cashfree REST API to generate a unique `payment_session_id`.
2. **Standard Checkout (Frontend)**: If standard api credentials are provided, Cashfree's Web SDK loading from standard secure CDNs launches the payment modal where customers choose Card, UPI, Wallets, or Netbanking.
3. **Failsafe Emulator Overlay**: If credentials are unset, or if iframe sandboxing intercepts external redirects, the system activates a beautifully integrated **Sandbox Simulator** overlay enabling testers to click "Authorize Sandbox Payment" to safely mock successful payments.
4. **Instant Web Verification & Logs**: Upon successful completion, the client triggers the secure backend endpoint `POST /api/payments/cashfree-verify`. It connects directly to Cashfree's servers using SSL certificate layers to verify the status. When verified, it sets order status to `"Paid"` in `database.json`, instantly dispatches professional HTML receipt emails to both customer & admin logs.

---

## ⚙️ Configuration & Credentials Sequence

To connect your live or sandbox Cashfree Merchant accounts, follow these instructions:

### Step 1: Obtain API Keys
1. Navigate to the [Cashfree Merchant Dashboard](https://merchant.cashfree.com/merchants/login).
2. Register an account or sign in.
3. Go to **PG (Payment Gateway)** -> **Developer Suite** -> **API Keys**.
4. Duplicate the credentials for your environment (or toggle to the **Test Environment / Sandbox Dashboard**).
   * **App ID / Client ID**: (e.g., `cf123x...`)
   * **Secret Key**: (e.g., `cfsecret_abc...`)

### Step 2: Configure Environment Variables
Open the environment parameters configuration panel in the AI Studio platform, or copy `.env.example` into your local `.env` and fill out the variable values:

```env
# CASHFREE PAYMENT GATEWAY INTEGRATION CONFIGURATION
CASHFREE_APP_ID="YOUR_CASHFREE_CLIENT_ID"
CASHFREE_SECRET_KEY="YOUR_CASHFREE_SECRET_KEY"
CASHFREE_ENV="sandbox" # Use "sandbox" for development/testing or "production" for real transactions
```

*Note: If these variables are left empty, the application falls back gracefully into **Developer Demo Mode** with interactive sandbox screens so you can test successful order checkouts out of the box.*

---

## 🧪 Testing Credentials (Sandbox Suite)

When testing under `CASHFREE_ENV="sandbox"` using the real payment SDK, you can choose from these Cashfree-authorized mock test tokens:

### 1. Card Payments (Visa/Mastercard)
* **Card Number**: `4381 7600 0000 0001` or `4381 7600 0000 0002`
* **Card Holder Name**: `Sri Praharsha Sarees Tester`
* **Expiry Date**: Any future month/year (e.g., `12 / 29`)
* **CVV**: `123`
* **OTP Code (on redirect)**: `123456` or click "Success" on the Cashfree sandbox landing page

### 2. Unified Payments Interface (UPI)
* **VPA Virtual Address**: `success@gpay` or `success@upi`
* **Mock Approval**: Authorize the simulated push request on your mock mobile handset emulator.

---

## 🔍 Validation Checklist
To verify the entire payment system compiles and runs beautifully:
* Run `npm run lint` or check build outputs to see that there are no TS compilation gaps.
* Check Terminal console lines to watch simulated transaction alerts print and log files write to disk whenever order webhooks clear.
