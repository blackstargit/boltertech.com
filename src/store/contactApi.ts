import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ContactInput } from "@/lib/contact-schema";

/**
 * The site's only API surface.
 *
 * Everything else on boltertech.com is prerendered at build time and
 * fetches nothing, so this store exists purely for the contact form and
 * is mounted only inside it — Redux never enters the static pages.
 *
 * Adding a second endpoint (a newsletter signup, a demo request) is an
 * entry in `endpoints` below.
 */

export type ContactResponse = {
  ok: boolean;
  error?: string;
  fields?: Record<string, string[] | undefined>;
};

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    sendEnquiry: builder.mutation<ContactResponse, ContactInput>({
      query: (body) => ({
        url: "contact",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendEnquiryMutation } = contactApi;
