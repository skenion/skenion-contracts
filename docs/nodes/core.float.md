# core.float

`core.float` stores a `control.number.float` control payload.

Inputs:

- `in`: hot `control.message.any` inlet. A `control.number.float` payload updates
  and emits; `bang` emits the current stored payload; `set ...` updates silently.
- `cold`: cold inlet. A compatible payload updates silently.

Output:

- `value`: the current `control.number.float` payload.

The graph `params.value` is the saved default. Runtime control events may change the session value without changing the persisted graph.
