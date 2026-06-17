# Performance Mode

Performance Mode is a Studio presentation surface derived from a loaded
`ProjectDocument`. It is not a graph editing mode and it does not introduce a
new persisted graph schema in v0.

## Contract Boundaries

- `GraphDocument` remains the runtime and execution graph.
- `ViewState` remains Studio-owned canvas layout and viewport state.
- `ProjectDocument` keeps `graph`, `viewState`, and metadata together for
  project save/open workflows.
- Performance Mode reads `ProjectDocument.viewState` to place artist-facing
  controls, but it must not write graph patches for presentation interactions.

The v0 control surface is derived from existing `ui.*` graph nodes:

```text
ui.button
ui.slider-f32
ui.toggle
```

Those nodes are still normal graph nodes. Editing their labels, ranges,
defaults, or wiring remains graph editing. Interacting with them during
Performance Mode sends runtime control events.

## Runtime Interaction

Performance Mode control widgets use the existing Runtime HTTP control event
API:

```text
POST /v0/session/control/event
```

Control interaction must not create these persisted changes:

```text
addNode / removeNode
addEdge / removeEdge
setNodeParam
replaceNodeInterface
viewState mutation
```

The runtime session must already be loaded before controls can affect preview.
Opening a `.skenion.json` project may replace Studio's local `graph` and
`viewState`, but it must not automatically load Runtime. Users explicitly load
the current graph into the runtime session.

## Status Model

Studio can display these existing runtime fields in Performance Mode:

```text
Runtime connection status
Runtime session synced/not synced
Preview state and stale flag
controlRevision
previewControlRevision
controlLive
render frame count / FPS
runtime or shader diagnostics
```

Graph changes still make preview graph state stale. Runtime control events can
update the preview control state without making preview stale.

## Future Metadata Hint

A later ProjectDocument version may add an optional mode hint:

```json
{
  "metadata": {
    "preferredMode": "performance"
  }
}
```

This hint is not part of v0. Studio should keep Performance Mode selection as
local UI state for now.
