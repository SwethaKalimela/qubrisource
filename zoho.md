# Integrate Qubrisource Contact Form with Zoho Forms

**Target email:** sales@qubrisource.com  
**Source file:** `index.html.html` (contact section, lines 1674–1707)  
**Section ID:** `#contact`

---

## Your Current Form (What Needs Wiring)

The contact section in `index.html.html` is **visual only** today — it uses a `<div>`, not a `<form>`, and inputs have no `name` attributes. The submit button does not send data anywhere.

**Current markup (does not submit):**

```html
<div class="contact-form reveal">
  <div class="form-row">
    <div class="f-group"><label>First Name</label><input type="text" placeholder="Your first name"></div>
    <div class="f-group"><label>Last Name</label><input type="text" placeholder="Your last name"></div>
  </div>
  <div class="f-group"><label>Work Email</label><input type="email" placeholder="you@yourcompany.com"></div>
  <div class="f-group"><label>Company Name</label><input type="text" placeholder="Your company name"></div>
  <div class="f-group">
    <label>What Do You Need Help With?</label>
    <select>
      <option value="">Choose a service...</option>
      <option>Software Development</option>
      <option>UI/UX Design</option>
      <option>Digital Marketing</option>
      <option>Brand Identity</option>
      <option>Product Strategy</option>
      <option>IT Staffing</option>
      <option>More than one service</option>
    </select>
  </div>
  <div class="f-group"><label>Tell Us More</label><textarea placeholder="What are you trying to achieve? What's your timeline and rough budget?"></textarea></div>
  <button class="btn-submit">Send My Free Quote Request →</button>
</div>
```

**Fields to mirror in Zoho:**

| Your field (index.html) | Type |
|---|---|
| First Name | Text |
| Last Name | Text |
| Work Email | Email |
| Company Name | Text |
| What Do You Need Help With? | Dropdown |
| Tell Us More | Multi-line text |

Existing CSS classes (`.contact-form`, `.form-row`, `.f-group`, `.btn-submit`) will continue to work after you switch to a `<form>` element.

---

## Step 1 — Create a Zoho Account and Form

