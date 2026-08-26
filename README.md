# @pipeworx/comicvine

[Comic Vine](https://comicvine.gamespot.com/api/) MCP — comics database (characters, issues, volumes, creators). Free key (200 req/hr).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Auth

- Platform: `PLATFORM_COMICVINE_KEY`. BYO: `?_apiKey=…`.

## Tools

- `search(query, resources?, limit?, page?)` — multi-resource search
- `characters(filter?, sort?, limit?, offset?)` — character list
- `character(id)` — character detail
- `issues(filter?, sort?, limit?, offset?)` — issue list
- `issue(id)` — issue detail
- `volumes(filter?, sort?, limit?, offset?)` — volume (series) list
- `volume(id)` — volume detail
- `people(filter?, sort?, limit?, offset?)` — creators
- `person(id)` — creator detail
- `publishers(filter?, sort?, limit?, offset?)` — publishers

`resources` (search): `character,comic,episode,issue,location,movie,person,publisher,series,story_arc,team,thing,video,volume`.

## Data source

`https://comicvine.gamespot.com/api`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "comicvine": {
      "url": "https://gateway.pipeworx.io/comicvine/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/comicvine/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Comicvine data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
