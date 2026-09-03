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

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://boltertech.com";

export const processSteps = process_;
export type ProcessStep = (typeof process_)[number];
