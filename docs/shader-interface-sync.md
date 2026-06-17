# Shader Interface Sync

Skenion must keep shader uniform names separate from value types.

```text
port id   = shader-facing semantic name, such as speed, enabled, iterations, tint
port type = data contract, such as number.f32, boolean, number.i32, color.rgba
```

`u_value` and `u_color` are temporary fixed-port demo names. They are not types.
The long-term fullscreen shader UI should read like:

```text
speed      : number.f32
enabled    : boolean
iterations : number.i32
tint       : color.rgba
```

## Intended Dynamic Flow

Dynamic shader interface sync is intentionally not part of the typed value
semantics milestone. The intended next model is:

```text
WGSL source annotations or metadata
  -> shader interface analyzer
  -> inferred node input ports
  -> reviewed Studio diff
  -> graph patch that replaces the shader node interface
```

Example future annotation block:

```wgsl
// @skenion.uniform speed number.f32
// @skenion.uniform enabled boolean
// @skenion.uniform iterations number.i32
// @skenion.uniform tint color.rgba
```

Generated ports:

```text
speed      value<number.f32>
enabled    value<boolean>
iterations value<number.i32>
tint       value<color.rgba>
out        resource<gpu.texture2d>
```

## Patch Boundary

The sync operation should be explicit. Studio can show a proposed interface diff
and then apply a graph patch such as a future `replaceNodeInterface` operation.
When ports disappear, invalid edges must be removed or rejected explicitly.
There is no implicit adapter insertion.
