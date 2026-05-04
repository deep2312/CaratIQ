# CaratIQ

Production-focused React + Three.js frontend for ring try-on with MediaPipe Hands.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## System explanation

- **Scaling system**: carat converts to physical mm (shape-aware), then mm converts to pixels using either quick estimated finger-width mapping or accurate calibration sources.
- **Calibration logic**:
  - Quick mode: finger-width statistical estimate (approximate).
  - Accurate mode: either US ring size -> diameter mm mapping, or reference object conversion (credit card width 85.6mm) to compute pixel/mm.
- **Placement algorithm**:
  - Uses MediaPipe ring-finger MCP/PIP landmarks.
  - Ring anchor at MCP, orientation from MCP→PIP vector, tilt from landmark z-depth delta.
  - Ring size in pixels = stone width(mm) × pixel/mm.
