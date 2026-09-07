import company from "../../data/company.json";
import founders from "../../data/founders.json";
import services from "../../data/services.json";
import faqs from "../../data/faqs.json";
import process_ from "../../data/process.json";

/**
 * Typed accessors for the JSON data files. Components import from here
 * rather than reaching into data/ directly, so the shape is checked in
 * one place and the files stay editable by non-developers.
 */
export const site = company;
export const team = founders;
export const serviceLines = services;
export const faqList = faqs;

export type Company = typeof company;
export type Founder = (typeof founders)[number];
export type ServiceLine = (typeof services)[number];
export type Faq = (typeof faqs)[number];

/**
 * Office location, embedded on the contact page.
 *
 * OpenStreetMap's own embed widget, not Google Maps: no API key to manage
 * and no cookies, so it doesn't reopen the "cookieless analytics" question
 * (no consent banner, no cookie policy). `address.lat`/`lng` in
 * company.json is the Mehran Business Square pin from Google's own place
 * data (resolved from the office's Google Maps share link), not a guess.
 * The printed, copyable address text next to the map is exact regardless.
 */
const MAP_SPAN = 0.008; // ~800m across, enough to show the surrounding block
const { lat, lng } = company.address;
export const officeMapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
  [lng - MAP_SPAN, lat - MAP_SPAN, lng + MAP_SPAN, lat + MAP_SPAN].join(","),
)}&layer=mapnik&marker=${lat}%2C${lng}`;

/**
 * "Open in Google Maps" beside the embed above. The office's own Google
 * Maps share link, not a reconstructed search query — it's the verified
 * Mehran Business Square place, not whatever Google's geocoder makes of
 * the address text. A plain outbound link, not an embed, so it sets no
 * cookies of its own and doesn't touch the cookieless-analytics decision
 * the way an inline Google iframe would.
 */
export const googleMapsUrl = company.address.googleMapsUrl;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://boltertech.com";

export const processSteps = process_;
export type ProcessStep = (typeof process_)[number];
