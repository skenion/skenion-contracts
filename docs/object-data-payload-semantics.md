# Object/Data Payload Semantics Inventory

Issue: skenion/skenion-contracts#174.

Contracts v0.1 draws this boundary:

- `node.kind` identifies executable behavior with ports, state, and diagnostics.
- Port `type`, `accepts`, `messageSelectors`, control atoms, and resources identify payload semantics.
- Runtime owns dispatch, state mutation, ordering, and execution. Contracts only expose the metadata Runtime needs.

## Inventory And Disposition

| Surface | Files/Symbols | Disposition |
| --- | --- | --- |
| Control message selector and atom payloads | `json-schema/control/v0.1/control-message.schema.json`, `ControlMessageV01`, `ControlAtomV01`, `packages/rust/src/v0_1/control_message.rs` | Keep as payload shape. Selectors and atoms are messages, not node identities. |
| Selector acceptance metadata | `messageSelectors` in `json-schema/graph/v0.1/graph.schema.json`, `json-schema/node/v0.1/node-definition.schema.json`, `json-schema/object-text/v0.1/parse-result.schema.json`, `MessageSelectorPolicyV01` | Keep and tighten. Selector lists must be non-empty selector strings; validators require selector policy on selector-aware input ports. |
| Port payload acceptance metadata | `PortSpecV01.accepts`, object-text `instancePorts[].accepts`, graph edge validation | Keep as payload compatibility metadata. It must not be copied into `node.kind`. |
| Legacy/generic value port aliases | `message.any`, `number.float`, `number.int`, `number.uint`, `boolean`, `color`, `string`, `value.*`, `value<...>` in TS/Rust validators and invalid fixtures | Reject. Current graph/node contracts use canonical port types such as `control.number.float` and `control.message.any`. |
| Payload identity as executable node kind | `control.*`, `event.bang`, `asset.video`, `asset.image`, `asset.audio`, `gpu.texture2d`, `value.*`, `data.*`, `payload.*` when used as `graph.nodes[].kind` | Reject in graph and graph-fragment semantic validation. A payload type alone is not executable behavior. |
| Numeric/color stored-payload objects | `builtins/v0.1/nodes/core.float.node.json`, `core.int`, `core.uint`, `core.color` and matching help graphs | Keep conservatively for this slice only because removing current builtins is broader Runtime/Studio migration work. Do not treat them as precedent for payload-type object identity. |
| Bool/string payload-named objects | Former `builtins/v0.1/nodes/core.bool.node.json`, former `builtins/v0.1/nodes/core.string.node.json`, matching help and help graphs | Removed from builtin publication in this slice. `bool` and `string` are payload/atom semantics, not canonical object identities. If this behavior returns, it needs behavior-named object contracts such as a widget, toggle, label, text, or message object with explicit state/ports. |
| Message box object | `builtins/v0.1/nodes/core.message.node.json`, `docs/control-message-model.md` | Keep as executable message-box behavior. Its saved text emits a selector plus atoms; it is not a string-value node. |
| Bang object and event payload | `builtins/v0.1/nodes/core.bang.node.json`, `event.bang` port type | Keep separated. `core.bang` is executable behavior; `event.bang` is payload/event type and is rejected as a node kind. |
| Resource source objects and resource payloads | `core.video-asset`, `asset.video`, `gpu.texture2d`, video decode/upload/render nodes | Keep behavior/resource split. Source/decoder/uploader/render nodes are executable; `asset.video` and `gpu.texture2d` are payload/resource types and rejected as node kinds. |
| Object-text resolution state | `json-schema/object-text/v0.1/parse-result.schema.json`, `ObjectTextParseResultV01`, `parseObjectTextV01` / Rust parser | Keep. `resolvedKind` points to executable behavior; invalid payload identity object text should resolve to diagnostics rather than a payload node. |
| `core.unresolved-object` placeholder | `builtins/v0.1/nodes/core.unresolved-object.node.json`, matching help docs | Defer. Known transitional surface; issue direction is resolution diagnostics on object boxes rather than stabilizing a separate payload/data identity. |