1. Go to [https://www.zoho.com/forms/](https://www.zoho.com/forms/) and sign up (or sign in with your Zoho account).
2. Click **+ New Form** → choose **Blank Form**.
3. Name it something like **"Qubrisource Quote Request"**.

---

## Step 2 — Build Matching Fields in Zoho

Add these fields in Zoho Forms (order can match your page):

1. **Name** field → set to **Name (First & Last)**  
   - Or use two separate **Single Line** fields: "First Name" and "Last Name".
2. **Email** field → label: **Work Email** → mark as **Required**.
3. **Single Line** field → label: **Company Name**.
4. **Dropdown** field → label: **What Do You Need Help With?**  
   Add the same options as `index.html`:
   - Software Development
   - UI/UX Design
   - Digital Marketing
   - Brand Identity
   - Product Strategy
   - IT Staffing
   - More than one service
5. **Multi Line** field → label: **Tell Us More**.

Save the form.

---

## Step 3 — Send Submissions to sales@qubrisource.com

1. Open your form → **Settings** (gear icon).
2. Go to **Email Notifications** (or **Rules** → **Email Alerts**).
3. Click **Add Notification**.
4. Set:
   - **To:** `sales@qubrisource.com`
   - **Subject:** e.g. `New Quote Request — {{Company Name}}`
   - **Body:** include all form fields using Zoho's field placeholders.
5. Optionally add an **Auto-Reply** to the submitter ("Thanks, we'll respond within 24 hours").
6. Save.

---

## Step 4 — Choose How to Integrate (3 Options)

### Option A — Keep Your Design (Recommended)

Use Zoho's **HTML source code** so you keep your existing styling and POST directly to Zoho.

1. In Zoho Forms, open your form.
2. Go to **Share** → **Embed** (or **Share Form**).
3. Choose **Source Code** / **HTML Code** (not iframe).
4. Zoho gives you HTML that includes:
   - The submit URL, e.g.  
     `https://forms.zohopublic.com/yourorg/form/QuoteRequest/formperma/XXXXX/htmlRecords/submit`
   - Correct `name` attributes for each field (e.g. `Name_First`, `Email`, etc.)

5. Replace the contact `<div class="contact-form">` block in `index.html.html` with the form below.

> **Important:** Field `name` values in the example (`Name_First`, `Name_Last`, `Email`, etc.) are placeholders. Copy the exact `name` values from your Zoho Source Code export — do not guess.

**Complete replacement for `index.html.html` contact form:**

```html
<form
  class="contact-form reveal"
  action="YOUR_ZOHO_SUBMIT_URL_FROM_STEP_4"
  method="POST"
  accept-charset="UTF-8"
>
  <div class="form-row">
    <div class="f-group">
      <label>First Name</label>
      <input type="text" name="Name_First" placeholder="Your first name" required>
    </div>
    <div class="f-group">
      <label>Last Name</label>
      <input type="text" name="Name_Last" placeholder="Your last name" required>
    </div>
  </div>
  <div class="f-group">
    <label>Work Email</label>
    <input type="email" name="Email" placeholder="you@yourcompany.com" required>
  </div>
  <div class="f-group">
    <label>Company Name</label>
    <input type="text" name="SingleLine" placeholder="Your company name">
  </div>
  <div class="f-group">
    <label>What Do You Need Help With?</label>
    <select name="Dropdown" required>
      <option value="">Choose a service...</option>
      <option value="Software Development">Software Development</option>
      <option value="UI/UX Design">UI/UX Design</option>
      <option value="Digital Marketing">Digital Marketing</option>
      <option value="Brand Identity">Brand Identity</option>
      <option value="Product Strategy">Product Strategy</option>
      <option value="IT Staffing">IT Staffing</option>
      <option value="More than one service">More than one service</option>
    </select>
  </div>
  <div class="f-group">
    <label>Tell Us More</label>
    <textarea name="MultiLine" placeholder="What are you trying to achieve? What's your timeline and rough budget?"></textarea>
  </div>
  <button type="submit" class="btn-submit">Send My Free Quote Request →</button>
</form>
```

**Key changes from current `index.html.html`:**

| Change | Why |
|---|---|
| `<div class="contact-form">` → `<form class="contact-form">` | Enables real submission |
| Add `action="ZOHO_URL"` and `method="POST"` | Posts data to Zoho |
| Add `name="..."` on every input, select, textarea | Zoho maps fields by `name` |
| `<button>` → `<button type="submit">` | Triggers form POST |
| Add `value` on `<option>` elements | Sends correct dropdown value |

6. After submit, Zoho redirects to its thank-you page. To return users to your site:
   - In Zoho: **Settings** → **Thank You Page** → **Redirect to website**
   - URL: `https://yourdomain.com/#contact?submitted=true`

7. **Optional success message** — add before `</body>` in `index.html.html`:

```html
<script>
  if (new URLSearchParams(window.location.search).get('submitted') === 'true') {
    alert('Thank you! We received your request and will get back to you within 24 hours.');
  }
</script>
```

**Why not AJAX?** Direct browser `fetch`/AJAX to Zoho is blocked by CORS. A standard `<form method="POST">` works without JavaScript and is the recommended approach.

---

### Option B — Embed Zoho Form (Fastest, Different Look)

1. In Zoho Forms, go to **Share** → **Embed** → **Iframe**.
2. Copy the iframe code Zoho provides.
3. Replace the `<div class="contact-form">...</div>` block in `index.html.html` (lines 1679–1701) with the iframe.
4. In Zoho's **Theme** settings, adjust colors to match your site:
   - Primary color: `#2A44E6`
   - Background: `#F5F7FF`
   - Font: Poppins (if available)

**Pros:** No code changes, works immediately.  
**Cons:** Harder to match your exact layout and styling.

---

### Option C — AJAX + Custom Thank-You (Needs a Backend)

If you want submit without leaving the page:

- Browser AJAX to Zoho is usually blocked by **CORS**.
- Use a small backend (Node.js, PHP, Cloudflare Worker, etc.) that receives the form and forwards it to Zoho's submit URL.
- Only choose this if you need in-page success messages without a redirect.

**Flow:**

```
User submits → Your server → Zoho POST URL → Email to sales@qubrisource.com
```

---

## Step 5 — Update index.html.html (Option A Checklist)

1. Open `index.html.html` and find the `#contact` section (around line 1679).
2. Replace `<div class="contact-form reveal">` with `<form class="contact-form reveal" action="ZOHO_URL" method="POST" accept-charset="UTF-8">`.
3. Close with `</form>` instead of `</div>`.
4. Add `name` attributes from Zoho's HTML export to every field.
5. Change `<button class="btn-submit">` to `<button type="submit" class="btn-submit">`.
6. Add `required` on First Name, Last Name, Work Email, and the service dropdown (optional but recommended).
7. Rename `index.html.html` → `index.html` before deploying to your web server.

**Do not change** the surrounding contact section — only replace the form block:

```html
<!-- Keep these unchanged -->
<section id="contact">
  <div class="section-chip reveal">Get a Free Quote</div>
  <h2 class="section-h2 reveal">...</h2>
  <p class="section-p reveal">...</p>

  <!-- Replace only this block -->
  <form class="contact-form reveal" ...>...</form>

  <!-- Keep these unchanged -->
  <div class="contact-alts reveal">...</div>
</section>
```

---

## Step 6 — Test End-to-End

1. **Publish** the form in Zoho (**Share** → form must be **Published/Live**).
2. Open your site locally or on your server (use a real URL if testing redirect).
3. Fill in all fields with test data and submit.
4. Confirm:
   - [ ] Entry appears in **Zoho Forms → Entries**
   - [ ] Email arrives at **sales@qubrisource.com**
   - [ ] Thank-you page or redirect works as expected
   - [ ] Auto-reply email sent to submitter (if enabled)
5. Submit again with missing required fields to verify validation works.
6. Check spam/junk folder if notification email does not arrive.

---

## Step 7 — Optional Extras

| Feature | Where in Zoho |
|---|---|
| Spam protection | Settings → CAPTCHA (reCAPTCHA / hCaptcha) |
| Zoho CRM leads | Integrations → Zoho CRM → map fields |
| Slack/Teams alert | Integrations → Webhooks |
| Analytics | Built-in form reports |
| Custom domain | Settings → Domain mapping (paid plans) |
| File uploads | Add File Upload field in form builder |

---

## Quick Reference: What You Need from Zoho

After creating the form, copy these from **Share → Source Code**:

| Item | Where to find it |
|---|---|
| Form action URL | `action="https://forms.zohopublic.com/.../htmlRecords/submit"` |
| Field `name` values | Each `<input name="...">` in the exported HTML |
| Thank-you redirect URL | Settings → Thank You Page → Redirect URL |

---

## Summary

| Step | Action |
|---|---|
| 1 | Create Zoho Forms account + blank form |
| 2 | Add fields matching the 6 inputs in `index.html.html` |
| 3 | Email notifications → `sales@qubrisource.com` |
| 4 | Get HTML source / submit URL from Share (Option A recommended) |
| 5 | Replace contact `<div>` with `<form>` using correct `action` and `name`s |
| 6 | Test submission + email delivery |
| 7 | Add CAPTCHA, CRM, or webhooks as needed |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Form submits but no email | Check Zoho Email Notifications; verify `sales@qubrisource.com` spelling |
| CORS error with AJAX | Use normal `<form method="POST">` instead of fetch/AJAX |
| Wrong field data in Zoho | `name` attributes must match Zoho export exactly |
| Redirect does not work | Use full `https://` URL in Zoho thank-you settings |
| Form not found (404) | Ensure form is **Published** in Zoho |
| Styling looks wrong after change | Keep `class="contact-form reveal"` on the `<form>` element — existing CSS applies to it |
