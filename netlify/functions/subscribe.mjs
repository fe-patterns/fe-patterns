// Newsletter subscribe proxy (Netlify Functions v2).
//
// Keeps the Buttondown API key server-side and returns JSON the blog can render
// inline, so readers never leave the site. On success it sets a first-party
// cookie (nl_subscribed) as a soft, per-browser "already subscribed" hint — no
// signature: this is a purely static site, nothing server-side verifies it, and
// tampering only lets a visitor hide their own form. See docs/newsletter-setup.md.
//
// Requires the BUTTONDOWN_API_KEY environment variable set in Netlify.

export const config = { path: "/api/subscribe" };

const ONE_YEAR = 60 * 60 * 24 * 365;

export default async (req) => {
  if (req.method !== "POST") {
    return json({ status: "error", message: "Method not allowed." }, 405);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json({ status: "error", message: "Malformed request." }, 400);
  }

  const email = String(payload.email ?? "").trim();
  const firstName = String(payload.first_name ?? "").trim();
  if (!email) {
    return json({ status: "error", message: "Please enter an email address." }, 400);
  }

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    return json(
      { status: "error", message: "Newsletter is temporarily unavailable." },
      500,
    );
  }

  let res, data;
  try {
    res = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        ...(firstName ? { metadata: { first_name: firstName } } : {}),
      }),
    });
    data = await res.json().catch(() => ({}));
  } catch {
    return json(
      { status: "error", message: "Couldn't reach the newsletter service. Try again." },
      502,
    );
  }

  if (res.ok) {
    // Double opt-in may be on, so phrase success as "check your inbox".
    return json({ status: "subscribed" }, 200, subscribedCookie());
  }

  // Buttondown returns 400 with a machine-readable `code` for these cases.
  const code = data.code ?? "";
  if (code === "email_already_exists") {
    return json({ status: "already_subscribed" }, 200, subscribedCookie());
  }
  if (code === "subscriber_suppressed") {
    return json(
      {
        status: "error",
        message:
          "This address previously unsubscribed and can't be re-added automatically.",
      },
      200,
    );
  }

  // Unknown validation error — surface Buttondown's own message if present.
  return json(
    {
      status: "error",
      message: data.detail || "Something went wrong. Please try again.",
    },
    200,
  );
};

function subscribedCookie() {
  return {
    "Set-Cookie": `nl_subscribed=1; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax; Secure`,
  };
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}
