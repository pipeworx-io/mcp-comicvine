# @pipeworx/comicvine

[Comic Vine](https://comicvine.gamespot.com/api/) MCP — comics database (characters, issues, volumes, creators). Free key (200 req/hr).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Comicvine data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
