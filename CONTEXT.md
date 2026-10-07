# MCP server context

_Date: 2026-10-07_

_Anchors:_ `src/index.ts::buildFormatsArray`, `src/index.ts::transformScrapeParams`, `src/index.ts::scrapeParamsSchema`

**Knowledge graph format:** this server translates the optional `knowledgeGraph` tool format and `knowledgeGraphOptions.entityTypes` into the Firecrawl API's `{ type: "knowledgeGraph", entityTypes }` format. It does not extract or merge entities itself. The KG-enabled Firecrawl API fork owns generation and graph integrity; pointing this MCP fork at standard hosted Firecrawl may result in an unsupported-format error.

**Shared scrape options:** the scrape tool and nested scrape options in full-surface search and crawl reuse `scrapeParamsSchema` and `transformScrapeParams`. The hosted search-only surface exposes `firecrawl_scrape` but intentionally does not allow `scrapeOptions` on `firecrawl_search` (see `docs/search-profile.md`). The published search-only tool-name set remains fixed.
