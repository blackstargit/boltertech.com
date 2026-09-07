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
 * company.json pin the Top City-1 area rather than the exact plaza — there
 * is no rooftop-accurate location for the building in open map data. The
 * printed, copyable address text next to the map is exact regardless.
 */
const MAP_SPAN = 0.008; // ~800m across, enough to show the surrounding block
const { lat, lng } = company.address;
export const officeMapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
  [lng - MAP_SPAN, lat - MAP_SPAN, lng + MAP_SPAN, lat + MAP_SPAN].join(","),
)}&layer=mapnik&marker=${lat}%2C${lng}`;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://boltertech.com";

export const processSteps = process_;
export type ProcessStep = (typeof process_)[number];
