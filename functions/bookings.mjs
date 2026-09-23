import { getStore } from "@netlify/blobs";

const store = getStore("zann-meeting-slots");
const ALLOWED = {
  "900AM": true,
  "930AM": true,
  "1000AM": true,
  "1030AM": true,
  "1100AM": true,
  "1130AM": true,
  "1200PM": true,
  "1230PM": true,
  "100PM": true,
  "130PM": true
};

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

function validSlot(slot) {
  var parts = String(slot || "").split("_");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parts[0]) || !ALLOWED[parts[1]]) return false;
  var date = new Date(parts[0] + "T12:00:00Z");
  var day = date.getUTCDay();
  return day !== 0 && day !== 6;
}

export default async function handler(req) {
  if (req.method === "GET") {
    const listed = await store.list();
    const slots = (listed.blobs || []).map(function (blob) { return blob.key; });
    return json({ slots: slots });
  }

  let body = {};
  try {
    body = await req.json();
  } catch (error) {
    return json({ ok: false }, 400);
  }

  const slot = String(body.slot || "");
  if (!validSlot(slot)) return json({ ok: false }, 400);

  if (req.method === "DELETE") {
    const saved = await store.get(slot, { type: "json" });
    if (!saved) return json({ ok: true });
    if (saved.email !== String(body.email || "")) return json({ ok: false }, 403);
    await store.delete(slot);
    return json({ ok: true });
  }

  if (req.method !== "POST") return json({ ok: false }, 405);

  const record = {
    meeting_day: String(body.meeting_day || ""),
    meeting_time: String(body.meeting_time || ""),
    doctor_name: String(body.doctor_name || ""),
    clinic_name: String(body.clinic_name || ""),
    email: String(body.email || ""),
    phone: String(body.phone || "")
  };
  if (!record.doctor_name || !record.email) return json({ ok: false }, 400);

  const result = await store.set(slot, JSON.stringify(record), { onlyIfNew: true });
  if (!result.modified) return json({ ok: false, taken: true }, 409);
  return json({ ok: true });
}

export const config = { path: "/api/bookings" };
