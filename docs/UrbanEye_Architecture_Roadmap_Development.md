# 🏗️ UrbanEye — AI-Powered Environmental Building Simulation Platform
## Architecture & Implementation Roadmap

> **Document Version:** 1.0 | **Date:** April 2026 | **Author:** Product Architecture Review
>
> *This document covers end-to-end product architecture, technical systems design, and a phased implementation plan for UrbanEye — a professional web-based platform that enables architects, urban planners, and developers to simulate building-environment interactions before construction.*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Understanding & Vision](#2-project-understanding--vision)
3. [Reference Benchmarks Analysis](#3-reference-benchmarks-analysis)
4. [Full System Architecture](#4-full-system-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Simulation Engine Design](#7-simulation-engine-design)
8. [AI Intelligence Layer](#8-ai-intelligence-layer)
9. [Data Sources & Integration](#9-data-sources--integration)
10. [Database Schema](#10-database-schema)
11. [UX & Screen Design System](#11-ux--screen-design-system)
12. [API Contract Design](#12-api-contract-design)
13. [Phased Implementation Roadmap](#13-phased-implementation-roadmap)
14. [Technology Stack](#14-technology-stack)
15. [Risk Analysis & Mitigation](#15-risk-analysis--mitigation)
16. [Success Metrics & KPIs](#16-success-metrics--kpis)

---

## 1. Executive Summary

UrbanEye is a **building-level** (not city-level) environmental simulation SaaS platform. It bridges three domains that have historically been siloed:

| Domain | What UrbanEye Does |
|---|---|
| **GIS / Geospatial** | Fetches real terrain, surrounding buildings, climate zones from public APIs |
| **Physics Simulation** | Runs Sun, Wind, Rain, Thermal comfort,Heat stress, and Terrain simulations  against the building model |
| **AI Intelligence** | Interprets simulation outputs and generates actionable design recommendations |

The product gives professionals a **single professional workspace** to develop and analyse 3D model in real time, set a geographic location, run multi-environment simulations, and receive an AI-generated PDF report — all within a browser, with no local software installation.

> [!IMPORTANT]
> The key differentiator is **building-level precision** combined with **free public data sources** — making it accessible to independent architects and mid-size studios, not just large firms with expensive software licenses.

---

## 2. Project Understanding & Vision

### 2.1 Core Problem Being Solved

Today, environmental analysis requires multiple separate tools:
- **Rhino + Cyclops / Grasshopper** for solar/shadow (desktop, GPU-dependent, expensive)
- **OpenFOAM** for CFD wind analysis (requires engineering expertise)
- **QGIS + SWMM** for hydrology (separate GIS workflow)
- **EnergyPlus / IDA ICE** for thermal modeling

None of these are connected. Results must be manually correlated. **UrbanEye unifies all of this in a single browser-based workflow** with AI-synthesized insights.

### 2.2 Target User Personas

```
┌─────────────────────────────────────────────────────────────────┐
│  PERSONA A: Architect / Designer                                │
│  Goal: Understand sun/shadow impact early in schematic phase    │
│  Pain Point: Can't run Radiance or EnergyPlus without support   │
│  Usage: Early design validation, client presentations           │
├─────────────────────────────────────────────────────────────────┤
│  PERSONA B: Urban Planner                                       │
│  Goal: Assess wind comfort, heat island, flood risk at site     │
│  Pain Point: Multiple tools, no unified environmental score     │
│  Usage: Site feasibility studies, regulatory compliance checks  │
├─────────────────────────────────────────────────────────────────┤
│  PERSONA C: Real Estate Developer                               │
│  Goal: Fast ROI-linked environmental risk analysis              │
│  Pain Point: Expensive consultants for environmental reports    │
│  Usage: Pre-acquisition site assessments, investor reporting    │
├─────────────────────────────────────────────────────────────────┤
│  PERSONA D: Sustainability Consultant                           │
│  Goal: LEED/BREEAM-aligned performance metrics & reporting      │
│  Pain Point: Manual data collection and report assembly         │
│  Usage: Environmental impact reports, design reviews            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Product Scope Boundaries

| **In Scope** | **Out of Scope** |
|---|---|
| Building-level analysis (single site) | City-scale urban modeling |
| Web-based (browser only) | Native desktop app |
| Free public data sources | Paid satellite imagery providers |
| Simplified physics simulation | Full CFD (OpenFOAM-grade) |
| AI-generated text insights | Structural engineering analysis |
| PDF export | BIM authoring (Revit/Archicad) |

---

## 3. Reference Benchmarks Analysis

### 3.1 Cyclops (Foster + Partners) — Key Lessons

Cyclops is a **GPU-accelerated ray-tracing plugin** for Rhino/Grasshopper that runs:
- **Daylight analysis** — illuminance from sky at specific positions
- **Radiation** — sky irradiance over time periods
- **Sunlight Hours** — total sunlight hours received at a point
- **Shading Mask** — hemisphere mapping showing sky obstruction
- **Sunlight Obstruction** — identifies blocked sun angles

**What UrbanEye borrows from Cyclops:**
- The concept of **Analysis Points** placed on building surfaces
- **Sun Rig** → time-based solar position driving all analyses
- **Sky Series** → seasonal/annual date ranges for accumulated simulation
- **Hemisphere visualization** → skyview factor representation
- **Scene-based architecture** → static geometry retained, only light re-calculated

**Key difference:** Cyclops is Rhino-native, GPU-required, desktop-only. UrbanEye does server-side computation and delivers results to a browser.

### 3.2 Hektar AI — Key Lessons

Hektar is a **generative design cloud tool** for urban pre-design with:
- Map-based site interface (OpenStreetMap base)
- Real-time KPI metrics (GFA, unit counts, density)
- Parametric constraint management
- Quick scenario comparison
- Export to standard formats (OBJ, 3DM, CSV)

**What UrbanEye borrows from Hektar:**
- **Map-first project setup** — site defined on an interactive map before model upload
- **Real-time metric panels** — live updating KPI cards during simulation
- **Side-by-side comparison mode** — multiple design scenarios
- **Progressive workflow** — guided step-by-step setup (Location → Model → Simulation)
- **Freemium model architecture** — accessible entry point

### 3.3 QGIS — Key Lessons

QGIS is an open-source GIS platform used for:
- Layer-based spatial data management
- Vector/raster processing and analysis
- Terrain analysis, watershed modeling
- Cartographic map production

**What UrbanEye borrows from QGIS:**
- **Layer toggle system** — show/hide simulation layers independently
- **Geospatial data pipeline** — DEM, OSM building footprints, satellite basemaps
- **Coordinate-based project anchoring** — WGS84 lat/lon project origin
- **Analysis toolbox pattern** — modular, tool-per-analysis-type design
- **Export workflows** — high-resolution map/report export

---

## 4. Full System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              URBANEYE PLATFORM                                       │
│                                                                                     │
│  ┌─────────────────────────────────┐    ┌──────────────────────────────────────┐   │
│  │         FRONTEND (Browser)       │    │           BACKEND (Cloud)             │   │
│  │                                 │    │                                      │   │
│  │  ┌──────────┐  ┌─────────────┐  │    │  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │ React +  │  │  Three.js   │  │    │  │   FastAPI    │  │  Simulation  │  │   │
│  │  │ Vite SPA │  │  3D Viewer  │  │    │  │  REST API    │  │  Workers     │  │   │
│  │  └──────────┘  └─────────────┘  │    │  └──────────────┘  └─────────────┘  │   │
│  │                                 │    │                                      │   │
│  │  ┌──────────┐  ┌─────────────┐  │    │  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │ MapLibre │  │  Chart.js   │  │    │  │  Celery Task │  │   Redis      │  │   │
│  │  │ GL Maps  │  │  Analytics  │  │    │  │  Queue       │  │   Cache      │  │   │
│  │  └──────────┘  └─────────────┘  │    │  └──────────────┘  └─────────────┘  │   │
│  │                                 │    │                                      │   │
│  │  ┌──────────────────────────┐   │    │  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │  WebSocket / SSE Client  │   │◄───►│  │  WebSocket   │  │ PostgreSQL  │  │   │
│  │  └──────────────────────────┘   │    │  │  Server      │  │ + PostGIS   │  │   │
│  └─────────────────────────────────┘    │  └──────────────┘  └─────────────┘  │   │
│                                         │                                      │   │
│                                         │  ┌────────────────────────────────┐  │   │
│                                         │  │        AI / LLM LAYER          │  │   │
│                                         │  │  Insight Engine  │  Rec Engine │  │   │
│                                         │  └────────────────────────────────┘  │   │
│                                         └──────────────────────────────────────┘   │
│                                                        │                            │
│                        ┌───────────────────────────────┤                            │
│                        │    EXTERNAL DATA SOURCES       │                            │
│                        │                               │                            │
│          ┌─────────────┴──┐  ┌──────────────┐  ┌──────┴──────────┐                │
│          │  OpenStreetMap │  │ NASA SRTM /  │  │  OpenWeather /  │                │
│          │  Overpass API  │  │ Copernicus   │  │  NASA POWER API │                │
│          └────────────────┘  └──────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Architectural Patterns

| Pattern | Application |
|---|---|
| **SPA (Single Page App)** | Frontend React app — no full page reloads |
| **Task Queue Architecture** | Heavy simulations run as async Celery workers |
| **Event-Driven (WebSockets)** | Real-time simulation progress pushed to browser |
| **Repository Pattern** | Abstracts DB access from business logic |
| **Engine Pattern** | Each simulation is a self-contained, interchangeable engine |
| **Strategy Pattern** | AI insight generation strategies per simulation type |
| **CQRS (light)** | Separate read paths (cached results) from write paths (new sims) |

---

## 5. Frontend Architecture

### 5.1 Application Shell & Navigation

```
App Shell
├── Sidebar Navigation (Projects / Analysis / Settings)
├── Top Navigation Bar (Module Tabs: Sun Mapping / Wind Flow / Thermal Grids / Hydrology)
└── Main Canvas Area (75% width)
    ├── 3D Viewer (Three.js WebGL)
    └── 2D Map View (MapLibre GL)

Right Panel (25% width)
├── AI Inspector / Insights Panel
├── Simulation Layers Toggle
├── Metrics Cards
└── Export / Action Buttons

Bottom Bar
├── Time Slider (for temporal animations)
├── Simulation Status
└── Coordinate Display
```

### 5.2 Screen Inventory (All 13 Screens)

Based on the existing design screens, UrbanEye has the following screen modules:

| # | Screen | Route | Purpose |
|---|---|---|---|
| 1 | **Project Dashboard** | `/dashboard` | Project registry, active simulations, metrics overview |
| 2 | **Project Setup** | `/project/new` | 6-step guided wizard (Location → Model → Surroundings → Materials → Simulation → Time Config) |
| 3 | **Main Analysis Hub** | `/project/:id/analysis` | Central analysis workspace with layer switching |
| 4 | **Sun & Shadow Analysis** | `/project/:id/sun` | Solar irradiance, shadow animation, sun path |
| 5 | **Wind Flow Analysis** | `/project/:id/wind` | Streamline vector flow, turbulence detection |
| 6 | **Heat / Thermal Analysis** | `/project/:id/thermal` | Heatmap overlay, thermal zones, UTCI |
| 7 | **Rain / Hydrology Analysis** | `/project/:id/hydrology` | Precipitation flow, catchment, flood zones |
| 8 | **Terrain & Drainage** | `/project/:id/terrain` | DEM contour, slope, runoff vectors |
| 9 | **Combined Analysis** | `/project/:id/combined` | Multi-layer composite impact score |
| 10 | **Comparison Mode** | `/project/:id/compare` | Side-by-side design variant delta analysis |
| 11 | **Analysis Report** | `/project/:id/report` | Full PDF-ready report with AI synthesis |
| 12 | **Settings** | `/settings` | User profile, API keys, preferences |
| 13 | **Landing / Auth** | `/` | Sign-up, login, product intro |

### 5.3 Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx          # Main layout wrapper
│   │   ├── Sidebar.jsx           # Left nav
│   │   ├── TopNav.jsx            # Module tab navigation
│   │   ├── RightPanel.jsx        # Contextual analysis panel
│   │   └── BottomBar.jsx         # Timeline & status
│   │
│   ├── viewer/
│   │   ├── ThreeViewer.jsx       # Three.js WebGL 3D scene
│   │   ├── MapViewer.jsx         # MapLibre 2D map
│   │   ├── SunRig.jsx            # Solar position + directional light
│   │   ├── ShadowOverlay.jsx     # Shadow map visualization
│   │   ├── WindParticleSystem.jsx # Streamline particle renderer
│   │   ├── HeatmapOverlay.jsx    # Thermal color mesh shader
│   │   ├── RainFlowLayer.jsx     # Rainfall particle + vector flow
│   │   ├── TerrainMesh.jsx       # DEM elevation mesh
│   │   └── BuildingContext.jsx   # OSM surrounding buildings
│   │
│   ├── panels/
│   │   ├── AIInspector.jsx       # AI insight cards
│   │   ├── SimulationLayers.jsx  # Layer toggle controls
│   │   ├── MetricsCards.jsx      # KPI metric display
│   │   ├── TimeSlider.jsx        # Temporal animation control
│   │   └── RecommendationList.jsx # Design recommendations
│   │
│   ├── setup/
│   │   ├── LocationPicker.jsx    # Map-based coordinate input
│   │   ├── ModelUploader.jsx     # GLB/IFC/OBJ drag & drop
│   │   ├── SurroundingsFetcher.jsx # OSM building fetch preview
│   │   ├── MaterialSelector.jsx  # Surface material assignment
│   │   ├── SimulationConfig.jsx  # Engine selection + params
│   │   └── TimeConfig.jsx        # Date range, time zone
│   │
│   ├── charts/
│   │   ├── SolarPathChart.jsx    # Sun path polar diagram
│   │   ├── TemperatureChart.jsx  # Hourly/monthly thermal chart
│   │   ├── WindRoseChart.jsx     # Directional wind frequency
│   │   ├── RainfallChart.jsx     # Precipitation bar chart
│   │   └── ComparisonRadar.jsx   # Multi-metric radar chart
│   │
│   └── report/
│       ├── ReportBuilder.jsx     # PDF assembly component
│       ├── ReportSection.jsx     # Reusable report block
│       └── ExportControls.jsx    # PDF / JSON export buttons
│
├── engines/                      # Client-side simulation helpers
│   ├── solarEngine.js            # SunCalc integration, azimuth/altitude
│   ├── shadowEngine.js           # Three.js shadow map management
│   └── colorMapper.js            # Value-to-color gradient mapping
│
├── stores/                       # Zustand state management
│   ├── projectStore.js           # Active project state
│   ├── simulationStore.js        # Sim status, results, layers
│   ├── viewerStore.js            # 3D viewer camera, mode
│   └── uiStore.js                # Theme, panel states
│
├── hooks/
│   ├── useSimulation.js          # WebSocket simulation runner
│   ├── useGeospatial.js          # OSM/DEM data fetching
│   ├── useThreeScene.js          # Three.js scene lifecycle
│   └── useAIInsights.js          # AI insight polling
│
└── api/
    ├── projects.api.js
    ├── simulations.api.js
    ├── models.api.js
    └── reports.api.js
```

### 5.4 3D Viewer Technical Design

```javascript
// Three.js Scene Composition
Scene Graph:
├── AmbientLight (0.3 intensity)
├── DirectionalLight (SunRig — position driven by SunCalc)
│   └── shadow.camera (orthographic, tuned to site bounds)
├── BuildingGroup
│   ├── UserBuilding (uploaded GLB/IFC)
│   └── ContextBuildings (OSM extruded footprints)
├── TerrainMesh (DEM heightmap)
├── OverlayGroup (simulation result meshes)
│   ├── HeatmapMesh (ShaderMaterial with uniform colormap)
│   ├── WindParticles (Points + BufferGeometry)
│   └── RainParticles (Points + custom physics)
└── HelperGroup
    ├── GridHelper
    ├── CompassRose
    └── AnalysisPoints (Sphere markers)
```

---

## 6. Backend Architecture

### 6.1 API Server (FastAPI)

```
backend/
├── app/
│   ├── main.py               # FastAPI app entry point
│   ├── config.py             # Environment config
│   │
│   ├── routers/
│   │   ├── projects.py       # CRUD for projects
│   │   ├── models.py         # 3D model upload & parsing
│   │   ├── simulations.py    # Trigger + status + results
│   │   ├── geospatial.py     # OSM/DEM/weather fetch proxy
│   │   ├── ai.py             # AI insights & recommendations
│   │   └── reports.py        # Report generation & export
│   │
│   ├── engines/
│   │   ├── base_engine.py    # Abstract SimulationEngine
│   │   ├── solar_engine.py   # Sun path + shadow
│   │   ├── wind_engine.py    # Vector flow simulation
│   │   ├── rain_engine.py    # Precipitation + runoff
│   │   ├── thermal_engine.py # Heat zone calculation
│   │   ├── terrain_engine.py # DEM slope + drainage
│   │   ├── geometry_engine.py # Model parsing + surface analysis
│   │   ├── insight_engine.py # Data → readable text
│   │   └── recommendation_engine.py # Improvements
│   │
│   ├── services/
│   │   ├── osm_service.py    # Overpass API calls
│   │   ├── dem_service.py    # NASA SRTM / Copernicus fetch
│   │   ├── weather_service.py # OpenWeather / Meteostat
│   │   ├── solar_service.py  # NASA POWER API
│   │   ├── model_service.py  # GLB/IFC/OBJ parsing
│   │   ├── ai_service.py     # LLM inference calls
│   │   └── pdf_service.py    # WeasyPrint PDF generation
│   │
│   ├── tasks/                # Celery async tasks
│   │   ├── simulation_tasks.py
│   │   └── report_tasks.py
│   │
│   ├── models/               # SQLAlchemy ORM models
│   │   ├── project.py
│   │   ├── simulation.py
│   │   ├── building_model.py
│   │   └── user.py
│   │
│   └── schemas/              # Pydantic request/response schemas
│       ├── project_schema.py
│       ├── simulation_schema.py
│       └── report_schema.py
│
├── workers/
│   └── celery_worker.py      # Celery worker entry point
│
└── tests/
    ├── test_solar_engine.py
    ├── test_wind_engine.py
    └── test_rain_engine.py
```

### 6.2 Task Queue Flow

```
Browser                 FastAPI             Redis Queue          Celery Worker
  │                        │                    │                    │
  ├─ POST /simulations ────►│                    │                    │
  │                        ├── enqueue task ────►│                    │
  │                        │◄── task_id ─────────┤                    │
  │◄─── {task_id, status} ─┤                    ├── dequeue ─────────►│
  │                        │                    │                    │
  ├─ WebSocket subscribe ──►│                    │   run engine()     │
  │                        │                    │         │          │
  │ ◄──── progress 20% ────┤◄────────────────────────── emit ────────┤
  │ ◄──── progress 60% ────┤◄────────────────────────── emit ────────┤
  │ ◄──── progress 100% ───┤◄──────────────────────── complete: ─────┤
  │                        │                            {results}    │
  │                        ├── store results in DB                   │
  │ ◄─── results payload ──┤                                         │
```

---

## 7. Simulation Engine Design

### 7.1 Engine Interface Contract

Every engine implements the same interface:

```python
class BaseSimulationEngine(ABC):
    def __init__(self, project: Project, config: SimConfig):
        self.project = project
        self.config = config

    @abstractmethod
    def validate_inputs(self) -> ValidationResult:
        """Validate all required data is present"""

    @abstractmethod
    def run(self, progress_callback: Callable) -> SimulationResult:
        """Execute simulation, emit progress 0-100"""

    @abstractmethod
    def to_visualization_data(self, result: SimulationResult) -> VisualizationPayload:
        """Convert raw result to browser-renderable format"""

    @abstractmethod
    def to_metrics(self, result: SimulationResult) -> dict[str, MetricValue]:
        """Extract quantified KPI metrics"""
```

### 7.2 Solar Engine

**Inputs:** Lat/Lon, Date range, Time step, Building surface mesh
**Algorithm:**
1. Use **Pysolar** or **pvlib** to compute sun's azimuth & altitude for each time step
2. Cast rays from each **Analysis Point** on building surface toward sun position
3. Check intersection against context geometry (OSM buildings, terrain)
4. Record: sunlight hours, direct radiation (Wh/m²), shading fraction

**Outputs:**
- Per-surface sunlight hours (annual / seasonal / specific date)
- Solar irradiance heatmap (color-coded mesh per face)
- Sun path polar diagram data
- Shadow animation frames (per-hour geometry transforms)
- Peak exposure zones with timestamps

**Visualization:** Three.js `DirectionalLight` position updated from SunCalc; shadow map rendered; building faces colored by received radiation (yellow→orange→red gradient)

### 7.3 Wind Engine

**Inputs:** Lat/Lon, Prevailing wind direction, Speed, Season, Building geometry
**Algorithm (Simplified CFD Proxy):**
1. Fetch historical wind speed/direction from **OpenWeather** or **Meteostat** for the location
2. Apply **potential flow theory** (simplified) around building footprint
3. Use **streamline integration** to trace flow paths
4. Identify: acceleration zones (between buildings), dead zones (lee side), turbulence (corners)
5. Apply **Lawson Pedestrian Comfort Criteria** to classify zones

**Key Simplification:** Not full Navier-Stokes CFD — uses analytically-solvable potential flow around extruded box shapes. Validated against known CFD results for standard building geometries.

**Outputs:**
- Vector field grid (velocity magnitude + direction per grid point)
- Streamline paths for visualization
- Turbulence probability zones
- Pedestrian comfort classification (Lawson L1-L6)
- Wind pressure on facades (gross estimate)

**Visualization:** Three.js `Points` system with animated streamline particles following pre-computed velocity field; color = velocity magnitude (cyan→blue gradient)

### 7.4 Rain Engine

**Inputs:** Lat/Lon, Monthly rainfall data, Building surfaces, Terrain DEM
**Algorithm:**
1. Fetch precipitation data from **OpenWeather** historical / **NASA POWER**
2. Simulate **rainfall particles** hitting building surfaces (vertical + wind-driven)
3. Compute **surface water flow** using steepest-descent path on building mesh + terrain
4. Identify **accumulation points** (valleys, flat roofs, terrain depressions)
5. Calculate **runoff coefficient** per surface material

**Outputs:**
- Surface water flow paths (vector field on building + terrain)
- Accumulation risk zones (colored by depth)
- Peak discharge estimate (m³/s)
- Roof drainage requirements
- Flood risk classification

**Visualization:** Animated rain particle system (blue droplets); flow vector arrows on terrain; accumulation zones as blue-gradient filled areas

### 7.5 Thermal Engine

**Inputs:** Solar irradiance results (from Solar Engine), Wind results, Surface materials, Ambient air temp
**Algorithm:**
1. Take per-surface solar irradiance from Solar Engine
2. Apply **material thermal properties** (albedo, thermal mass, conductivity) per surface
3. Compute **surface temperature** using simplified heat balance: `Q_solar - Q_convection - Q_radiation = ΔT × thermal_mass`
4. Compute **UTCI (Universal Thermal Climate Index)** for outdoor pedestrian areas
5. Identify **heat island effect** areas in surrounding context

**Outputs:**
- Surface temperature map (°C per face) — Blue→Yellow→Red
- Outdoor UTCI score (thermal comfort)
- Building energy load estimate (kWh)
- Heat island intensity relative to surroundings
- Peak temperature zones with times

**Visualization:** Three.js `ShaderMaterial` with uniform-driven color ramp on building mesh faces; temperature legend bar

### 7.6 Terrain Engine

**Inputs:** Lat/Lon + radius, DEM data (NASA SRTM 30m / Copernicus 10m)
**Algorithm:**
1. Download DEM tile for site + 1km buffer from **OpenTopography API** or **AWS Terrain Tiles**
2. Parse GeoTIFF → elevation grid
3. Compute **slope** (degree) per cell using finite differences
4. Compute **aspect** (direction of slope)
5. Run **D8 flow direction** algorithm for drainage routing
6. Compute **TWI (Topographic Wetness Index)**
7. Delineate **catchment area** for the site

**Outputs:**
- 3D terrain mesh (Three.js `PlaneGeometry` with height displacement)
- Slope map (Green→Brown gradient)
- Flow direction arrows
- Catchment boundary polygon
- Flood accumulation zones

### 7.7 Geometry Engine

**Inputs:** GLB / IFC / OBJ / FBX building model file
**Algorithm:**
1. Parse with **trimesh** (OBJ/GLB) or **ifcopenshell** (IFC)
2. Extract: vertices, faces, normals, surface areas
3. Classify surfaces: roof, walls (N/S/E/W/mixed), floor, overhangs
4. Compute: floor area, volume, surface-to-volume ratio, shape factor
5. Detect: openings (windows), overhangs, setbacks
6. Place **Analysis Points** at face centroids (configurable density)

**Outputs:**
- Parsed geometry ready for engine consumption
- Surface classification metadata
- Building KPIs (floor area, height, FAR, shape factor)
- Analysis point grid

### 7.8 Insight Engine

**Inputs:** All simulation results (JSON)
**Algorithm:**
1. Aggregate all engine outputs into **structured data record**
2. Run **threshold checks** against international standards:
   - Shadow: BS EN 17037 (daylight standards)
   - Wind: Lawson Pedestrian Comfort
   - Thermal: ASHRAE 55, ISO 7730 (UTCI bands)
   - Rain: BS EN 12056 (drainage)
3. Flag **anomalies** (zones exceeding thresholds)
4. Send structured data to **LLM** (GPT-4o-mini or local) with prompt template
5. LLM generates human-readable insights per simulation category

**Output:** Categorized insight cards: Heat Risk, Wind Comfort, Water Risk, Solar Performance

### 7.9 Recommendation Engine

**Inputs:** Insight Engine output + building geometry metadata
**Algorithm:**
1. Map each flagged issue to a **recommendation rulebook** (expert-defined decision tree)
2. Augment with LLM for natural language context
3. Estimate **impact of each recommendation** (e.g., "add 1.2m overhang → reduces thermal load by 18%")
4. Rank recommendations by impact score

**Output:** Prioritized list of design interventions with estimated effect

---

## 8. AI Intelligence Layer

### 8.1 AI Architecture

```
Simulation Results (JSON)
        │
        ▼
┌───────────────────┐
│  Data Structurer  │  ← normalizes all engine outputs into standard schema
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Threshold Checker│  ← rules-based compliance check (fast, deterministic)
└───────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│           LLM Prompt Builder               │
│                                           │
│  System: You are an environmental design  │
│  expert analyzing building simulation...  │
│                                           │
│  Data: {structured_results_json}          │
│  Standards: {applicable_codes}            │
│  Request: Generate insights + recs        │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────┐
│  LLM Inference    │  ← GPT-4o-mini (initial) / local model (optional)
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Response Parser  │  ← structured JSON extraction from LLM output
└───────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│  AI Inspector Cards          Rec Cards       │
│  ┌──────────────┐           ┌─────────────┐ │
│  │🔴 Heat Risk  │           │Add overhang │ │
│  │ 42.8°C peak │           │−4.2°C effect│ │
│  └──────────────┘           └─────────────┘ │
└─────────────────────────────────────────────┘
```

### 8.2 AI Prompt Templates

**Insight Generation Prompt:**
```
You are a certified environmental building performance analyst.
Analyze the following simulation results for a building at {location}.
Standards to apply: ASHRAE 55, Lawson Wind Criteria, BS EN 17037.

Simulation data:
- Solar: peak irradiance {solar_peak}W/m², worst-facing surface: {worst_surface}
- Wind: mean velocity {wind_velocity}m/s, turbulence zones: {turbulence_zones}
- Thermal: peak surface temp {peak_temp}°C, UTCI: {utci_score}
- Rain: peak runoff {peak_runoff}m³/s, accumulation points: {accum_count}

Generate 3-5 specific, actionable insights. For each insight:
1. Identify the specific issue location on the building
2. State the applicable standard and whether it passes/fails
3. Quantify the severity (mild/moderate/critical)
Return as structured JSON.
```

---

## 9. Data Sources & Integration

### 9.1 Data Source Map

| Data Type | Source | API / Method | Format | Update Freq |
|---|---|---|---|---|
| Building footprints | OpenStreetMap | Overpass API | GeoJSON | Weekly |
| Terrain elevation | NASA SRTM 30m | AWS S3 tiles / OpenTopography | GeoTIFF | Static |
| Terrain elevation (high-res) | Copernicus DEM 10m | Copernicus CDS | GeoTIFF | Static |
| Weather historical | Open-Meteo | REST API | JSON | Daily |
| Weather current | OpenWeather | REST API v3 | JSON | Hourly |
| Solar radiation | NASA POWER | REST API | JSON | Daily |
| Solar position | SunCalc (client) | Library | In-memory | Real-time |
| Climate zones | Köppen-Geiger | Static GeoJSON | GeoJSON | Decadal |

### 9.2 OSM Building Fetch Strategy

```python
# Overpass QL query to fetch buildings within radius
query = f"""
[out:json][timeout:30];
(
  way["building"](around:{radius},{lat},{lon});
  relation["building"](around:{radius},{lat},{lon});
);
out body;
>;
out skel qt;
"""
# Extrude using 'height' or 'building:levels' × 3m
# Cache response per (lat, lon, radius) for 7 days
```

### 9.3 DEM Fetch & Processing

```python
# 1. Determine tile bounds from project lat/lon + 1km buffer
# 2. Fetch GeoTIFF from:
#    - Primary: AWS Terrain Tiles (Mapbox/Amazon)
#    - Fallback: OpenTopography SRTM30 API
# 3. Parse with rasterio
# 4. Resample to simulation grid (20m default)
# 5. Convert to JSON heightmap for Three.js PlaneGeometry
# 6. Cache per tile for 30 days
```

---

## 10. Database Schema

### 10.1 Core Tables

```sql
-- Projects
CREATE TABLE projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    lat         DOUBLE PRECISION NOT NULL,
    lon         DOUBLE PRECISION NOT NULL,
    altitude    DOUBLE PRECISION,
    radius_m    INTEGER DEFAULT 500,
    climate_zone VARCHAR(10),          -- Köppen code
    lcz         VARCHAR(50),           -- Local Climate Zone
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Building Models
CREATE TABLE building_models (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
    filename    VARCHAR(255),
    file_format VARCHAR(10),           -- 'glb', 'ifc', 'obj', 'fbx'
    file_url    TEXT,                  -- S3 or local path
    floor_area  DOUBLE PRECISION,
    height_m    DOUBLE PRECISION,
    volume_m3   DOUBLE PRECISION,
    surface_data JSONB,                -- parsed surface classification
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Simulations
CREATE TABLE simulations (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    model_id     UUID REFERENCES building_models(id),
    type         VARCHAR(30) NOT NULL, -- 'solar','wind','rain','thermal','terrain','combined'
    status       VARCHAR(20) DEFAULT 'queued', -- queued/running/completed/failed
    config       JSONB NOT NULL,       -- engine-specific parameters
    results      JSONB,                -- full engine output
    viz_data     JSONB,                -- pre-computed visualization payloads
    metrics      JSONB,                -- extracted KPI values
    ai_insights  JSONB,                -- LLM-generated insight cards
    task_id      VARCHAR(100),         -- Celery task ID
    progress     INTEGER DEFAULT 0,
    error_msg    TEXT,
    started_at   TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT now()
);

-- Reports
CREATE TABLE reports (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    simulation_ids UUID[],
    title        VARCHAR(300),
    summary      TEXT,
    pdf_url      TEXT,
    json_export  JSONB,
    created_at   TIMESTAMPTZ DEFAULT now()
);

-- Users
CREATE TABLE users (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email        VARCHAR(255) UNIQUE NOT NULL,
    name         VARCHAR(200),
    avatar_url   TEXT,
    plan         VARCHAR(20) DEFAULT 'free',   -- free/pro/enterprise
    created_at   TIMESTAMPTZ DEFAULT now()
);
```

---

## 11. UX & Screen Design System

### 11.1 Design Language

The existing screens establish a clear design language called **"The Synthetic Observer"** — a dark-first, data-dense, scientific aesthetic:

- **Primary Background:** `#0A0F1E` (near-black navy)
- **Surface / Panel:** `#0F172A` / `#1E293B`
- **Accent Primary:** `#00B8D4` (electric cyan — used for active tabs, CTAs)
- **Accent Secondary:** `#6366F1` (indigo — combined analysis)
- **Alert Red:** `#EF4444`
- **Alert Amber:** `#F59E0B`
- **Alert Green:** `#10B981`
- **Typography:** `Space Grotesk` (headings) + `Inter` (body) + `JetBrains Mono` (data values)

**Light Mode counterpart** mirrors the same layout with:
- **Background:** `#F5F7FA`
- **Surface:** `#FFFFFF`
- **Accent:** Same cyan/indigo palette

### 11.2 Simulation Color Palettes

| Simulation | Cold → Warm Gradient | Purpose |
|---|---|---|
| **Solar** | `#FFF176` → `#FF8F00` → `#C62828` | kWh/m² irradiance |
| **Wind** | `#00E5FF` → `#0277BD` | m/s velocity |
| **Rain / Hydrology** | `#B3E5FC` → `#0D47A1` | flow intensity |
| **Thermal / Heat** | `#1A237E` → `#FDD835` → `#B71C1C` | °C surface temp |
| **Terrain** | `#1B5E20` → `#8D6E63` → `#FFFFFF` | elevation |
| **Combined** | `#6A0DAD` → `#DA70D6` | composite score |

### 11.3 Key UX Interaction Patterns

| Interaction | Implementation |
|---|---|
| **Time Slider** | Scrubs sun position / shadow / rain animation along day timeline |
| **Layer Toggle** | Toggle individual simulation overlays on/off in the 3D scene |
| **Analysis Point Hover** | Tooltip showing exact metric value at clicked point |
| **Comparison Split** | Draggable divider between two design variants in viewport |
| **Orbit Controls** | Rotate, pan, zoom the 3D building model freely |
| **AI Inspector** | Right panel shows contextual AI cards per active simulation layer |
| **Zoom to Issue** | Click an AI insight card to fly camera to the relevant building zone |

### 11.4 Project Setup Wizard (6-Step Flow)

```
Step 1: LOCATION
   ├── Map-based coordinate picker (MapLibre)
   ├── Search by address / coordinates
   └── Auto-detect climate zone + LCZ

Step 2: MODEL UPLOAD
   ├── Drag & drop GLB / IFC / OBJ / FBX
   ├── File size limit: 500MB
   ├── BIM Level 2/3 metadata extraction
   └── Real-time preview in Three.js

Step 3: SURROUNDINGS
   ├── Auto-fetch OSM buildings in radius
   ├── Configurable radius (100m–2000m)
   └── Preview surrounding context in 3D

Step 4: MATERIALS
   ├── Per-surface material assignment
   ├── Preset library (concrete, glass, metal, green roof)
   └── Custom thermal/albedo parameter override

Step 5: SIMULATION CONFIG
   ├── Select which engines to run
   └── Per-engine parameters (resolution, time step)

Step 6: TIME CONFIG
   ├── Date range (single day / seasonal / annual)
   ├── Time zone selection
   └── Custom time step (1h default)
```

---

## 12. API Contract Design

### 12.1 Core Endpoints

```
Authentication
POST   /auth/login
POST   /auth/register
POST   /auth/refresh

Projects
GET    /projects                           # List user projects
POST   /projects                           # Create project
GET    /projects/{id}                      # Get project detail
PUT    /projects/{id}                      # Update project
DELETE /projects/{id}                      # Delete project

Models
POST   /projects/{id}/models               # Upload 3D model
GET    /projects/{id}/models/{model_id}    # Get model metadata
DELETE /projects/{id}/models/{model_id}    # Delete model

Geospatial (proxy to external APIs with caching)
GET    /geo/buildings?lat=&lon=&radius=    # Fetch OSM context buildings
GET    /geo/terrain?lat=&lon=&radius=      # Fetch DEM heightmap
GET    /geo/weather?lat=&lon=             # Fetch weather data
GET    /geo/solar?lat=&lon=&date=         # Fetch NASA POWER solar data

Simulations
POST   /simulations                        # Start simulation
GET    /simulations/{id}                   # Get simulation status + results
GET    /simulations/{id}/viz              # Get visualization payload
GET    /simulations/{id}/metrics          # Get KPI metrics
DELETE /simulations/{id}

AI
GET    /simulations/{id}/insights         # Get AI insight cards
POST   /simulations/{id}/recommendations  # Trigger recommendation engine

Reports
POST   /reports                            # Generate report from simulations
GET    /reports/{id}                       # Get report
GET    /reports/{id}/pdf                  # Download PDF
GET    /reports/{id}/json                 # Export JSON data

WebSocket
WS     /ws/simulations/{id}              # Real-time progress events
```

### 12.2 Simulation Result Schema

```json
{
  "simulation_id": "uuid",
  "type": "solar",
  "status": "completed",
  "progress": 100,
  "metrics": {
    "peak_irradiance_kwh_m2": 842,
    "annual_sunlight_hours": 2340,
    "shading_fraction": 0.64,
    "worst_facing_surface": "north_wall_3",
    "best_facing_surface": "south_roof"
  },
  "viz_data": {
    "type": "heatmap_mesh",
    "faces": [
      {"face_id": "f001", "value": 0.73, "normal": [0,1,0], "color": "#FF8F00"}
    ],
    "sun_path_points": [
      {"hour": 6, "azimuth": 68.2, "altitude": 5.1},
      ...
    ],
    "shadow_frames": [
      {"time": "06:00", "shadow_geometry": "...base64 encoded..."},
      ...
    ]
  },
  "ai_insights": [
    {
      "category": "critical",
      "title": "High solar gain on West glazing",
      "body": "West-facing glazing receives 842 W/m² between 14:00-16:00 in summer...",
      "standard": "ASHRAE 55",
      "recommendation_id": "rec_001",
      "camera_position": {"x": 12, "y": 8, "z": 5}
    }
  ]
}
```

---

## 13. Phased Implementation Roadmap

### Overview Timeline

```
Phase 1 │████████████████│ 10 weeks  │ Foundation + Sun/Shadow
Phase 2 │                │████████████│ 8 weeks  │ Thermal + Terrain
Phase 3 │                            │████████████│ 8 weeks  │ Wind + Rain
Phase 4 │                                        │██████████│ 6 weeks  │ AI Layer + Reports
Phase 5 │                                                  │████████│ 6 weeks  │ Comparison + Polish
         Weeks: 1       10        18        26       32      38
```

**Total Duration: ~38 weeks (≈ 9.5 months)**

---

### Phase 1: Foundation + Sun/Shadow Simulation
**Duration:** 10 weeks | **Goal:** Working 3D viewer with real sun simulation

#### Sprint 1 (Weeks 1–2): Infrastructure & Project Setup
- [ ] Initialize Vite + React frontend, FastAPI backend
- [ ] Configure PostgreSQL + PostGIS database
- [ ] Set up Redis + Celery task queue
- [ ] Configure S3-compatible file storage (AWS S3 or MinIO)
- [ ] Implement JWT authentication (login, register, refresh)
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Docker Compose local development environment
- [ ] Configure CORS, rate limiting, logging

#### Sprint 2 (Weeks 3–4): Project Setup Wizard (Steps 1–3)
- [ ] MapLibre GL interactive location picker (Step 1)
- [ ] Address geocoding via Nominatim/Mapbox
- [ ] GLB/OBJ model upload with Three.js preview (Step 2)
- [ ] Three.js scene setup: OrbitControls, lighting, grid
- [ ] OSM building fetch via Overpass API (Step 3)
- [ ] OSM building extrude and render as context geometry
- [ ] Project CRUD API endpoints
- [ ] Project Dashboard screen

#### Sprint 3 (Weeks 5–6): Geometry Engine + Materials
- [ ] IFC parsing with IfcOpenShell (Step 4 — Materials)
- [ ] GLB/OBJ parsing with trimesh
- [ ] Surface classification (roof/wall/floor)
- [ ] Analysis point grid generation on surfaces
- [ ] Material preset library (concrete/glass/metal/green roof)
- [ ] Project setup wizard completion (Steps 4–6)
- [ ] Building KPI extraction (floor area, height, shape factor)

#### Sprint 4 (Weeks 7–8): Solar Engine
- [ ] Integrate pvlib for precise solar position (azimuth, altitude)
- [ ] Implement ray-casting from analysis points to sun
- [ ] Intersection testing against context buildings
- [ ] Compute per-surface sunlight hours and irradiance
- [ ] Shadow geometry calculation per time step
- [ ] Celery task wrapping + progress events via WebSocket
- [ ] Store results in database

#### Sprint 5 (Weeks 9–10): Sun/Shadow Visualization
- [ ] Three.js DirectionalLight driven by computed solar position
- [ ] Shadow map rendering on building model
- [ ] Surface heatmap shader (yellow→red by irradiance)
- [ ] Sun path polar diagram (Chart.js)
- [ ] Time slider animation (scrub through day)
- [ ] Solar metric cards (peak irradiance, sunlight hours)
- [ ] Analysis point tooltips (click to see exact value)

**Phase 1 Deliverable:** User can set up a project, upload a building model, fetch OSM surroundings, and see an animated sun/shadow simulation with solar irradiance heatmap.

---

### Phase 2: Thermal Engine + Terrain Engine
**Duration:** 8 weeks | **Goal:** Heat mapping + terrain/drainage analysis

#### Sprint 6 (Weeks 11–12): DEM Integration + Terrain Engine
- [ ] OpenTopography / AWS Terrain Tiles integration
- [ ] GeoTIFF parsing with rasterio
- [ ] Three.js terrain mesh from DEM heightmap
- [ ] Slope calculation (D8 algorithm)
- [ ] Flow direction computation
- [ ] TWI (Topographic Wetness Index)
- [ ] Catchment boundary delineation
- [ ] Terrain screen UI + contour layer toggle

#### Sprint 7 (Weeks 13–14): Terrain Visualization + Drainage
- [ ] Terrain elevation gradient shader (green→brown)
- [ ] Flow direction arrows overlay
- [ ] Saturation heatmap grid
- [ ] Contour vector generation
- [ ] Drainage outlet detection + labeling
- [ ] Terrain metrics panel (max slope, soil saturation index)
- [ ] Generate Drainage Report button

#### Sprint 8 (Weeks 15–16): Thermal Engine
- [ ] Weather data fetch (Open-Meteo API)
- [ ] Heat balance calculation per surface (solar incidence + material properties)
- [ ] UTCI (Universal Thermal Climate Index) computation
- [ ] Surface temperature map generation
- [ ] Building energy load estimation (simplified)
- [ ] Heat island effect computation (relative to surroundings)

#### Sprint 9 (Weeks 17–18): Thermal Visualization + Heatmap Screen
- [ ] Building surface temperature heatmap (blue→yellow→red shader)
- [ ] Thermal metrics cards (peak temp, UTCI, energy load)
- [ ] AI Mitigation Strategy panel (rule-based: Green Roof, Dynamic Shading, Cool Pavement)
- [ ] Annual energy load bar chart (Chart.js)
- [ ] Building energy load annual forecast chart
- [ ] Export Thermal Report

**Phase 2 Deliverable:** Full terrain analysis with drainage flow + building thermal heatmap with preliminary AI-driven mitigation suggestions.

---

### Phase 3: Wind Engine + Rain Engine
**Duration:** 8 weeks | **Goal:** Wind streamlines + precipitation flow

#### Sprint 10 (Weeks 19–20): Wind Data + Engine Core
- [ ] Historical wind data fetch (Open-Meteo ERA5)
- [ ] Potential flow field computation around building footprints
- [ ] Streamline integration (Euler method on vector field)
- [ ] Turbulence zone detection (high shear regions)
- [ ] Lawson Pedestrian Comfort Criteria classification
- [ ] Wind Celery task + WebSocket progress

#### Sprint 11 (Weeks 21–22): Wind Visualization
- [ ] Three.js particle system for animated wind streamlines
- [ ] Color-coded by velocity (cyan→blue)
- [ ] Wind compass rose indicator
- [ ] Turbulence zone polygon overlays
- [ ] Velocity distribution bar chart
- [ ] Wind metrics panel (mean velocity, air density, direction)
- [ ] AI Observer Insight cards for wind anomalies

#### Sprint 12 (Weeks 23–24): Rain Engine
- [ ] Precipitation data fetch (Open-Meteo hourly rainfall)
- [ ] Rain particle simulation on building surfaces
- [ ] Surface water flow routing (steepest descent)
- [ ] Accumulation detection on flat surfaces and terrain
- [ ] Runoff coefficient per material type
- [ ] Peak discharge, basin capacity calculations

#### Sprint 13 (Weeks 25–26): Rain / Hydrology Visualization
- [ ] Animated rain particle system
- [ ] Water flow vector arrows on surfaces/terrain
- [ ] Flood risk zone polygon coloring
- [ ] Catchment metrics panel (basin capacity, peak discharge, absorption rate)
- [ ] Rainfall bar chart (hourly)
- [ ] Flood risk zone alert cards
- [ ] Export Analysis Bundle

**Phase 3 Deliverable:** Wind streamline simulation with pedestrian comfort assessment + precipitation flow with flood risk zones.

---

### Phase 4: AI Intelligence Layer + Reports
**Duration:** 6 weeks | **Goal:** Full AI insights, recommendations, and PDF reports

#### Sprint 14 (Weeks 27–28): Insight Engine + AI Integration
- [ ] Simulation result aggregator (collects all engine outputs)
- [ ] Standards threshold checker (ASHRAE 55, Lawson, BS EN 17037)
- [ ] LLM integration (OpenAI GPT-4o-mini API)
- [ ] Prompt template system per simulation type
- [ ] Response parser → structured insight JSON
- [ ] AI Inspector panel — insight cards in UI
- [ ] "Zoom to Issue" camera fly-to feature

#### Sprint 15 (Weeks 29–30): Recommendation Engine
- [ ] Expert-rule recommendation decision tree
- [ ] LLM recommendation augmentation
- [ ] Impact estimation per recommendation
- [ ] Recommendation priority ranking
- [ ] Recommendation cards in right panel
- [ ] "Generate Implementation Plan" workflow

#### Sprint 16 (Weeks 31–32): Report Generation
- [ ] Report schema design (all sections)
- [ ] WeasyPrint PDF generation backend
- [ ] Report Builder UI screen
- [ ] AI Synthesis section in report
- [ ] High-res viewport screenshot capture (Puppeteer/html2canvas)
- [ ] Simulation log timeline in report
- [ ] Export PDF + Share Report buttons
- [ ] JSON export of full simulation dataset

**Phase 4 Deliverable:** AI insights auto-generated after every simulation; exportable PDF report with AI synthesis, simulation screenshots, metrics, and recommendations.

---

### Phase 5: Combined Analysis + Comparison Mode + Polish
**Duration:** 6 weeks | **Goal:** Multi-layer composite score, comparison mode, full production polish

#### Sprint 17 (Weeks 33–34): Combined Analysis View
- [ ] Composite Impact Score algorithm (weighted average across all engines)
- [ ] Multi-layer simultaneous visualization
- [ ] Layer fidelity indicator bars
- [ ] Regional alert system (combined anomalies)
- [ ] "Recalculate Mesh" with updated parameters
- [ ] Live mesh / 3D view toggle

#### Sprint 18 (Weeks 35–36): Comparison Mode
- [ ] Split-view viewport (side-by-side models)
- [ ] Delta Analysis panel (surface area drift, absorption rate diff)
- [ ] Synchronized camera/timeline across both viewports
- [ ] Lock Zoom / Crosshair mode
- [ ] Export Delta Report
- [ ] Scenario naming and management

#### Sprint 19 (Weeks 37–38): Production Polish + Performance
- [ ] Light Mode theme implementation
- [ ] Full responsive layout pass
- [ ] WebGL performance optimization (LOD, instancing, frustum culling)
- [ ] Simulation caching layer (skip re-run if inputs unchanged)
- [ ] Loading states, skeleton screens, error boundaries
- [ ] Onboarding tutorial overlay
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] SEO meta tags + structured data
- [ ] End-to-end test suite (Playwright)
- [ ] Performance budget audit (Core Web Vitals)
- [ ] Production deployment (Vercel + Railway/Render)

**Phase 5 Deliverable:** Fully polished production application — both dark/light themes, comparison mode, composite scoring, optimized performance, E2E tested and deployed.

---

## 14. Technology Stack

### 14.1 Frontend

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **React 18** + **Vite** | Performance, ecosystem, HMR |
| State Management | **Zustand** | Lightweight, no boilerplate |
| 3D Rendering | **Three.js r165** | Industry standard WebGL |
| 3D Formats | **@gltf-transform/core** | GLB/GLTF parsing in browser |
| Map Library | **MapLibre GL JS** | Free, open-source, Mapbox-compatible |
| Charts | **Recharts** + **D3.js** | Sun path polar, bar charts |
| Styling | **Vanilla CSS** + **CSS Variables** | No build overhead, full control |
| Fonts | **Google Fonts** (Space Grotesk + Inter + JetBrains Mono) | Premium feel |
| HTTP Client | **Axios** | Interceptors, cancellation |
| WebSockets | **Native WebSocket API** | Simulation progress events |
| PDF (client) | **jsPDF** + **html2canvas** | Client-side report capture |
| Form handling | **React Hook Form** | Performance-first forms |

### 14.2 Backend

| Layer | Technology | Rationale |
|---|---|---|
| API Framework | **FastAPI** (Python 3.12) | Async, typed, fast, great docs |
| Task Queue | **Celery** + **Redis** | Heavy simulation async execution |
| Database | **PostgreSQL 16** + **PostGIS** | Geospatial columns, reliability |
| ORM | **SQLAlchemy 2.0** | Mature, async support |
| File Storage | **AWS S3** / **MinIO** (local) | Model file storage |
| Geospatial | **rasterio**, **shapely**, **pyproj** | DEM processing, coordinates |
| 3D Parsing | **trimesh**, **ifcopenshell** | GLB/OBJ/IFC model parsing |
| Solar Physics | **pvlib** | Solar position, irradiance |
| Math/Science | **numpy**, **scipy** | Vector field computation |
| AI/LLM | **OpenAI Python SDK** | GPT-4o-mini inference |
| PDF Generation | **WeasyPrint** | Server-side PDF from HTML/CSS |
| Auth | **python-jose** (JWT) | Token auth |
| Caching | **Redis** (via **aioredis**) | API response + simulation caching |
| WebSockets | **FastAPI WebSockets** | Built-in WS support |

### 14.3 Infrastructure / DevOps

| Component | Technology |
|---|---|
| Frontend Hosting | Vercel |
| Backend Hosting | Railway / Render / AWS ECS |
| Database | Supabase (managed Postgres) or AWS RDS |
| Redis | Upstash Redis or AWS ElastiCache |
| File Storage | AWS S3 or Cloudflare R2 |
| CI/CD | GitHub Actions |
| Containerization | Docker + Docker Compose |
| Monitoring | Sentry (errors) + Grafana (metrics) |
| Logging | Loguru + CloudWatch / Loki |

---

## 15. Risk Analysis & Mitigation

### 15.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| **IFC parsing complexity** — IFC format is complex, not all files parse cleanly | High | High | Use IfcOpenShell; add fallback to GLB/OBJ; document supported BIM levels |
| **Wind simulation accuracy** — potential flow is a gross simplification vs real CFD | Medium | High | Be transparent in UI ("indicative only"); validate against known benchmark shapes; add disclaimer |
| **WebGL memory limits** — large IFC files may exceed browser GPU memory | Medium | High | Implement LOD; file size limits; mesh decimation on upload |
| **API rate limiting** — Overpass/OpenWeather have rate limits | High | Medium | Implement aggressive server-side caching (Redis); queue requests; fallback sources |
| **LLM hallucination** — AI generates incorrect recommendations | Medium | High | Always validate with rules-based engine first; LLM only adds language, not logic |
| **DEM tile availability** — some regions have coarse or missing elevation data | Medium | Medium | Multi-source failover (SRTM → Copernicus → AWS Terrain Tiles) |

### 15.2 Product Risks

| Risk | Mitigation |
|---|---|
| **Users don't understand simulation limitations** | Clear "confidence level" indicators; documentation on methodology |
| **Simulation jobs too slow** | Show progress bar; set expectations (<5 min per engine); async + queueing |
| **Free tier abuse** | Rate limit simulations per plan; limit storage; watermark reports on free tier |
| **Data privacy** — users upload proprietary building models | S3 encryption at rest; signed URLs only; GDPR-compliant data deletion |

---

## 16. Success Metrics & KPIs

### 16.1 Platform Health Metrics

| Metric | Target (6 months post-launch) |
|---|---|
| Simulation completion rate | > 90% |
| Average simulation time (all engines) | < 5 minutes |
| 3D viewer load time (P95) | < 3 seconds |
| API uptime | > 99.5% |
| PDF export success rate | > 95% |

### 16.2 User Engagement Metrics

| Metric | Target |
|---|---|
| Monthly Active Users (MAU) | 500+ |
| Projects created per user | > 3 |
| Average simulations per project | > 2 |
| Report exports per month | > 200 |
| Comparison mode usage | > 30% of projects |
| AI insights engagement rate | > 70% |

### 16.3 Technical Quality Metrics

| Metric | Target |
|---|---|
| Lighthouse Performance Score | > 85 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Code test coverage | > 70% |
| Zero critical security vulnerabilities | Continuous |

---

## Appendix A: Screen-by-Screen Implementation Notes

| Screen | Key Technical Challenges | Notes |
|---|---|---|
| **Project Dashboard** | Real-time simulation status polling | Use WebSocket for live updates; React Query for caching |
| **Project Setup Wizard** | IFC parsing progress on upload | Stream parse status via WebSocket; show mesh preview incrementally |
| **Main Analysis Hub** | Multiple Three.js overlay layers | Use layer groups with visibility toggle; avoid re-parsing geometry |
| **Sun/Shadow** | Shadow map precision for large sites | Tune `shadow.camera` frustum tight around site bounds |
| **Wind Flow** | Particle system performance (10k+ particles) | Use `BufferGeometry` + custom shader; limit to 5k particles default |
| **Heat/Thermal** | Per-face vertex color update | Use `VertexColors` on `MeshStandardMaterial`; update buffer attributes |
| **Rain/Hydrology** | Map-based terrain view vs 3D view | Toggle between MapLibre 2D and Three.js 3D seamlessly |
| **Terrain** | DEM texture as heightmap | Use `PlaneGeometry` with vertex displacement; bilinear interpolation |
| **Combined Analysis** | Multi-engine result composition | Normalize all metrics 0–100; weighted composite score |
| **Comparison Mode** | Split viewport synchronization | Shared camera state in Zustand; render two separate Three.js canvases |
| **Report** | PDF with embedded 3D screenshots | Use `renderer.domElement.toDataURL()` before PDF assembly |

---

## Appendix B: Directory Structure (Final)

```
urbaneye/
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   ├── engines/
│   │   ├── stores/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── pages/
│   │   └── styles/
│   ├── public/
│   └── vite.config.js
│
├── backend/                     # FastAPI Python
│   ├── app/
│   │   ├── routers/
│   │   ├── engines/
│   │   ├── services/
│   │   ├── tasks/
│   │   ├── models/
│   │   └── schemas/
│   ├── workers/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml           # Local dev environment
├── .github/workflows/           # CI/CD
└── docs/                        # Architecture docs
    └── UrbanEye_Architecture_Roadmap.md
```

---

*UrbanEye — Transforming environmental data into architectural intelligence.*
*Document prepared for product architecture review — April 2026*
