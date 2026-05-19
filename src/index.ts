interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Comic Vine MCP.
 */


const BASE = 'https://comicvine.gamespot.com/api';
const UA = 'pipeworx-mcp-comicvine/1.0 (+https://pipeworx.io)';

const listShape = {
  type: 'object' as const,
  properties: {
    filter: { type: 'string', description: 'name:foo,id:1,2' },
    sort: { type: 'string' },
    limit: { type: 'number' },
    offset: { type: 'number' },
  },
};

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Multi-resource search.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        resources: { type: 'string', description: 'Comma-sep resource types.' },
        limit: { type: 'number' },
        page: { type: 'number' },
      },
      required: ['query'],
    },
  },
  { name: 'characters', description: 'Character list.', inputSchema: listShape },
  { name: 'character', description: 'Character detail.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'issues', description: 'Issue list.', inputSchema: listShape },
  { name: 'issue', description: 'Issue detail.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'volumes', description: 'Volume list.', inputSchema: listShape },
  { name: 'volume', description: 'Volume detail.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'people', description: 'Creators.', inputSchema: listShape },
  { name: 'person', description: 'Creator detail.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'publishers', description: 'Publishers.', inputSchema: listShape },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Comic Vine requires an API key. Set PLATFORM_COMICVINE_KEY or pass ?_apiKey=… (free at https://comicvine.gamespot.com/api/).');
  const get = async (path: string, extra?: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams({ api_key: apiKey, format: 'json' });
    if (extra) for (const [k, v] of Object.entries(extra)) if (v != null) p.set(k, String(v));
    const res = await fetch(`${BASE}${path}?${p}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (res.status === 401 || res.status === 403) throw new Error('Comic Vine: invalid API key.');
    if (!res.ok) throw new Error(`Comic Vine: ${res.status}`);
    return res.json();
  };
  const listExtra = (a: Record<string, unknown>): Record<string, string | number | undefined> => ({
    filter: a.filter as string | undefined,
    sort: a.sort as string | undefined,
    limit: a.limit as number | undefined,
    offset: a.offset as number | undefined,
  });
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'search':
      return get('/search/', {
        query: reqStr(args, 'query', '"batman"'),
        resources: args.resources as string | undefined,
        limit: args.limit as number | undefined,
        page: args.page as number | undefined,
      });
    case 'characters':
      return get('/characters/', listExtra(args));
    case 'character':
      return get(`/character/4005-${reqNum('id', '1699')}/`);
    case 'issues':
      return get('/issues/', listExtra(args));
    case 'issue':
      return get(`/issue/4000-${reqNum('id', '1')}/`);
    case 'volumes':
      return get('/volumes/', listExtra(args));
    case 'volume':
      return get(`/volume/4050-${reqNum('id', '796')}/`);
    case 'people':
      return get('/people/', listExtra(args));
    case 'person':
      return get(`/person/4040-${reqNum('id', '1')}/`);
    case 'publishers':
      return get('/publishers/', listExtra(args));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
