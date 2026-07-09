#!/usr/bin/env node
// Small Buttondown admin CLI. No deps — uses Node's built-in fetch + --env-file.
//
// Usage (run from repo root, `--env-file=.env` loads the API key):
//   node --env-file=.env scripts/buttondown.mjs get <email>
//   node --env-file=.env scripts/buttondown.mjs reactivate <email>          # type -> regular
//   node --env-file=.env scripts/buttondown.mjs create <email>              # upsert (overwrite) as regular
//   node --env-file=.env scripts/buttondown.mjs set-type <email> <type>     # e.g. unsubscribed
//   node --env-file=.env scripts/buttondown.mjs set-meta <email> key=value [key=value ...]

const API = "https://api.buttondown.com/v1";
const KEY = process.env.BUTTONDOWN_API_KEY;

if (!KEY || KEY === "paste-your-key-here") {
  console.error("Missing BUTTONDOWN_API_KEY. Put it in .env and run with --env-file=.env");
  process.exit(1);
}

const headers = {
  Authorization: `Token ${KEY}`,
  "Content-Type": "application/json",
};

async function api(method, path, body, extraHeaders) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { ...headers, ...extraHeaders },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    console.error(`${method} ${path} -> ${res.status}`);
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }
  return data;
}

const [cmd, email, ...rest] = process.argv.slice(2);

if (!cmd || !email) {
  console.error("Usage: <get|reactivate|set-type|set-meta> <email> [args]");
  process.exit(1);
}

const enc = encodeURIComponent(email);

switch (cmd) {
  case "get": {
    const s = await api("GET", `/subscribers/${enc}`);
    console.log(JSON.stringify({ email_address: s.email_address, type: s.type, metadata: s.metadata }, null, 2));
    break;
  }
  case "reactivate": {
    const s = await api("PATCH", `/subscribers/${enc}`, { type: "regular" });
    console.log(`OK — ${s.email_address} is now type "${s.type}"`);
    break;
  }
  case "create": {
    // Upsert past a suppressed/hard-deleted record: overwrite collision behavior.
    const s = await api("POST", `/subscribers`, { email_address: email, type: "regular" }, {
      "X-Buttondown-Collision-Behavior": "overwrite",
    });
    console.log(`OK — ${s.email_address} created/overwritten as type "${s.type}"`);
    break;
  }
  case "set-type": {
    const type = rest[0];
    if (!type) { console.error("set-type needs a type, e.g. regular | unsubscribed"); process.exit(1); }
    const s = await api("PATCH", `/subscribers/${enc}`, { type });
    console.log(`OK — ${s.email_address} is now type "${s.type}"`);
    break;
  }
  case "set-meta": {
    if (rest.length === 0) { console.error("set-meta needs key=value pairs"); process.exit(1); }
    const metadata = Object.fromEntries(rest.map((pair) => {
      const i = pair.indexOf("=");
      if (i === -1) { console.error(`Bad pair "${pair}" — expected key=value`); process.exit(1); }
      return [pair.slice(0, i), pair.slice(i + 1)];
    }));
    const s = await api("PATCH", `/subscribers/${enc}`, { metadata });
    console.log(`OK — metadata now: ${JSON.stringify(s.metadata)}`);
    break;
  }
  default:
    console.error(`Unknown command "${cmd}"`);
    process.exit(1);
}
