# Gravitational Field Visualization

A real-time spacetime curvature visualization for the OrreyApp solar system simulator. A wireframe grid on the orbital plane warps downward around celestial bodies, creating visible gravity wells — the classic general relativity "rubber sheet" analogy.

---

## How It Works

A flat wireframe grid sits on the XZ orbital plane (where planets orbit). Each frame, every vertex computes the combined gravitational potential from all 13 celestial bodies (Sun + 12 planets/dwarf planets) using the formula:

```
phi = SUM( log(1 + Mass / Distance) )  for each body
```

The vertex then displaces **downward along the Y-axis** proportional to `phi`. Massive bodies like the Sun create deep wells; smaller planets create subtle dips. The grid colors shift based on field strength — dark purple in flat regions, glowing cyan/white near gravity wells.

### Why `log(1 + M/r)` Instead of Raw `M/r`

Raw gravitational potential (`M/r`) makes the Sun dominate everything with a 30:1 ratio over Earth. The logarithmic compression reduces this to ~2:1, making **all planet wells visible** simultaneously while preserving relative scale.

---

## Grid Specifications

### Default Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| **Grid Size** | 250 units | Side length of the square grid (covers -125 to +125 from origin) |
| **Segments** | 150 per side | Number of subdivisions along each axis |
| **Total Vertices** | 22,801 | (150 + 1) x (150 + 1) = 151 x 151 |
| **Total Grid Cells** | 22,500 | 150 x 150 squares |
| **Grid Gap** | ~1.67 units | Distance between adjacent vertices (250 / 150) |
| **Total Wireframe Lines** | ~45,300 | Horizontal + vertical line segments |
| **Y Offset** | -1.0 unit | Base position below the orbital plane |
| **Well Depth** | 2.0 | Displacement multiplier for gravity wells |
| **Opacity** | 0.7 | Wireframe transparency |

### Planet Coverage at Default Grid Size (250 units)

| Planet | Distance from Sun (units) | Inside Grid? |
|--------|--------------------------|-------------|
| Mercury | ~3.9 | Yes |
| Venus | ~7.2 | Yes |
| Earth | ~10 | Yes |
| Mars | ~15 | Yes |
| Ceres | ~27 | Yes |
| Jupiter | ~52 | Yes |
| Saturn | ~96 | Yes |
| Uranus | ~192 | Slider up to 700 |
| Neptune | ~300 | Slider up to 700 |

---

## Color Gradient

Vertex colors map to gravitational field strength using a 4-stop gradient:

| Field Strength (t) | Color | RGB | Visual Effect |
|--------------------|-------|-----|---------------|
| 0.0 (flat) | Near-black purple | (0.02, 0.01, 0.08) | Below bloom threshold — invisible |
| 0.3 (weak field) | Dark teal | (0.10, 0.20, 0.35) | At bloom boundary — faint glow |
| 0.65 (medium field) | Bright cyan | (0.30, 0.80, 1.00) | Blooms nicely — visible wells |
| 1.0 (deep well) | White | (1.00, 1.00, 1.00) | Strong bloom glow — well center |

The existing **UnrealBloomPass** (threshold: 0.1, strength: 0.3) naturally makes gravity wells glow. Flat regions stay invisible, wells glow progressively brighter.

---

## Controls

### Toggle ON/OFF

Two synced methods to enable/disable the gravity field:

1. **Navbar Button** — "Gravity Field" button in the top navigation bar
   - Glows cyan/purple when active
   - Click to toggle on/off

2. **GUI Checkbox** — "Show Field" checkbox in the Gravity Field folder (top-right panel)

Both stay in sync — toggling one updates the other. **Default: OFF**.

### GUI Sliders (in "Gravity Field" folder)

| Control | Range | Default | Description |
|---------|-------|---------|-------------|
| **Show Field** | on/off | off | Toggle gravity field visibility |
| **Well Depth** | 0.5 - 10.0 | 2.0 | Exaggeration multiplier for well displacement depth |
| **Opacity** | 0.1 - 1.0 | 0.7 | Wireframe transparency |
| **Grid Size** | 40 - 700 | 250 | Side length of the grid in world units (updates on slider release) |

