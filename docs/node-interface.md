# Node Interface

Skenion nodes are declared through typed input and output ports.

A node interface must describe both:

- what kind of data moves through the port
- how that data moves over time

This keeps a boolean value distinct from a bang event, and keeps a video stream
distinct from a single image or texture resource.

## Node Shape

A graph node instance has:

- `id`: stable graph-local node id
- `kind`: stable node kind id such as `core.value` or `render.pass`
- `params`: persistent node parameters
- `inputs`: input port declarations
- `outputs`: output port declarations

Node kinds may also be defined in a registry later, but graph documents should
be able to carry a resolved interface snapshot for validation, migration, and
offline tooling.

## Port Shape

Each port has:

- `id`: stable port id within the node
- `type`: payload and flow type
- optional `label`
- optional `required`
- optional `default`

Example:

```json
{
  "id": "out",
  "label": "Output",
  "type": {
    "flow": "sampled",
    "kind": "number.float64",
    "unit": "seconds"
  }
}
```

## Flow Types

`flow` describes delivery semantics.

| Flow | Meaning |
| --- | --- |
| `constant` | Value is stable until changed by graph state or parameters. |
| `sampled` | One value is produced or consumed per runtime evaluation tick/frame. |
| `stream` | Continuous media or block data such as video frames or audio buffers. |
| `event` | Discrete event delivery; may have no durable value. |
| `resource` | Handle or reference to a runtime resource such as texture, mesh, or asset. |

## Data Kinds

`kind` describes payload semantics. Initial recommended kind ids:

| Kind | Typical Flow | Meaning |
| --- | --- | --- |
| `number.float64` | `constant`, `sampled` | Scalar number. |
| `number.int64` | `constant`, `sampled` | Integer number. |
| `boolean` | `constant`, `sampled` | Boolean value. |
| `string` | `constant`, `sampled` | UTF-8 string value. |
| `bang` | `event` | Momentary trigger event, not a boolean. |
| `matrix.float32` | `constant`, `sampled`, `stream` | Numeric matrix. |
| `video.frame` | `stream` | Video frame stream. |
| `audio.buffer` | `stream` | Audio sample buffer stream. |
| `texture.2d` | `resource` | GPU texture resource handle. |
| `mesh` | `resource` | Geometry resource handle. |
| `color.rgba` | `constant`, `sampled` | RGBA color value. |
| `time` | `sampled` | Runtime time value. |
| `asset.ref` | `resource` | Content-addressed asset reference. |

The kind namespace is intentionally extensible. Built-in kinds should use
documented names. Plugin kinds should use reverse-DNS or package-qualified names
once plugin contracts are defined.

## Bang Is Not Boolean

A boolean has a current value:

```text
true / false
```

A bang has occurrence:

```text
trigger happened at this evaluation point
```

They can be converted explicitly by nodes such as:

- `logic.rising_edge`: boolean sampled input to bang event output
- `logic.toggle`: bang event input to boolean sampled output

Implicit conversion between boolean and bang should be avoided because it hides
time semantics.

## Compatibility Rules

Two ports are directly connectable only when:

- output `flow` is compatible with input `flow`
- output `kind` is compatible with input `kind`
- shape, channel count, sample rate, or unit constraints match when declared

Automatic coercion should be explicit in the graph as an adapter node. Examples:

- number to string
- matrix element type conversion
- sampled value to held constant
- boolean edge detection to bang
- video frame to texture resource

## Scheduling Implications

The scheduler should use port flow to choose evaluation behavior:

- `constant`: recompute only when dependencies or params change
- `sampled`: evaluate on graph tick/frame
- `stream`: use bounded queues and drop/flow-control policies
- `event`: preserve ordering within the event lane
- `resource`: track lifetime, ownership, and device locality

Preview and media stream backpressure must not block control messages or graph
state updates.
