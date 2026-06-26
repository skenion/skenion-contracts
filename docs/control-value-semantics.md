# Control Value Semantics

skenion typed control objects are stateful control boxes. This document defines
the pre-v1 typed atom/control behavior used by built-in control objects and
runtime control events.

## Typed Control Objects

The canonical v0.1 typed control objects are:

- `core.float` for `control.number.float` payloads
- `core.int` for `control.number.int` payloads
- `core.uint` for `control.number.uint` payloads
- `core.bool` for `control.bool` payloads
- `core.color` for `control.color` payloads
- `core.string` for `control.string` payloads

Each typed control object has the same control surface:

- `in` is the hot `control.message.any` inlet. A compatible typed control
  payload updates the stored payload and emits it; `bang` emits the current
  stored payload; `set ...` updates silently.
- `cold` is the cold inlet. A compatible typed control payload updates the
  stored payload without emitting.
- `value` emits the current stored payload. The port id is payload/state naming;
  it does not make the object a value object.

`core.bool` is also the canonical toggle object when `params.widget` is
`"toggle"` or `"checkbox"`. In that widget mode, a `bang` interaction flips the
stored bool and emits the new payload. There is no separate toggle node.

This is the Max/MSP-style typed control box model:

```text
set 32
  -> store 32
  -> emit nothing

bang
  -> emit 32

in 12
  -> store 12
  -> emit 12
```

`bang` and `set` are selectors carried by `ControlMessage`. They are not
separate visual inlet ports.

## Graph Edits Versus Runtime Control

Graph mutation operations edit the artwork. Runtime control events perform the artwork.

Changing `params.value` through a graph mutation changes the saved graph document.
Sending a runtime control event changes only the loaded runtime session control
state. Runtime control events must not be serialized back into the graph as
patches unless a later user action explicitly edits the graph.

## Range Metadata

`control.number.float` is a generic floating-point control payload and must not globally imply
`0..1`. Range constraints belong to a specific shader uniform, UI widget,
clamp/map node, or later interface metadata. Runtime shader demos may clamp
values at the uniform extraction boundary, but the canonical `core.float`
builtin itself stays unconstrained.

## Comments And Messages

`core.comment` is a persisted graph annotation and runtime text object. It has
one hot `in` inlet for `control.message.any`. `set <text>` updates the runtime
display text silently. Inspector text edits remain saved graph mutations.

`core.message` is the first simple message-box form. It stores message box text
in graph params and emits a `ControlMessage` selector plus typed atoms when
banged or clicked. `set ...` on `in` updates the runtime message text silently.
`pack`/`unpack` and richer message transforms are deferred until the typed
control graph is stable.

Bang is a message selector and the pure trigger edge type `event.bang`. It is
not a stored runtime value and is not represented as `control.bang` or boolean
state.

Object-owned `sendName`/`receiveName` routing and widget controls are documented
in `docs/control-routing.md`.

## Pre-v1 Compatibility

This is a pre-v1 contract. Breaking built-in node shape changes are allowed
while skenion is still converging on the runtime/editor control model.

The previous generic value-object surface with separate visual `bang` and `set`
input ports is removed. Canonical typed control objects expose only `in`,
`cold`, and `value`; `bang` and `set` remain `ControlMessage.selector` values
handled by the receiving object.
