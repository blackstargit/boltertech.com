/**
 * Emits a JSON-LD block, server-rendered into the HTML so crawlers and
 * answer engines see it without executing anything.
 *
 * The schema objects are built in src/lib/schema-org.ts from our own JSON
 * and MDX frontmatter — never from request input. Those files are still
 * edited by people who are not thinking about HTML, though, so `<` is
 * escaped: a stray `</script>` in a project title or a founder bio would
 * otherwise close the tag early and put the remaining text into the
 * document as markup.
 */
function serialize(schema: object | object[]) {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

export function JsonLd({ schema }: { schema: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(schema) }}
    />
  );
}
