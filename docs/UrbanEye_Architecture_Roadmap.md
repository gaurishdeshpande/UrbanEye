# 🏙️ UrbanEye — AI-Powered Environmental Building Simulation Platform
## Expert Product Architecture & Implementation Roadmap

> **Document Version:** 1.0 | **Prepared:** April 2026  
> **Project Stage:** Pre-Development → Production-Ready  
> **Core Vision:** A professional, web-based simulation intelligence platform that enables architects, urban planners, real estate developers, and sustainability consultants to analyze building-level environmental interactions — solar, wind, rain, heat, and terrain — before construction, using 3D models, real-world geospatial data, and AI-driven insights.

---

## 📖 Table of Contents

1. [Product Vision & Philosophy](#1-product-vision--philosophy)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Data Layer Architecture](#3-data-layer-architecture)
4. [Simulation Engine Architecture](#4-simulation-engine-architecture)
5. [AI Intelligence Layer](#5-ai-intelligence-layer)
6. [Frontend Architecture & UX System](#6-frontend-architecture--ux-system)
7. [Backend API Architecture](#7-backend-api-architecture)
8. [Technology Stack](#8-technology-stack)
9. [Screen Flow & UX Map](#9-screen-flow--ux-map)
10. [Phase-by-Phase Implementation Plan](#10-phase-by-phase-implementation-plan)
11. [Data Sources & Integration Contracts](#11-data-sources--integration-contracts)
12. [Performance & Scalability Strategy](#12-performance--scalability-strategy)
13. [Testing & Quality Assurance](#13-testing--quality-assurance)
14. [DevOps & Deployment Pipeline](#14-devops--deployment-pipeline)
15. [Risk Register](#15-risk-register)

---

## 1. Product Vision & Philosophy

### 1.1 What UrbanEye Is

UrbanEye is a **building-level environmental simulation intelligence platform** — not a GIS tool, not a BIM viewer, not a weather dashboard. It is the intersection of all three, fused with physics simulation and AI reasoning.

The core user experience is: **"I have a building design. I want to understand exactly how the environment will interact with it."**

### 1.2 Inspiration from Industry Leaders

| Reference | What UrbanEye Borrows |
|---|---|
| **Cyclops (Foster + Partners)** | GPU-based ray-tracing for solar analysis; analysis points / sampling grids; daylight, radiation, sunlight-hour, shading mask concepts; geometry + environment object model |
| **Hektar.ai** | AI narrative generation from simulation outputs; scenario comparison; multi-parameter overlay; subscription SaaS model |
| **QGIS** | Geospatial data handling philosophy; raster/vector processing concepts; CRS-aware coordinate transforms; DEM processing pipelines |

### 1.3 North Star Metrics

- **Time to first simulation:** < 3 minutes from model upload to rendered result
- **Simulation accuracy:** ±5% of industry-standard tools (EnergyPlus, Radiance)
- **User NPS:** > 50 (professional tooling standard)
- **Supported model formats:** GLB, GLTF, IFC, OBJ
- **Max building polygon count:** 500,000 faces in-browser at 60 fps

### 1.4 Design Philosophy

UrbanEye is "**BIM meets GIS meets AI, in the browser**". Every design decision must be:
- **Precision-first** — data must be scientifically grounded
- **Context-aware** — analysis is always in relation to surroundings (OSM context, terrain, neighbors)
- **Actionable** — every simulation result must have a linked design recommendation
- **Performant** — GPU-accelerated, WebGL-powered, worker-threaded pipelines

---

## 2. System Architecture Overview

### 2.1 High-Level Layered Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          URBANEYE PLATFORM                                   │
│                                                                               │
│  ┌──────────────────────────┐    ┌─────────────────────────────────────────┐ │
│  │     PRESENTATION LAYER   │    │          INTELLIGENCE LAYER              │ │
│  │  React + Three.js/WebGL  │    │  AI Insight Engine + Recommendation LLM  │ │
│  │  Interactive 3D Viewer   │    │  Pattern Recognition + Anomaly Detection  │ │
│  │  Dashboard & Reports     │<-->│  Design Score Engine                     │ │
│  └──────────┬───────────────┘    └──────────────────────┬──────────────────┘ │
│             │                                            │                    │
│  ┌──────────▼───────────────────────────────────────────▼──────────────────┐ │
│  │                      API GATEWAY (REST + WebSocket)                      │ │
│  │             Authentication │ Rate Limiting │ Job Queue                    │ │
│  └──────────┬───────────────────────────────────────────┬──────────────────┘ │
│             │                                            │                    │
│  ┌──────────▼──────────────┐   ┌────────────────────────▼──────────────────┐ │
│  │   SIMULATION SERVICE    │   │          DATA SERVICE                      │ │
│  │  ┌──────────────────┐   │   │  ┌────────────┐  ┌──────────────────────┐ │ │
│  │  │  Solar Engine    │   │   │  │ OSM Fetch  │  │ Weather  Aggregator   │ │ │
│  │  │  Wind Engine     │   │   │  │ DEM Fetch  │  │ NASA POWER API        │ │ │
│  │  │  Rain Engine     │   │   │  │ Geocoder   │  │ OpenWeather / Meteo   │ │ │
│  │  │  Heat Engine     │   │   │  └────────────┘  └──────────────────────┘ │ │
│  │  │  Terrain Engine  │   │   └───────────────────────────────────────────┘ │
│  │  └──────────────────┘   │                                                  │
│  │  ┌──────────────────┐   │   ┌───────────────────────────────────────────┐ │
│  │  │ Geometry Engine  │   │   │          STORAGE LAYER                     │ │
│  │  │ IFC/GLB Parser   │   │   │  PostgreSQL + PostGIS │ Redis Cache        │ │
│  │  └──────────────────┘   │   │  Object Store (S3-compatible) for models   │ │
│  └─────────────────────────┘   └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Request Flow: End-to-End

```
User Uploads Model  →  Model Parser (GLB/IFC)  →  Geometry Store
       │                                                │
       ▼                                                ▼
Set Location (Lat/Lng)  →  Data Service  →  OSM Context + DEM + Weather
       │                                                │
       ▼                                                ▼
Configure Simulation  →  Job Queue  →  Simulation Workers (Solar/Wind/Rain/Heat/Terrain)
       │                                                │
       ▼                                                ▼
Results → AI Insight Engine → Scoring + Recommendations → Frontend Visualization
       │
       ▼
  Report Generator (PDF)
```

---

## 3. Data Layer Architecture

### 3.1 External Data Sources

| Source | Data Type | Usage | API Endpoint | Update Freq |
|--------|-----------|-------|-------------|-------------|
| **OpenStreetMap** (Overpass API) | Building footprints + heights | Context buildings, shadow interactions | `overpass-api.de/api/interpreter` | On demand |
| **NASA SRTM v3** | Digital Elevation Model (30m) | Terrain height, slope, runoff | `opentopography.org` | Static |
| **Copernicus DEM** | High-res DEM (10m) | Precision terrain analysis | `dataspace.copernicus.eu` | Static |
| **NASA POWER API** | Solar irradiance, TMY data | Solar calculations, radiation | `power.larc.nasa.gov/api` | Monthly |
| **OpenWeather API** | Current + forecast weather | Wind speed/direction, rainfall rates | `api.openweathermap.org` | Hourly |
| **Meteostat** | Historical climate data | Long-term averages, seasonal analysis | `meteostat.net/api` | Daily |
| **Open-Meteo** | Free weather + solar data | Primary free weather source | `api.open-meteo.com` | Hourly |

### 3.2 Data Pipeline Architecture

```
Raw External Data
      │
      ▼
┌─────────────────────────────────────────────────────────┐
│                   DATA INGESTION LAYER                   │
│  Rate limiter │ Retry logic │ Response cache (Redis TTL) │
│  Schema validation │ Coordinate transform (EPSG:4326)    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  DATA NORMALIZATION LAYER                │
│  OSM → GeoJSON FeatureCollection                        │
│  SRTM → Tiled Float32 heightmap (PNG/raw binary)        │
│  Weather → Normalized WeatherProfile object             │
│  Solar → Hourly irradiance array + sun-position table   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     GEOSPATIAL STORE                     │
│   PostGIS (vector) │ GeoTIFF cache (raster DEM)         │
│   Tile cache for OSM context (GeoJSON by bbox)          │
└─────────────────────────────────────────────────────────┘
```

### 3.3 OSM Context Processing

```javascript
// Context radius around building footprint
const OSM_CONTEXT_RADIUS_METERS = 500;

// OSM query structure (Overpass QL)
[out:json];
(
  way["building"](bbox: ${south},${west},${north},${east});
  relation["building"](bbox: ...);
);
out body geom;

// Building height inference:
// Priority 1: building:height tag (meters)
// Priority 2: building:levels * 3.2m (standard floor height)
// Priority 3: Default 6m (2 floors) for untagged
```

### 3.4 DEM Processing Pipeline

```
Raw SRTM HGT/GeoTIFF
      │
      ▼
Clip to site bbox + 1km buffer
      │
      ▼
Reproject to local CRS (UTM zone)
      │
      ▼
Generate heightmap (Float32Array, normalized 0-1)
      │
      ├──> Slope calculation (Sobel gradient filter)
      ├──> Aspect calculation (orientation of slope)
      ├──> Drainage basin modeling (D8 flow direction algorithm)
      └──> Three.js PlaneGeometry displacement map
```

---

## 4. Simulation Engine Architecture

### 4.1 Architecture Pattern: Engine Registry

Each simulation engine is a **self-contained, isolated module** following this interface:

```typescript
interface SimulationEngine<TInput, TOutput> {
  name: string;
  version: string;
  validate(input: TInput): ValidationResult;
  prepare(input: TInput): PreparedScene;
  simulate(scene: PreparedScene): Promise<TOutput>;
  normalize(output: TOutput): NormalizedSimulationResult;
}
```

All engines write to a shared `SimulationResultStore` keyed by `projectId + simulationType + timestamp`.

---

### 4.2 Solar Engine (Sun & Shadow)

**Scientific Basis:** NOAA Solar Position Algorithm (SPA) for accurate sun azimuth/altitude at any lat/lng/time.

**Inputs:**
- Latitude, Longitude, Timezone
- Date range + time step (hourly, default)
- Building geometry (mesh)
- Context buildings geometry

**Algorithm:**
```
For each time step t:
  1. Calculate sun position (azimuth α, altitude β) via SPA algorithm
  2. Compute sun direction vector D = [cos(β)sin(α), sin(β), cos(β)cos(α)]
  3. Cast shadow rays from analysis grid downward
  4. Per grid cell: record if in shadow (ray intersects geometry above)
  5. Accumulate shadow hours across all timesteps
  6. Calculate: Direct Solar Radiation (W/m²) per surface face
  7. Calculate: kWh/m²/year cumulative radiation per face

Key metrics:
  - Shadow frequency map (0-100% shaded per cell/hour)
  - Annual solar radiation heatmap (kWh/m² · year)
  - Peak solar exposure hours (hours/day receiving direct sun)
  - Shading Mask (% sky blocked at each analysis point)
  - Sunlight Obstruction from context buildings
```

**Inspiration from Cyclops:** Sunlight Hour analysis, Radiation analysis, Shading Mask, Sun Rig (sky dome approach with hemisphere sampling — measure what % of the sky hemisphere is visible from each point).

**Implementation:** Three.js raycasting + WebWorker parallelism. For GPU acceleration: custom GLSL shader doing shadow ray intersection pass.

---

### 4.3 Wind Engine

**Scientific Basis:** Simplified CFD (Computational Fluid Dynamics) using potential flow theory + turbulence modeling.

**Inputs:**
- Prevailing wind speed (m/s) and direction (degrees from North)
- Seasonal wind rose data from weather API
- Building geometry (mesh surfaces)
- Context buildings

**Algorithm:**
```
1. Define wind inlet boundary (upwind of building, 2× building height away)
2. Initialize velocity field on a 3D grid (resolution: 2m × 2m × 2m cells)
3. Apply building geometry as solid obstacles (no-slip boundary condition)
4. Solve simplified Navier-Stokes via iterative relaxation (Jacobi method):
   - Advection: velocity transport through grid
   - Pressure solve: maintain incompressibility (∇·v = 0)
   - Diffusion: viscosity effects
5. Run 50-100 iterations per simulation (convergence threshold: Δv < 0.01 m/s)
6. Extract:
   - Wind vector field (direction + magnitude per cell)
   - Vorticity map (identifies turbulent zones)
   - Channeling effect zones (wind speed acceleration between buildings)
   - Dead zones (sheltered, low-airflow areas)
   - Ventilation potential per surface/facade

Key metrics:
  - Wind comfort score per zone (Lawson criteria: Pedestrian, Sitting, Standing)
  - Wind pressure on facades (Pa)
  - Natural ventilation potential
  - Channeling risk zones (wind speed > 2× ambient)
```

**Rendering:** Animated particle system (Three.js PointsMaterial) flowing along wind vector field. Color-coded by speed (cyan → dark blue).

---

### 4.4 Rain Engine

**Scientific Basis:** Catchment hydrology + kinematic wave routing.

**Inputs:**
- Rainfall intensity (mm/hr) from weather data (10-year return period by default)
- Wind speed/direction (for wind-driven rain)
- Terrain heightmap
- Building geometry (roof slope angles, surface areas)

**Algorithm:**
```
Phase 1: Wind-Driven Rain on Facades
  1. Compute rain angle = arctan(wind_speed / terminal_velocity_rain_drop)
     (terminal velocity of raindrop ≈ 7-9 m/s depending on drop size)
  2. For each facade face: calculate oblique rain intensity based on face normal vs. rain angle
  3. Mark facade exposure zones

Phase 2: Roof Drainage
  1. For each roof surface: use slope + area to calculate Q = rain_intensity × area × C
     (C = runoff coefficient: concrete 0.90, green roof 0.30, glass 0.85)
  2. Identify drainage points (lowest point per connected roof surface)

Phase 3: Ground Surface Flow
  1. Use DEM + D8 algorithm to route water downslope pixel by pixel
  2. Accumulate flow at each cell: flow_acc = upstream_cells × rainfall_mm
  3. Map accumulation zones → puddle/flooding risk areas
  4. Apply building footprints as impervious barriers → route around

Phase 4: Interaction Zones
  1. Identify where roof runoff meets ground (splash zones)
  2. Flag areas of concentrated soil erosion risk
  3. Identify drainage inadequacy zones

Key metrics:
  - Roof drainage stress score
  - Ground flooding risk map (low/medium/high)
  - Facade weather exposure index
  - Runoff volume (m³/hr)
```

**Rendering:** Animated blue particle paths along flow lines. Heatmap overlay on terrain for accumulation zones.

---

### 4.5 Heat Engine (Thermal Mapping)

**Scientific Basis:** Simplified Urban Heat Island (UHI) model + surface energy balance.

**Inputs:**
- Ambient air temperature (°C) from weather API
- Solar radiation results (from Solar Engine — prerequisite)
- Material properties per surface (albedo, emissivity, thermal mass)
- Context building density (Urban Density Factor → UDF)

**Algorithm:**
```
Surface Temperature Calculation:
  T_surface = T_air + (Q_solar × (1 - albedo)) / h_c
  where:
    Q_solar = absorbed solar radiation (W/m²) from Solar Engine
    albedo = material reflectivity (concrete: 0.25, glass: 0.10, green: 0.20)
    h_c = convective heat transfer coefficient (function of wind speed)
         h_c ≈ 5.6 + 4.0 × wind_speed (m/s) for flat surfaces

Material Database (built-in):
  ┌─────────────────────┬────────┬────────────┬───────────────┐
  │ Material            │ Albedo │ Emissivity │ Thermal Mass  │
  ├─────────────────────┼────────┼────────────┼───────────────┤
  │ Concrete            │  0.25  │    0.90    │ High          │
  │ Dark Asphalt        │  0.05  │    0.95    │ High          │
  │ Light Brick         │  0.40  │    0.90    │ High          │
  │ Glass (clear)       │  0.10  │    0.84    │ Low           │
  │ Green Roof          │  0.20  │    0.95    │ Medium        │
  │ White Roof          │  0.70  │    0.90    │ Low           │
  │ Metal (aluminum)    │  0.60  │    0.05    │ Low           │
  └─────────────────────┴────────┴────────────┴───────────────┘

UHI Multiplier: Applied based on urban density
  - Dense urban (FAR > 3.0): +3.5°C baseline
  - Suburban (FAR 1.0–3.0): +1.5°C baseline
  - Low density (FAR < 1.0): +0.5°C baseline

Thermal Comfort Zones:
  - UTCI (Universal Thermal Climate Index) calculated per outdoor zone
  - Categories: No Stress / Moderate Heat / Strong Heat / Very Strong / Extreme
```

**Rendering:** Per-vertex color mapping (Blue → Yellow → Orange → Red) on the 3D mesh and ground plane. Time-animated thermal changes across the day.

---

### 4.6 Terrain Engine

**Scientific Basis:** DEM-based geomorphological analysis (QGIS-equivalent operations, run server-side).

**Inputs:**
- DEM raster (Float32, reprojected to local UTM)
- Building footprint
- Rainfall data (for runoff modeling)

**Operations:**
```
1. Slope Map: Sobel filter on DEM → slope angle (degrees) per pixel
   Critical thresholds: < 5° (flat), 5°-15° (gentle), 15°-30° (moderate), > 30° (steep)

2. Aspect Map: Wind exposure direction per terrain cell

3. Viewshed Analysis: From key building points, what terrain/skyline is visible?

4. Cut and Fill: For a proposed foundation level z:
   Cut volume = Σ (DEM - z) × cell_area for cells where DEM > z
   Fill volume = Σ (z - DEM) × cell_area for cells where DEM < z

5. Flow Accumulation (D8 algorithm):
   - Assign flow direction to each DEM cell (direction of steepest descent)
   - Accumulate upslope contributing area per cell
   - High accumulation = natural drainage channels → flooding risk

6. Contour Generation: Marching squares algorithm → GeoJSON LineString contours

Key metrics:
  - Site suitability score (buildability index)
  - Earthwork estimate (cut/fill volumes in m³)
  - Drainage adequacy rating
  - Foundation risk zones (soft/unstable terrain indicators)
```

---

### 4.7 Simulation Orchestration Engine

```typescript
class SimulationOrchestrator {
  async runProject(projectId: string, config: SimulationConfig) {
    const context = await this.dataService.fetchContext(config.location);
    const geometry = await this.geometryEngine.parse(config.modelFile);
    
    // Define dependency graph
    const jobs = [
      { engine: 'terrain', deps: [] },
      { engine: 'solar', deps: [] },
      { engine: 'wind', deps: [] },
      { engine: 'rain', deps: ['terrain', 'solar'] },  // rain needs terrain + wind-driven from solar
      { engine: 'heat', deps: ['solar', 'wind'] },     // heat needs solar radiation + wind convection
    ];
    
    // Execute in dependency order, parallel where possible
    await this.executeDAG(jobs, { context, geometry, config });
    
    // Run AI insight engine after all simulations complete
    await this.aiEngine.analyze(projectId);
  }
}
```

---

## 5. AI Intelligence Layer

### 5.1 Architecture

The AI layer is a **reasoning + pattern-matching system** that converts raw simulation numbers into human-readable, actionable intelligence.

```
Simulation Results (JSON)
         │
         ▼
┌────────────────────────────────────────────────────────┐
│              AI INSIGHT ENGINE                          │
│                                                         │
│  1. Anomaly Detector: Flag values outside norms        │
│     (e.g., shadow > 8h/day on S-facing facade → alert)│
│                                                         │
│  2. Pattern Recognizer: Cross-engine correlations      │
│     (e.g., wind dead zone + rain accumulation zone     │
│      = high moisture/mold risk)                        │
│                                                         │
│  3. Benchmark Comparator: vs. regional best practice   │
│     (e.g., solar radiation vs. Typical Meteorological  │
│      Year for the city)                                │
│                                                         │
│  4. Design Score Calculator: 0-100 per domain          │
│  5. LLM Recommendation Generator (GPT-4 API/local)    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
         Structured Insight Cards + Priority Actions
```

### 5.2 Insight Card Schema

```typescript
interface InsightCard {
  id: string;
  engine: 'solar' | 'wind' | 'rain' | 'heat' | 'terrain' | 'combined';
  severity: 'critical' | 'warning' | 'opportunity' | 'info';
  title: string;              // "Severe Wind Channeling on North Facade"
  description: string;        // Human-readable explanation (LLM-generated)
  metric: {
    value: number;
    unit: string;
    benchmark: number;        // Regional norm or design standard
    delta: number;            // % deviation from benchmark
  };
  affectedZones: GeoJSON[];   // Highlighted zones in 3D view
  recommendations: Recommendation[];
  confidence: number;         // 0-1 (based on data quality + model resolution)
}

interface Recommendation {
  type: 'design_change' | 'material_change' | 'orientation' | 'vegetation' | 'structural';
  action: string;             // "Rotate building 15° clockwise"
  expectedImprovement: string; // "Reduces wind pressure on west facade by ~30%"
  difficulty: 'easy' | 'medium' | 'complex';
  priority: number;           // 1 (highest) - 5 (lowest)
}
```

### 5.3 Scoring Algorithm

```
Domain Score (0-100) = weighted sum of sub-scores:

Solar Score:
  - Solar access (% of south facade receiving >4h direct sun): 30 pts
  - Glare risk (% of openings with high radiation): -20 pts max
  - Shading effectiveness (summer vs winter shading ratio): 30 pts
  - PV potential (kWh/m²/yr on available roof area): 20 pts

Wind Score:
  - Pedestrian comfort (% area in "comfortable" Lawson category): 40 pts
  - Natural ventilation potential: 30 pts  
  - Wind pressure on facades (structural consideration): 30 pts

Rain Score:
  - Roof drainage efficiency: 40 pts
  - Ground flooding risk: 40 pts
  - Facade weathering exposure: 20 pts

Heat Score:
  - Mean UTCI in outdoor spaces: 40 pts
  - Surface temperature extremes: 30 pts
  - Urban Heat Island contribution: 30 pts

Terrain Score:
  - Foundation suitability: 50 pts
  - Drainage adequacy: 30 pts
  - Cut/Fill efficiency: 20 pts

Overall Environmental Score = 
  Solar×0.25 + Wind×0.20 + Rain×0.20 + Heat×0.20 + Terrain×0.15
```

### 5.4 LLM Integration Strategy

- **Primary:** OpenAI GPT-4 API for narrative generation (recommendation text)
- **Fallback:** Local rule-based template engine (no external API needed)
- **Prompt pattern:** Structured data → JSON-in → Markdown narrative out
- LLM only generates *text*; all numbers come from deterministic simulation engines

---

## 6. Frontend Architecture & UX System

### 6.1 Component Architecture

```
src/
├── app/
│   ├── layout.tsx                   # Root layout, theme provider
│   ├── router.tsx                   # App routing
│   └── store/                       # Global state (Zustand)
│       ├── projectStore.ts
│       ├── simulationStore.ts
│       └── uiStore.ts
├── screens/
│   ├── Landing/                     # Marketing homepage
│   ├── ProjectSetup/                # Location + model upload
│   ├── ProjectDashboard/            # Multi-project overview
│   ├── MainAnalysisHub/             # Primary analysis workspace
│   ├── SunShadow/                   # Solar analysis module
│   ├── WindAnalysis/                # Wind simulation module
│   ├── RainAnalysis/                # Rain/drainage module
│   ├── HeatMapping/                 # Thermal analysis module
│   ├── TerrainDrainage/             # Terrain module
│   ├── CombinedAnalysis/            # Multi-layer overlay
│   ├── ComparisonMode/              # A/B design comparison
│   └── ReportExport/                # PDF report generation
├── components/
│   ├── viewer/
│   │   ├── ThreeViewer.tsx          # Core Three.js canvas wrapper
│   │   ├── BuildingMesh.tsx         # Building geometry renderer
│   │   ├── ContextMesh.tsx          # OSM context buildings
│   │   ├── TerrainMesh.tsx          # DEM-displaced terrain
│   │   ├── SimulationOverlay.tsx    # Heatmap/vector field overlay
│   │   ├── SunPath.tsx              # Sun path arc visualization
│   │   ├── WindParticles.tsx        # Animated wind particles
│   │   ├── RainParticles.tsx        # Rain flow particles
│   │   └── AnalysisGrid.tsx         # Sampling grid (Cyclops-inspired)
│   ├── panels/
│   │   ├── ControlPanel.tsx         # Left sidebar controls
│   │   ├── InsightPanel.tsx         # Right sidebar insights
│   │   ├── TimeSlider.tsx           # Temporal animation control
│   │   ├── LayerToggle.tsx          # Show/hide simulation layers
│   │   └── MetricCard.tsx           # KPI display card
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Slider.tsx
│   │   ├── ColorLegend.tsx          # Gradient scale legend
│   │   ├── InsightCard.tsx
│   │   └── ScoreGauge.tsx           # Domain score circular gauge
│   └── reports/
│       ├── ReportLayout.tsx
│       ├── SimulationSnapshot.tsx   # Canvas-to-image capture
│       └── PDFExporter.tsx          # jsPDF integration
├── engines/                         # Client-side simulation (lightweight)
│   ├── sunPosition.ts               # SPA algorithm (browser)
│   ├── shadowCast.ts                # Three.js raycasting
│   └── colorMapping.ts             # Value → color gradient
├── services/
│   ├── api.ts                       # Backend API client
│   ├── modelLoader.ts               # GLTFLoader / IFCLoader
│   ├── osmService.ts                # Overpass API client
│   └── weatherService.ts           # Weather API client
└── utils/
    ├── geoUtils.ts                  # Coordinate transforms (proj4js)
    ├── colorScales.ts               # Domain-specific color ramps
    └── formatters.ts                # Number/unit formatting
```

### 6.2 Three.js Scene Architecture

```
THREE.Scene
├── AmbientLight (soft global illumination)
├── DirectionalLight (sun simulation — position updates in real-time)
├── Group: "terrain"
│   └── PlaneGeometry (subdivided) with displacement map (DEM)
├── Group: "context_buildings"
│   └── ExtrudedPolygons[] from OSM GeoJSON (low detail, gray)
├── Group: "target_building"
│   └── GLTF/GLB mesh (full detail, material-assigned)
├── Group: "simulation_overlay"
│   ├── Analysis Grid Points (InstancedMesh for performance)
│   ├── Heatmap Plane (ShaderMaterial with data texture)
│   └── Wind Arrow Instances (InstancedMesh)
├── Group: "sun_path"
│   └── SunPathArc (LineSegments) + SunSphere (Sphere moving along arc)
├── Group: "particles"
│   ├── WindParticleSystem (Points)
│   └── RainParticleSystem (Points)
└── Group: "ui_helpers"
    ├── CompassRose (always-on orientation)
    ├── ScaleBar
    └── NorthArrow
```

### 6.3 Shader Strategy

| Simulation Type | Rendering Method |
|---|---|
| Solar Radiation | Data texture (Float32 UVs) → custom ShaderMaterial (value → gradient color) |
| Shadow Frequency | Per-vertex attribute coloring on analysis grid |
| Wind Field | Animated StreamLine shader + particle advection |
| Heat Map | Vertex color interpolation on a subdivided ground plane |
| Rain Accumulation | Fragment shader with animated blue texture flow |
| Terrain Slope | Normal-map derived coloring on terrain mesh |

---

## 7. Backend API Architecture

### 7.1 API Routes

```
POST /api/projects                    # Create new project
GET  /api/projects/:id                # Get project details
PUT  /api/projects/:id                # Update project settings
DELETE /api/projects/:id              # Delete project

POST /api/projects/:id/model          # Upload 3D model (multipart)
GET  /api/projects/:id/model          # Get processed model data

POST /api/projects/:id/context        # Fetch OSM + DEM + weather context
GET  /api/projects/:id/context        # Get stored context

POST /api/projects/:id/simulate       # Trigger simulation run (all engines)
POST /api/projects/:id/simulate/:type # Trigger specific engine
GET  /api/projects/:id/simulate/status # Polling endpoint for progress

GET  /api/projects/:id/results        # All simulation results
GET  /api/projects/:id/results/:type  # Specific engine results

GET  /api/projects/:id/insights       # AI insight cards
GET  /api/projects/:id/score          # Environmental scores

GET  /api/projects/:id/comparison/:b  # Compare two project versions

POST /api/projects/:id/report         # Generate PDF report
GET  /api/projects/:id/report/:rId    # Download generated report
```

### 7.2 Simulation Job Queue Architecture

```
Client Request → API Gateway → Job Queue (Redis/Bull)
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         │                                                       │
    Worker Pool (Node.js cluster / Python workers for physics)
         │
    Per Job:
    ├── Fetch dependencies from Data Service
    ├── Load geometry from Object Store
    ├── Run simulation (CPU/GPU intensive)
    ├── Store results to PostgreSQL
    ├── Push progress via WebSocket to client
    └── Trigger AI analysis when all complete

Progress Events (WebSocket):
  { type: 'progress', engine: 'solar', percent: 45, message: 'Calculating shadow hours...' }
  { type: 'complete', engine: 'solar', resultId: '...', duration: 12300 }
  { type: 'error', engine: 'wind', message: 'Geometry too complex', code: 'E001' }
```

### 7.3 Data Models (Database Schema)

```sql
-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  user_id UUID,
  location GEOGRAPHY(POINT, 4326),
  address TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Models (uploaded 3D files)
CREATE TABLE models (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  file_name VARCHAR(255),
  file_format VARCHAR(10), -- 'glb', 'gltf', 'ifc', 'obj'
  object_store_key TEXT,   -- S3-compatible path
  parsed_geometry JSONB,   -- Extracted faces/vertices summary
  bounds GEOGRAPHY,        -- Bounding box
  face_count INTEGER,
  created_at TIMESTAMPTZ
);

-- Context data per project location
CREATE TABLE site_context (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  context_buildings JSONB,    -- GeoJSON FeatureCollection
  dem_data_key TEXT,          -- Object store ref to DEM raster
  weather_profile JSONB,      -- Normalized weather object
  solar_profile JSONB,        -- Hourly irradiance + sun position table
  fetched_at TIMESTAMPTZ
);

-- Simulation results
CREATE TABLE simulation_results (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  engine_type VARCHAR(50),    -- 'solar', 'wind', 'rain', 'heat', 'terrain'
  version INTEGER,
  status VARCHAR(20),         -- 'pending', 'running', 'complete', 'failed'
  config JSONB,               -- Input parameters used
  result_data JSONB,          -- Aggregated metrics
  result_grid_key TEXT,       -- Object store ref to grid data (large)
  domain_score DECIMAL(5,2),  -- 0-100
  duration_ms INTEGER,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- AI Insights
CREATE TABLE insights (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  simulation_result_ids UUID[],
  insight_cards JSONB,        -- Array of InsightCard objects
  overall_score DECIMAL(5,2),
  generated_at TIMESTAMPTZ
);
```

---

## 8. Technology Stack

### 8.1 Frontend

| Category | Technology | Rationale |
|---|---|---|
| Framework | **React 18 + TypeScript** | Component model, ecosystem, type safety |
| Build Tool | **Vite 5** | Fast HMR, native ESM |
| 3D Rendering | **Three.js r165** | Battle-tested WebGL abstraction, large ecosystem |
| 3D Framework | **React Three Fiber** | Declarative Three.js in React |
| GLB/GLTF Loader | **Three.js GLTFLoader** | Native support |
| IFC Loader | **IFC.js (web-ifc)** | Parse IFC in browser via WASM |
| State Management | **Zustand** | Lightweight, perfect for 3D app state |
| Routing | **React Router v6** | SPA routing |
| Styling | **Vanilla CSS + CSS Variables** | Max control, theme support, no runtime overhead |
| Typography | **Google Fonts: Inter + Outfit** | Professional, legible |
| Charts | **Recharts** | Environmental data charts |
| Map Context | **Mapbox GL JS / Leaflet** | Location picker + OSM display |
| PDF Export | **jsPDF + html2canvas** | Client-side PDF generation |
| Geo Projections | **proj4js** | Coordinate transforms in browser |
| Animations | **Framer Motion** | Page transitions + panel animations |

### 8.2 Backend

| Category | Technology | Rationale |
|---|---|---|
| Runtime | **Node.js 20 LTS** | JS/TS full stack |
| Framework | **Fastify** | High-performance, TypeScript-native |
| Heavy Simulation | **Python 3.11 workers** | NumPy, SciPy for CFD + DEM processing |
| ORM | **Prisma** | Type-safe DB access |
| Job Queue | **BullMQ (Redis)** | Reliable async job processing |
| WebSocket | **Socket.io** | Real-time simulation progress |
| File Storage | **MinIO (self-hosted S3)** | Model + result file storage |
| Geospatial DB | **PostgreSQL 15 + PostGIS** | Spatial queries |
| Cache | **Redis** | API response cache, session, job queue |
| AI API | **OpenAI GPT-4 API** | Recommendation text generation |

### 8.3 DevOps & Infrastructure

| Category | Technology |
|---|---|
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | Vercel (frontend) + Railway/Render (backend) |
| Cloud GPU (future) | Modal.com or Replicate (Python GPU workers) |
| Monitoring | Sentry (errors) + PostHog (analytics) |
| API Docs | OpenAPI 3.0 + Scalar UI |

---

## 9. Screen Flow & UX Map

### 9.1 Navigation Flow Diagram

```
┌─────────────┐
│   Landing   │──── Login/Signup ──────────────────────────────────┐
└─────────────┘                                                     │
                                                                    ▼
                                                   ┌───────────────────────────┐
                                                   │    Project Dashboard       │
                                                   │  (All projects overview)   │
                                                   └──────────────┬────────────┘
                                                                  │
                          ┌───────────────────────────────────────┤
                          │ Create New Project                     │ Open Existing
                          ▼                                        ▼
               ┌──────────────────────┐            ┌──────────────────────────┐
               │    Project Setup     │            │   Main Analysis Hub      │
               │ • Set Location       │            │   (3D Viewer + Controls) │
               │ • Upload 3D Model    │            └───────────────┬──────────┘
               │ • Configure Settings │                            │
               └──────────┬───────────┘             ┌─────────────┼──────────────┐
                          │                          │             │              │
                          ▼                          ▼             ▼              ▼
               ┌──────────────────────┐    ┌──────────┐  ┌──────────┐  ┌──────────────┐
               │   Context Loading    │    │   Sun &  │  │  Wind    │  │    Rain &    │
               │ • OSM buildings      │    │  Shadow  │  │ Analysis │  │   Terrain    │
               │ • DEM terrain        │    └──────────┘  └──────────┘  └──────────────┘
               │ • Weather data       │          │             │              │
               └──────────┬───────────┘          ▼             ▼              ▼
                          │                   ┌──────────────────────────────────┐
                          ▼                   │           Heat Mapping           │
               ┌──────────────────────┐       └────────────────────┬─────────────┘
               │  Main Analysis Hub   │                             │
               └──────────────────────┘                            ▼
                                                   ┌───────────────────────────┐
                                                   │    Combined Analysis      │
                                                   │  (Multi-layer overlay)   │
                                                   └──────────────┬────────────┘
                                                                  │
                          ┌───────────────────────────────────────┤
                          │                                        │
                          ▼                                        ▼
               ┌──────────────────────┐            ┌──────────────────────────┐
               │   Comparison Mode    │            │      Report Export        │
               │  (A vs B designs)    │            │  (PDF with all insights)  │
               └──────────────────────┘            └──────────────────────────┘
```

### 9.2 Main Analysis Hub Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER: [UrbanEye Logo] [Project Name] [Save] [Export] [Settings] [Theme]  │
├──────────────┬──────────────────────────────────┬───────────────────────────┤
│  LEFT PANEL  │                                  │       RIGHT PANEL         │
│              │     3D INTERACTIVE VIEWER         │                           │
│ Simulation   │     (Three.js Canvas)            │   AI Insight Cards        │
│ Controls:    │                                  │                           │
│ ┌──────────┐ │  [Building Mesh]                │   ┌─────────────────────┐ │
│ │ ☀ Solar  │ │  [Context Buildings]            │   │ ⚡ CRITICAL         │ │
│ │ 💨 Wind  │ │  [Terrain]                      │   │ Wind channeling on  │ │
│ │ 🌧 Rain  │ │  [Simulation Overlay]           │   │ N facade: 8.2 m/s  │ │
│ │ 🌡 Heat  │ │                                  │   └─────────────────────┘ │
│ │ ⛰ Terra  │ │  TIME SLIDER ────────────────   │                           │
│ └──────────┘ │  06:00  ●─────────────  18:00   │   Environmental Score:    │
│              │                                  │   ┌─────────┐             │
│ Parameters:  │  [COMPASS] [SCALE] [NORTH]      │   │  72/100 │ ← gauge    │
│ Date: [___]  │                                  │   └─────────┘             │
│ Time: [___]  │                                  │                           │
│ Season: [_]  │                                  │   Domain Scores:          │
│              │                                  │   ☀ Solar:  78  ████▓    │
│ Layer:       │                                  │   💨 Wind:  65  ███▓▓    │
│ [Heatmap ▼] │                                  │   🌧 Rain:  82  ████▓    │
│              │                                  │   🌡 Heat:  58  ███▓▓    │
│ Opacity: ─● │                                  │   ⛰ Terra: 85  █████    │
├──────────────┴──────────────────────────────────┴───────────────────────────┤
│  STATUS BAR: [Simulation Status] [Active Layer] [Grid Resolution: 2m]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Phase-by-Phase Implementation Plan

### Phase 0: Foundation (Weeks 1–2)
**Goal:** Project scaffolding, design system, base 3D viewer

#### Week 1 Tasks
- [ ] Initialize Vite + React + TypeScript project
- [ ] Set up Vanilla CSS design system (tokens, typography, colors, dark/light mode)
- [ ] Create reusable UI component library (Button, Card, Slider, Badge, Modal)
- [ ] Integrate Google Fonts (Inter + Outfit)
- [ ] Build Landing screen
- [ ] Set up project routing (React Router)
- [ ] Initialize Zustand stores (project, simulation, UI)

#### Week 2 Tasks
- [ ] Integrate Three.js + React Three Fiber
- [ ] Build base `ThreeViewer` component (orbit controls, lighting setup)
- [ ] GLB/GLTF model loader + display
- [ ] Build `ProjectSetup` screen (location picker + model upload UI)
- [ ] Set up Fastify backend skeleton (Node.js)
- [ ] Set up PostgreSQL + Prisma schema (projects, models tables)
- [ ] Configure MinIO object store
- [ ] Model upload API endpoint (POST /api/projects/:id/model)

**Deliverable:** Working 3D viewer that can load a GLB file and display it.

---

### Phase 1: Context & Geometry (Weeks 3–4)
**Goal:** Real-world site context — OSM buildings, terrain, location-awareness

#### Week 3 Tasks
- [ ] Mapbox/Leaflet integration for interactive location picker
- [ ] Overpass API client — fetch buildings within 500m radius
- [ ] OSM GeoJSON → Three.js extruded polygons (context buildings)
- [ ] Context building renderer (low-poly gray buildings surrounding site)
- [ ] Coordinate system: WGS84 lat/lng → local scene coordinates (proj4js)
- [ ] Compass rose + north arrow in 3D scene

#### Week 4 Tasks
- [ ] OpenTopography API client (SRTM DEM fetch for bounding box)
- [ ] DEM raster → Three.js PlaneGeometry displacement (terrain mesh)
- [ ] Terrain coloring by elevation (green → brown)
- [ ] Open-Meteo API client (weather data fetch)
- [ ] NASA POWER API client (solar irradiance data)
- [ ] Site Context data model + API endpoint
- [ ] Context loading progress UI (loading states per data source)

**Deliverable:** User can input a location and see the real site context — buildings, terrain, and weather data fetched and displayed.

---

### Phase 2: Solar & Shadow Simulation (Weeks 5–7)
**Goal:** Accurate sun position, shadow casting, radiation heatmap — inspired by Cyclops

#### Week 5 Tasks
- [ ] SPA (Solar Position Algorithm) implementation (TypeScript)
- [ ] Sun path arc visualization (annual path + solstice/equinox arcs)
- [ ] Sun sphere animated along path (real-time + time-scrubbing)
- [ ] DirectionalLight position updates per sun position
- [ ] Time slider component (6am–8pm, 1-hour steps)
- [ ] Date + Season selector

#### Week 6 Tasks
- [ ] Shadow casting: Three.js raycaster-based analysis grid
- [ ] Analysis point grid (configurable resolution: 1m, 2m, 5m)
- [ ] Per-point shadow accumulation (hourly over selected time range)
- [ ] Shadow frequency heatmap (0% blue → 100% red)
- [ ] Sunlight Hour metric (hours of direct sun per analysis point)
- [ ] Shading Mask: sky hemisphere visibility per analysis point (Cyclops-inspired)

#### Week 7 Tasks
- [ ] Solar radiation calculation (W/m² per surface, using irradiance × cos(angle))
- [ ] Annual radiation heatmap (kWh/m²/year per face)
- [ ] Solar heatmap shader (custom ShaderMaterial)
- [ ] Insight cards for solar (shaded facade alert, PV potential estimate)
- [ ] Solar domain score calculator
- [ ] Sun & Shadow analysis screen (dedicated view)

**Deliverable:** Full solar simulation with shadow animation, radiation heatmap, and insight cards.

---

### Phase 3: Wind Simulation (Weeks 8–9)
**Goal:** Vector-based wind flow, comfort zones, ventilation analysis

#### Week 8 Tasks
- [ ] Wind direction + speed input (from weather API, or manual override)
- [ ] Wind rose visualization component (polar chart)
- [ ] Simplified potential flow solver (Python backend worker)
- [ ] Wind vector field storage (3D grid → JSON/binary)
- [ ] Wind arrow renderer (InstancedMesh, Three.js)
- [ ] Arrow color mapping by speed (cyan → dark blue)

#### Week 9 Tasks
- [ ] Animated wind particle system (Three.js Points, advected through field)
- [ ] Wind channeling zone detection (speed > 2× ambient)
- [ ] Pedestrian comfort zones (Lawson criteria coloring)
- [ ] Dead zone detection (speed < 0.5 m/s)
- [ ] Wind pressure on facades (Pa per face)
- [ ] Wind insight cards + domain score
- [ ] Wind analysis screen

**Deliverable:** Wind simulation with animated particles, comfort zoning, and insight cards.

---

### Phase 4: Rain & Terrain Analysis (Weeks 10–11)
**Goal:** Rainfall simulation, drainage modeling, terrain geomorphology

#### Week 10 Tasks
- [ ] Wind-driven rain model (facade exposure calculation)
- [ ] Roof drainage analysis (slope + runoff coefficient per surface)
- [ ] D8 flow accumulation algorithm (Python, terrain runoff)
- [ ] Ground flow path visualization (animated blue line particles)
- [ ] Flooding risk heatmap (accumulation intensity → color)

#### Week 11 Tasks
- [ ] Terrain slope map (Sobel filter, Python)
- [ ] Slope visualization (degrees → color ramp on terrain mesh)
- [ ] Cut & Fill volume calculator (foundation level input)
- [ ] Contour line generation (marching squares, GeoJSON output)
- [ ] Contour line renderer (Three.js LineSegments on terrain)
- [ ] Rain & Terrain insight cards + domain scores
- [ ] Terrain drainage screen

**Deliverable:** Rain flow simulation, terrain analysis with slope/drainage, flooding risk map.

---

### Phase 5: Heat Mapping (Weeks 12–13)
**Goal:** Surface thermal analysis, UTCI outdoor comfort, UHI assessment

#### Week 12 Tasks
- [ ] Material properties database (albedo, emissivity per material type)
- [ ] Material assignment UI (select building surfaces → assign material)
- [ ] Surface temperature calculator (solar radiation + material properties)
- [ ] Per-vertex thermal color mapping (blue → yellow → red)
- [ ] Thermal animation over time (hourly temperature progression)

#### Week 13 Tasks
- [ ] UTCI calculation for outdoor zones
- [ ] Outdoor thermal comfort zone map (5 UTCI stress categories)
- [ ] Urban Heat Island multiplier (based on OSM building density)
- [ ] Cool spot identification (shade + airflow overlap zones)
- [ ] Heat insight cards + domain score
- [ ] Heat mapping screen

**Deliverable:** Full thermal simulation with surface temp heatmap, UTCI zones, and heat insight cards.

---

### Phase 6: Combined Analysis & AI Layer (Weeks 14–15)
**Goal:** Multi-layer overlay, AI insight engine, cross-domain correlation

#### Week 14 Tasks
- [ ] Combined Analysis view (simultaneous multi-engine display with opacity controls)
- [ ] Layer management system (show/hide + blend modes per simulation layer)
- [ ] Cross-engine correlation detector (wind dead zone + rain accumulation = moisture risk)
- [ ] AI Insight Engine (rule-based, TypeScript)
- [ ] Insight card rendering system (severity-coded, collapsible)
- [ ] Recommendation cards with design actions

#### Week 15 Tasks
- [ ] LLM integration (OpenAI GPT-4 for recommendation text generation)
- [ ] Overall Environmental Score calculator
- [ ] Score dashboard (all 5 domains displayed as gauges/bars)
- [ ] Comparison Mode (side-by-side A vs. B project design)
- [ ] Design history versioning (save multiple model configurations)

**Deliverable:** AI-driven insight layer, cross-domain analysis, score dashboard, comparison mode.

---

### Phase 7: Reports & Polish (Weeks 16–17)
**Goal:** Report generation, UX polish, performance optimization

#### Week 16 Tasks
- [ ] Report template design (PDF layout: executive summary + per-domain sections)
- [ ] Three.js → canvas → image capture (html2canvas) for 3D screenshots
- [ ] jsPDF integration + report assembly
- [ ] Export: PDF report with all simulation visuals + insight cards
- [ ] Data export: CSV of simulation metrics
- [ ] Print-optimized layout

#### Week 17 Tasks
- [ ] Performance optimization: InstancedMesh for context buildings
- [ ] LOD (Level of Detail) system for far-away context buildings
- [ ] Web Worker offloading for CPU-intensive operations (raycasting, accumulation)
- [ ] Lazy loading for simulation result grids (large binary data)
- [ ] Responsive design (1280px+ primary, tablet-friendly secondary)
- [ ] Accessibility pass (keyboard navigation, ARIA labels, contrast check)
- [ ] Dark/Light theme full implementation + persistence
- [ ] Final UX pass (micro-animations, hover states, loading skeletons)

**Deliverable:** Production-ready platform with PDF export, polished UI, and performance optimization.

---

### Phase 8: Beta & Production (Weeks 18–20)
**Goal:** User testing, bug fixes, deployment, documentation

#### Tasks
- [ ] Internal QA testing across all simulation engines
- [ ] Beta user testing with 5 target users (architects/planners)
- [ ] Feedback integration + bug fixes
- [ ] Security audit (authentication, file upload validation, API rate limiting)
- [ ] Docker containerization of all services
- [ ] CI/CD pipeline setup (GitHub Actions)
- [ ] Production deployment (Vercel + Railway)
- [ ] User documentation + onboarding tour
- [ ] Analytics integration (PostHog)

---

## 11. Data Sources & Integration Contracts

### 11.1 API Integration Summary

```typescript
// Open-Meteo (Primary free weather source — no API key required)
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lng}
  &hourly=temperature_2m,windspeed_10m,winddirection_10m,precipitation
  &daily=precipitation_sum,windspeed_10m_max
  &timezone=auto

// NASA POWER API (Solar irradiance)
GET https://power.larc.nasa.gov/api/temporal/monthly/point
  ?parameters=ALLSKY_SFC_SW_DWN,CLRSKY_SFC_SW_DWN
  &community=RE
  &longitude={lng}&latitude={lat}
  &format=JSON

// Overpass API (OpenStreetMap buildings)
POST https://overpass-api.de/api/interpreter
  Body: [out:json]; way["building"](bbox:{south},{west},{north},{east}); out body geom;

// OpenTopography (SRTM DEM)
GET https://portal.opentopography.org/API/globaldem
  ?demtype=SRTMGL1
  &south={south}&north={north}&west={west}&east={east}
  &outputFormat=GTiff
  &API_Key={key}
```

### 11.2 Caching Strategy

| Data Type | TTL | Storage |
|---|---|---|
| OSM Building data | 7 days | Redis + PostGIS |
| DEM Terrain | Permanent (static) | Object Store |
| Weather Current | 1 hour | Redis |
| Weather Monthly Avg | 30 days | PostgreSQL |
| Solar Position Table | Permanent (computed) | PostgreSQL |
| Simulation Results | Permanent until re-run | PostgreSQL + Object Store |

---

## 12. Performance & Scalability Strategy

### 12.1 Frontend Performance

| Concern | Strategy |
|---|---|
| Large 3D scenes | InstancedMesh for context buildings (1 draw call for N buildings) |
| Heatmap rendering | GPU shader instead of per-object coloring |
| Simulation grids | Binary typed arrays (Float32Array) instead of JSON |
| Context building detail | LOD: buildings > 200m away use box approximation |
| Animation (particles) | Web Workers for position update, GPU for rendering |
| IFC file loading | Web Worker + IFC.js WASM (never block main thread) |

### 12.2 Backend Performance

| Concern | Strategy |
|---|---|
| Simulation computation | Python workers with NumPy vectorized operations |
| Large result grids | Binary format storage (HDF5 / .npy), served as typed arrays |
| Multiple concurrent jobs | BullMQ with configurable concurrency per engine |
| DEM raster operations | GDAL Python bindings for fast raster processing |
| API response time | Redis cache for all external API responses |

### 12.3 Target Performance Benchmarks

| Operation | Target Time |
|---|---|
| Context load (OSM + DEM) | < 8 seconds |
| Solar simulation (100×100 grid, 8h) | < 15 seconds |
| Wind simulation (50×50×20 grid) | < 30 seconds |
| Rain + terrain simulation | < 20 seconds |
| Heat mapping | < 10 seconds (reuses solar data) |
| AI insight generation | < 5 seconds |
| PDF report generation | < 15 seconds |

---

## 13. Testing & Quality Assurance

### 13.1 Testing Strategy

| Layer | Framework | Coverage Target |
|---|---|---|
| Unit (algorithms) | Vitest | 80% for simulation math |
| Integration (API) | Supertest | All API endpoints |
| E2E (user flows) | Playwright | Core workflows |
| 3D visual regression | Storybook + Chromatic | Key rendering states |
| Simulation accuracy | Benchmark against EnergyPlus reference cases | ±5% tolerance |

### 13.2 Simulation Accuracy Validation

- **Solar:** Compare against PVGIS (EU Commission solar tool) for same location
- **Wind:** Validate against known wind tunnel experiments (simple rectangular building cases)
- **Rain:** Compare runoff volumes against rational method calculations
- **Heat:** Validate UTCI outputs against published measurement datasets

---

## 14. DevOps & Deployment Pipeline

### 14.1 CI/CD Pipeline

```
git push → GitHub Actions:
  ├── Lint + TypeScript check
  ├── Unit tests (Vitest)
  ├── Integration tests
  ├── Docker build
  ├── Deploy to staging (Railway)
  └── (Manual approval) → Deploy to production
```

### 14.2 System Diagram

```
┌─────────────┐    ┌─────────────────┐    ┌────────────────────┐
│   Vercel    │    │  Railway/Render  │    │    Supabase        │
│  (Frontend) │───>│  (API + Workers) │───>│ (PostgreSQL+PostGIS)│
│  React App  │    │  Fastify + BullMQ│    │                    │
└─────────────┘    └─────────────────┘    └────────────────────┘
                           │
               ┌───────────┼───────────┐
               ▼           ▼           ▼
          ┌─────────┐ ┌─────────┐ ┌─────────┐
          │  Redis  │ │  MinIO  │ │ Python  │
          │  Cache  │ │ Storage │ │ Workers │
          └─────────┘ └─────────┘ └─────────┘
```

---

## 15. Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Browser WebGL limits (mobile) | High | Medium | Desktop-first strategy; graceful degradation |
| OSM data gaps (rural areas) | Medium | Medium | Fallback: show site-only analysis, warn user |
| DEM data missing / low resolution | Low | High | Multi-source fallback (SRTM → Copernicus → flat terrain) |
| CFD solver accuracy | Medium | High | Validate against benchmarks; clearly communicate accuracy limits |
| LLM API cost / rate limits | Medium | Low | Local template fallback; cache all LLM responses |
| IFC file complexity explosion | Medium | Medium | File size limit (100MB); geometry simplification pass |
| External API downtime | Medium | Medium | Cache-first strategy; graceful degradation with stale data |
| User data privacy (model IP) | Low | High | Model files stored encrypted; user-controlled deletion |

---

## 🗓️ Summary Timeline

| Phase | Focus | Weeks | Output |
|---|---|---|---|
| 0 | Foundation + Design System | 1–2 | Working 3D viewer + UI framework |
| 1 | Context + Geometry | 3–4 | Site context (OSM, DEM, weather) |
| 2 | Solar & Shadow | 5–7 | Full solar simulation + radiation heatmap |
| 3 | Wind Simulation | 8–9 | Wind flow + comfort zones |
| 4 | Rain & Terrain | 10–11 | Drainage + slope + flooding risk |
| 5 | Heat Mapping | 12–13 | Thermal + UTCI + UHI |
| 6 | Combined Analysis + AI | 14–15 | AI insights + scores + comparison mode |
| 7 | Reports + Polish | 16–17 | PDF reports + performance + accessibility |
| 8 | Beta + Production | 18–20 | Live platform + user onboarding |

**Total: ~20 weeks (5 months) to production-ready MVP**

---

> *"UrbanEye is not just a tool — it is the new standard for evidence-based architectural design. Every beam of light, every gust of wind, every drop of rain should be understood before the first foundation is poured."*
