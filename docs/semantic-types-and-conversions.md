# Semantic Types And Conversions v0

skenion separates user-facing semantic value types from storage or transport
representations.

## Semantic Types

Canonical control port types describe the meaning of a value:

- `control.number.float`
- `control.number.int`
- `control.number.uint`
- `control.bool`
- `control.string`
- `control.color`
- `control.message.any`
- `event.bang`

Representation-specific names such as `number.f32`, `number.i32`, or
`color.rgba` are not canonical data kinds.

## Representations

Representations describe how a semantic value is stored or delivered:

- `control.number.float`: `f64`, `f32`, `f16`, `f8.e4m3`, `f8.e5m2`, `ufloat16`, `ufloat8`
- `control.number.int`: `i64`, `i32`, `i16`, `i8`
- `control.number.uint`: `u64`, `u32`, `u16`, `u8`
- `control.color`: `rgba32f`, `rgba16f`, `rgba8unorm`, `rgb8unorm`

Node definitions and graph instance ports may use `format` to declare the
chosen representation. If omitted, consumers should use the builtin default for
that semantic type.

## Implicit Conversion

Numeric and color types allow implicit representation conversion. The
conversion policy is deterministic:

- Overflow saturates to the target representation range.
- Float to int or uint clamps, sanitizes NaN/Inf, then truncates toward zero.
- Unsigned integer targets clamp negative values to zero.
- Narrowing float and color conversions may quantize.
- Color channel conversion clamps channels into the target representation range.

Conversion diagnostics should be shown in inspectors, debug views, or edge
metadata. The default canvas should not be flooded with warnings for expected
numeric/color conversions.

## Explicit Domain Crossings

Semantic conversion does not replace explicit domain-crossing nodes. Video,
audio, GPU resources, assets, and other runtime domains still require explicit
adapter or analysis nodes.
