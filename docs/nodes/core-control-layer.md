# Core Control Layer Nodes

The core control layer establishes the basic Max/MSP-style patching surface for
typed payloads and simple control annotations.

## Typed Control Objects

`core.float`, `core.int`, `core.uint`, `core.bool`, `core.color`, and
`core.string` share the same stored-payload surface:

- `in`: hot `control.message.any` inlet; typed controls update and emit,
  `bang` emits the stored payload, and `set ...` updates silently
- `cold`: cold inlet; compatible typed control payloads update silently
- `value`: output the current stored payload. The port id is payload/state
  naming, not a value-object contract.

`core.bool` is also the canonical toggle object when `params.widget` is
`"toggle"` or `"checkbox"`. In that widget mode, `bang` sent to `in` flips the
stored bool and emits the new payload. Typed control objects may also use
`sendName` and `receiveName` graph params for named typed routing.

## Message And Comment

`core.message` is a Max/Pd-like message box. Click or `bang` on `in` emits its
saved payload. `set <message>` on `in` updates runtime message state silently.
Inspector text edits remain saved graph mutations.

`core.comment` documents the patch as a text annotation. It receives
`control.message.any` on `in`; `set <text>` updates runtime display text
silently. It has no output. Inspector text edits remain saved graph mutations.

`core.panel` groups controls visually. It receives `control.message.any` on
`in`; `set <hex>` updates runtime panel color silently. It has no output.
Inspector color edits remain saved graph mutations.

## UI Widgets

Buttons, sliders, toggles, and compact number boxes are widget modes on
canonical core objects. `core.bang` is the button-like bang object, `core.float`
with `widget: "slider"` is the float slider, and `core.bool` with
`widget: "toggle"` is the bool toggle. Standalone routing nodes are not part
of the builtin object model.

## Addressing

Control panels can address graph params and runtime state by node address, for
example `node:float_1/param:value` or `node:float_1/state:value`. Graph
execution must use explicit graph edges rather than hidden address reads.
