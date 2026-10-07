import assert from 'node:assert/strict';
import test from 'node:test';
import {
  startStdioWithApi,
  callExpectingError,
} from './helpers/exchange-mcp.mjs';

test('knowledgeGraph is forwarded as an API format for scrape and search', async (t) => {
  const { api, client } = await startStdioWithApi(t);
  const options = { entityTypes: ['Person', 'Organization'] };
  const tools = (await client.request('tools/list', {})).tools;
  const crawl = tools.find((tool) => tool.name === 'firecrawl_crawl');
  assert.ok(crawl.inputSchema.properties.scrapeOptions.properties.knowledgeGraphOptions);

  const scrape = await client.request('tools/call', {
    name: 'firecrawl_scrape',
    arguments: {
      url: 'https://example.com',
      formats: ['knowledgeGraph'],
      knowledgeGraphOptions: options,
    },
  });
  assert.notEqual(scrape.isError, true, JSON.stringify(scrape));
  assert.deepEqual(api.requests.at(-1).body.formats, [
    { type: 'knowledgeGraph', ...options },
  ]);
  assert.equal(api.requests.at(-1).body.knowledgeGraphOptions, undefined);

  const search = await client.request('tools/call', {
    name: 'firecrawl_search',
    arguments: {
      query: 'Ada Lovelace',
      scrapeOptions: { formats: ['knowledgeGraph'], knowledgeGraphOptions: options },
    },
  });
  assert.notEqual(search.isError, true, JSON.stringify(search));
  assert.deepEqual(api.requests.at(-1).body.scrapeOptions.formats, [
    { type: 'knowledgeGraph', ...options },
  ]);
  assert.equal(api.requests.at(-1).body.scrapeOptions.knowledgeGraphOptions, undefined);
});

test('knowledgeGraph rejects oversized entity allow-lists before sending to the API', async (t) => {
  const { api, client } = await startStdioWithApi(t);
  const before = api.requests.length;
  await callExpectingError(client, {
    name: 'firecrawl_scrape',
    arguments: {
      url: 'https://example.com',
      formats: ['knowledgeGraph'],
      knowledgeGraphOptions: {
        entityTypes: Array.from({ length: 51 }, (_, i) => `Type${i}`),
      },
    },
  });
  assert.equal(api.requests.length, before);
});