---

## Functionality

### Real-Time Updates

- The grid updates **every frame** (~60 FPS) to track moving planets
- As planets orbit, their gravity wells follow in real-time
- The field responds to all 13 celestial bodies simultaneously

### Mode Behavior

- **Overview Mode**: Full grid visible around the solar system. Shows wells for Sun and all planets within grid range.
- **Galactic Travel Mode**: Grid remains visible near Earth and Sun. Provides educational context — you can see the satellite moving through gravity wells, explaining why its trajectory curves.

### Singularity Protection

Vertex displacement is clamped with `max(distance, 0.5)` to prevent infinite displacement when a vertex is exactly at a body's position. The clamp value (0.5) is smaller than the smallest planet radius.

### Per-Frame Normalization

The maximum potential (`maxPhi`) is recalculated each frame. This ensures:
- Consistent displacement range regardless of planet positions
- Full color gradient utilization at all times
- No visual popping as planets enter/leave the grid

---

## Performance

| Metric | Value |
|--------|-------|
| **Vertices per frame** | 22,801 |
| **Distance calculations per frame** | ~296,413 (22,801 vertices x 13 bodies) |
| **sqrt + log calls per frame** | ~296,413 |
| **Estimated CPU time** | ~1-3ms per frame |
| **GPU overhead** | Minimal (single wireframe mesh) |

### Optimizations Applied

- **Skip when hidden**: Entire update computation is skipped when `visible = false`
- **Pre-extracted body positions**: Planet positions copied to plain objects before the vertex loop (avoids Three.js getter chains)
- **Pre-allocated arrays**: `basePositions` Float32Array and `_bodies` array reused each frame
- **Inlined color ramp**: No function calls inside the hot loop (~296K iterations)
- **`frustumCulled = false`**: Skips bounding box check (grid is always partially visible)
- **`depthWrite = false`**: Saves GPU fill-rate; planets always render on top of the grid
- **`DoubleSide` rendering**: Grid visible from both above and below the orbital plane

---

## File Structure

| File | Role |
|------|------|
| `gravity_field.js` | `GravityField` class — grid creation, vertex displacement, color mapping |
| `main.js` | Integration — import, construction, GUI controls, animation loop update |
| `index.html` | Navbar toggle button, toggle function, button styling |

### Class API (`GravityField`)

```javascript
constructor(scene, options)    // Create grid and add to scene
update(sun, planets)           // Recompute vertex positions + colors (called per frame)
setVisible(visible)            // Show/hide the grid
setStrength(strength)          // Set well depth multiplier
setGridSize(newSize)           // Rebuild grid with new dimensions
dispose()                      // Remove from scene and free GPU memory
```

---

## Technical Details

### Geometry Construction

1. A `THREE.PlaneGeometry` is created on the default XY plane
2. Vertices are remapped to the XZ plane: Y coordinates become Z, Y is set to `yOffset`
3. Original flat XZ positions are stored in `basePositions` for reuse each frame
4. Only the Y coordinate is recomputed per frame (displacement)

### Material Properties

```
Type:         MeshBasicMaterial
Wireframe:    true
Vertex Colors: true (RGB per vertex, updated each frame)
Transparent:  true
Opacity:      0.7 (adjustable)
Depth Write:  false (prevents z-fighting with planets)
Side:         DoubleSide (visible from above and below)
```

### Update Algorithm (per frame)

```
Pass 1: For each vertex
  - Read base XZ position from stored flat grid
  - For each of 13 bodies:
      distance = max(sqrt((vx - bx)^2 + (vz - bz)^2), 0.5)
      phi += log(1 + mass / distance)
  - Track maximum phi across all vertices

Pass 2: For each vertex
  - Normalize: t = phi / maxPhi  (0 to 1)
  - Set Y = yOffset - t * strength  (displacement)
  - Set vertex color from gradient using t

Mark position and color buffers for GPU upload
```

---

## Dependencies

No additional dependencies. Uses the same `Three.js 0.129.0` from Skypack CDN that all other modules use.
