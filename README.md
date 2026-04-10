# 🌌 Traveling the Orbits - Interactive Solar System Simulator

> **Live Demo**: [https://akshatgg.github.io/OrreyApp/](https://akshatgg.github.io/OrreyApp/)

An interactive 3D orbital mechanics simulator that allows users to explore space travel, satellite trajectories, and orbital dynamics. The project features a comprehensive solar system simulation with gravity assist maneuvers, real-time orbital calculations, a gravitational field visualization, and an AI-powered space assistant chatbot.

## 📖 Quick Navigation

- **🚀 [Quick Start](#-quick-start)** - Get up and running in minutes
- **🌐 [Gravitational Field Visualization](#-gravitational-field-visualization)** - Spacetime curvature grid
- **📚 [Documentation & Research](#-documentation--research)** - Complete technical guides and scientific data
- **🔧 [Configuration](#-configuration)** - API keys and customization
- **🐳 [Docker Setup](#-docker-details)** - Containerized deployment
- **🔗 [Useful Links](#-useful-links)** - External resources and references

## 📋 Project Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **README.md** | Project overview, setup guide | `./README.md` (this file) |
| **TECHNICAL_DOCUMENTATION.md** | Complete technical implementation guide | [`./TECHNICAL_DOCUMENTATION.md`](./TECHNICAL_DOCUMENTATION.md) |
| **GRAVITY_FIELD_README.md** | Gravitational field visualization docs | [`./GRAVITY_FIELD_README.md`](./GRAVITY_FIELD_README.md) |
| **NASA_ISAC.ipynb** | Research paper with scientific data & analysis | [`./NASA_ISAC.ipynb`](./NASA_ISAC.ipynb) |

## 🚀 Features

- **Interactive 3D Solar System**: Visualize planets, satellites, and their orbital paths
- **Orbital Mechanics Simulation**: Real-time physics calculations for realistic space travel
- **Gravity Assist Maneuvers**: Pre-configured scenarios for complex space missions
- **Gravitational Field Visualization**: Real-time spacetime curvature grid showing gravity wells around all celestial bodies
- **AI Space Assistant with RAG**: Integrated chatbot powered by Groq/Gemini API, augmented with Retrieval-Augmented Generation from the "Orbital Mechanics for Engineering Students" textbook by Howard D. Curtis
- **Dynamic Camera Controls**: Click and drag to adjust view, mouse wheel for zoom
- **Time Controls**: Adjust simulation speed and time parameters
- **Trail Visualization**: Track satellite and celestial body movements
- **Responsive Design**: Modern UI with Space Mono typography and dark theme

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6 modules)
- **3D Graphics**: Three.js for 3D rendering and animations
- **Animation**: GSAP (GreenSock) for smooth animations
- **UI Controls**: dat.GUI for interactive parameter controls
- **AI Integration**: Groq/Gemini API for chatbot with BM25-based RAG pipeline
- **Build Tools**: Vite for development and building
- **Server**: http-server for local development
- **Containerization**: Docker and Docker Compose

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Docker** (optional, for containerized deployment)
- **Docker Compose** (optional, for easy container management)

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd OrreyApp
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.yml up
   ```

3. **Access the application**:
   Open your browser and navigate to `http://localhost:8051`

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd OrreyApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:8051`

### Option 3: GitHub Pages (Live Deployment)

The app is deployed automatically via GitHub Actions on every push to `main`.

**Live URL**: [https://akshatgg.github.io/OrreyApp/](https://akshatgg.github.io/OrreyApp/)

To deploy manually:
```bash
npm run build       # Builds to dist/ with resources
git push origin main # GitHub Actions deploys automatically
```

GitHub Pages setup:
1. Go to repo **Settings > Pages**
2. Set Source to **GitHub Actions**
3. Pushes to `main` trigger automatic build and deploy

### Option 4: Building for Production

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to any static hosting (Netlify, Vercel, etc.)

## 📁 Project Structure

```
OrreyApp/
├── 📄 index.html                     # Main HTML file with embedded styles
├── 📄 main.js                        # Main application entry point
├── 📄 solar_system.js                # Solar system simulation logic
├── 📄 planet.js                      # Planet class definitions
├── 📄 satellite_class.js             # Satellite physics and controls
├── 📄 trail.js                       # Orbital trail visualization
├── 📄 basic_orbit.js                 # Basic orbital mechanics
├── 📄 gravity_field.js               # Gravitational field visualization
├── 📄 space-agent.js                 # AI space assistant (Groq/Gemini + RAG)
├── 📄 vite.config.js                 # Vite build config with GitHub Pages base path
├── 📄 styles.css                     # Additional styling
├── 📁 rag/                           # RAG (Retrieval-Augmented Generation) system
│   ├── 📄 preprocess.js              # PDF extraction & chunking script
│   ├── 📄 retriever.js               # Client-side BM25 search engine
│   └── 📄 knowledge-base.json        # Pre-computed textbook chunks (487 chunks)
├── 📁 chatbot/                       # AI chatbot components
│   ├── 📄 index.js                   # Chatbot main logic
│   ├── 📄 chatbot.js                 # Core chatbot functionality
│   ├── 📁 components/                # React-like chatbot components
│   ├── 📁 hooks/                     # Custom hooks for API integration
│   └── 📁 styles/                    # Chatbot-specific styles
├── 📁 Papers/                        # Reference textbooks and reports
│   └── 📄 Curtis_OrbitamMech...pdf   # Source textbook for RAG knowledge base
├── 📁 resources/                     # Static assets and resources
├── 📄 package.json                   # Node.js dependencies and scripts
├── 📄 Dockerfile                     # Docker configuration
├── 📄 docker-compose.yml             # Docker Compose configuration
├── 📄 README.md                      # Project overview and setup guide
├── 📄 GRAVITY_FIELD_README.md        # Gravitational field visualization docs
├── 📄 TECHNICAL_DOCUMENTATION.md     # Complete technical documentation
└── 📄 NASA_ISAC.ipynb                # Research paper and data analysis
```

## 🎮 How to Use

### Getting Started
1. **Launch the application** using one of the methods above
2. **Read the welcome message** that appears on screen
3. **Click "Galactic Travel"** to begin exploring

### Controls
- **Camera**: Click and drag to rotate view around focused object
- **Zoom**: Use mouse wheel to zoom in/out
- **Focus**: Switch between satellite and Earth focus during simulation
- **Time Controls**: Adjust simulation speed and time parameters
- **GUI Panel**: Use the control panel (top-right) to modify simulation parameters

### Simulation Options
- **Presets**: Choose from pre-configured gravity assist (GA) scenarios
- **Custom Parameters**: Set up custom satellite initial conditions
- **Launch**: Start the simulation with your chosen parameters
- **Reset**: Return to initial state

### AI Assistant
- **Chat Icon**: Click the floating chat button (bottom-right) to open the space assistant
- **Ask Questions**: Get help with orbital mechanics, space exploration, or simulator usage
- **Expand Chat**: Use the expand button for a larger chat interface

## 🧠 RAG (Retrieval-Augmented Generation)

The AI assistant uses a RAG pipeline to ground its answers in the "Orbital Mechanics for Engineering Students" textbook by Howard D. Curtis, rather than relying solely on the LLM's training data.

### How It Works

```
User asks: "What is a Hohmann transfer?"
      |
      v
1. RETRIEVE  -->  BM25 searches 487 pre-indexed textbook chunks
                  --> Finds Chapter 6 "Hohmann Transfer" (score: 12.04)
      |
      v
2. AUGMENT   -->  Top 4 relevant chunks appended to the LLM prompt
                  as TEXTBOOK CONTEXT
      |
      v
3. GENERATE  -->  Groq/Gemini answers grounded in the actual textbook
```

### Architecture

| Component | File | Purpose |
|-----------|------|---------|
| Preprocessor | `rag/preprocess.js` | One-time script: extracts PDF, chunks by section, computes BM25 index |
| Knowledge Base | `rag/knowledge-base.json` | 487 chunks with term frequencies, covering all 11 chapters |
| Retriever | `rag/retriever.js` | Client-side BM25 search with title boosting and deduplication |
| Integration | `space-agent.js` | Retrieves context before every LLM call, augments the prompt |

### Textbook Coverage

| Chapters | Topic |
|----------|-------|
| 1-2 | Dynamics of Point Masses, The Two-Body Problem |
| 3-4 | Orbital Position as a Function of Time, Orbits in Three Dimensions |
| 5-6 | Preliminary Orbit Determination, Orbital Maneuvers |
| 7-8 | Relative Motion and Rendezvous, Interplanetary Trajectories |
| 9-11 | Rigid-Body Dynamics, Satellite Attitude Dynamics, Rocket Vehicle Dynamics |

### Knowledge Base Stats

| Metric | Value |
|--------|-------|
| Total chunks | 487 |
| Avg chunk length | 249 tokens |
| Vocabulary size | 8,057 terms |
| File size (raw) | 2.57 MB |
| File size (gzipped) | 588 KB |
| Retrieval algorithm | BM25 (K1=1.5, B=0.75) |

### Regenerating the Knowledge Base

If the source PDF is updated, regenerate the knowledge base:

```bash
# Requires poppler (pdftotext)
# macOS: brew install poppler
# Linux: apt-get install poppler-utils

node rag/preprocess.js
```

## 🌐 Gravitational Field Visualization

A real-time spacetime curvature visualization that renders a wireframe grid on the orbital plane. The grid warps downward around celestial bodies, creating visible gravity wells — the classic general relativity "rubber sheet" analogy.

For full technical details, see [`GRAVITY_FIELD_README.md`](./GRAVITY_FIELD_README.md).

### How It Works

Each frame, every vertex on the grid computes the combined gravitational potential from all 13 celestial bodies using the formula `phi = SUM(log(1 + Mass / Distance))`. Vertices displace downward proportional to the field strength, creating visible "dips" around massive objects. The wireframe colors shift from dark purple (flat) to glowing cyan/white (deep wells), interacting with the bloom post-processing for a natural glow effect.

### Grid Specifications

| Parameter | Value | Description |
|-----------|-------|-------------|
| Grid Size | 250 units | Covers -125 to +125 from Sun (adjustable up to 700) |
| Segments | 150 x 150 | Number of subdivisions per axis |
| Total Vertices | 22,801 | (151 x 151) grid intersection points |
| Total Grid Cells | 22,500 | Individual wireframe squares |
| Grid Gap | ~1.67 units | Distance between adjacent vertices |

### Planet Coverage

| Planet | Distance (units) | Visible on Grid |
|--------|-------------------|-----------------|
| Mercury | ~3.9 | Yes |
| Venus | ~7.2 | Yes |
| Earth | ~10 | Yes |
| Mars | ~15 | Yes |
| Ceres | ~27 | Yes |
| Jupiter | ~52 | Yes |
| Saturn | ~96 | Yes |
| Uranus | ~192 | Extend grid to 400+ |
| Neptune | ~300 | Extend grid to 600+ |

### Controls

The gravity field can be toggled **ON/OFF** in two ways (both stay in sync):

1. **Navbar Button** — "Gravity Field" button in the top navigation bar (glows when active)
2. **GUI Checkbox** — "Show Field" in the Gravity Field folder (top-right panel)

| Control | Range | Default | Description |
|---------|-------|---------|-------------|
| Show Field | on / off | off | Toggle visibility |
| Well Depth | 0.5 - 10.0 | 2.0 | Exaggeration of well displacement |
| Opacity | 0.1 - 1.0 | 0.7 | Grid transparency |
| Grid Size | 40 - 700 | 250 | Coverage area in world units |

### Color Gradient

| Field Strength | Color | Effect |
|---------------|-------|--------|
| Flat (no gravity) | Near-black purple | Invisible — below bloom threshold |
| Weak field | Dark teal | Faint glow |
| Medium field | Bright cyan | Blooms visibly |
| Deep well center | White | Strong bloom glow |

### Performance

- ~296,000 distance calculations per frame across 22,801 vertices and 13 bodies
- Estimated ~1-3ms CPU time per frame (well within 60fps budget)
- Entire computation skipped when field is toggled OFF

---

## 📚 Documentation & Research

This project includes comprehensive documentation and research materials to help users understand the implementation and scientific background.

### 📖 Technical Documentation

**Location**: [`TECHNICAL_DOCUMENTATION.md`](./TECHNICAL_DOCUMENTATION.md)

A complete technical guide covering:

- **System Architecture** - High-level design and component interactions
- **Technology Stack** - Detailed breakdown of all libraries and frameworks used
- **Physics Engine** - Mathematical implementation of orbital mechanics
- **Data Flow** - How information moves through the application
- **API Integration** - Google Gemini AI assistant implementation
- **Component Analysis** - In-depth code explanations
- **Deployment Guide** - Docker and cloud deployment instructions
- **Development Guidelines** - Best practices and coding standards
- **Troubleshooting** - Common issues and solutions

**Key Sections Include:**
```
1. Project Overview & Features
2. Complete Technology Stack Analysis
3. System Architecture Diagrams
4. Real-time Data Flow Pipeline
5. Installation & Setup Instructions
6. Google Gemini API Integration
7. N-Body Physics Engine Details
8. File Structure & Component Analysis
9. Docker Deployment Guide
10. Performance Optimization
11. Security Considerations
12. Development Best Practices
```

### 🔬 Research Paper & Data Analysis

**Location**: [`NASA_ISAC.ipynb`](./NASA_ISAC.ipynb)

A Jupyter notebook containing scientific research and data analysis:

**Research Components:**
- **Astronomical Data** - Real planetary parameters and orbital mechanics
- **Mathematical Models** - Kepler's laws and gravitational physics implementation
- **Data Visualization** - Graphs and charts of orbital trajectories
- **Performance Analysis** - Simulation accuracy and computational efficiency
- **Case Studies** - Famous space missions and gravity assist maneuvers
- **Educational Content** - Interactive lessons on orbital mechanics

**Scientific Data Sources:**
- NASA JPL (Jet Propulsion Laboratory) ephemeris data
- International Astronomical Union (IAU) planetary constants
- ESA (European Space Agency) mission data
- Real spacecraft trajectory calculations

**Notebook Sections:**
```python
# 1. Data Import and Preprocessing
# 2. Planetary Physics Calculations
# 3. Orbital Mechanics Visualization
# 4. Gravity Assist Analysis
# 5. Mission Trajectory Planning
# 6. Performance Benchmarking
# 7. Educational Demonstrations
```

### 📊 How to Use the Documentation

#### **For Developers:**
1. **Start with**: `README.md` (this file) for quick setup
2. **Deep dive**: `TECHNICAL_DOCUMENTATION.md` for implementation details
3. **Research**: `NASA_ISAC.ipynb` for scientific background

#### **For Students/Researchers:**
1. **Scientific basis**: `NASA_ISAC.ipynb` for mathematical foundations
2. **Implementation**: `TECHNICAL_DOCUMENTATION.md` for code understanding
3. **Practical use**: `README.md` for hands-on exploration

#### **For Educators:**
1. **Lesson planning**: `NASA_ISAC.ipynb` for curriculum content
2. **Technical setup**: `README.md` and `TECHNICAL_DOCUMENTATION.md`
3. **Interactive demos**: Use the live application with students

### 🎯 Documentation Features

- **Comprehensive Coverage** - Every aspect of the project is documented
- **Multiple Formats** - Markdown for technical docs, Jupyter for research
- **Visual Diagrams** - Architecture and data flow illustrations
- **Code Examples** - Practical implementation snippets
- **Scientific Accuracy** - Real astronomical data and physics
- **Educational Value** - Suitable for learning orbital mechanics
- **Deployment Ready** - Production deployment instructions

### 📝 Contributing to Documentation

To improve or update the documentation:

1. **Technical Docs**: Edit `TECHNICAL_DOCUMENTATION.md` directly
2. **Research Content**: Use Jupyter to modify `NASA_ISAC.ipynb`
3. **General Info**: Update this `README.md` file

```bash
# Generate PDF documentation (optional)
# Open TECHNICAL_DOCUMENTATION.md in browser and print to PDF
# Or use pandoc: pandoc TECHNICAL_DOCUMENTATION.md -o docs.pdf
```

## 🔧 Configuration

### API Keys
The project uses Groq (default) or Google Gemini for the AI chatbot. Configure via `.env`:

```bash
# Copy the example and fill in your keys
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_GROQ_API_KEY` | Groq API key (get from [console.groq.com](https://console.groq.com)) |
| `VITE_GROQ_MODEL` | Groq model name (default: `openai/gpt-oss-120b`) |
| `VITE_GEMINI_API_KEY` | Google Gemini API key (get from [Google AI Studio](https://aistudio.google.com/)) |
| `VITE_AI_PROVIDER` | Which provider to use: `groq` or `gemini` |

To switch providers, change `AI_PROVIDER` in `space-agent.js` or set `VITE_AI_PROVIDER` in `.env`.

**Important**: For production, move API keys to a backend proxy for security.

### Customization
- **Modify orbital parameters** in `satellite_class.js`
- **Add new celestial bodies** in `solar_system.js`
- **Customize UI appearance** in `index.html` styles section
- **Adjust physics calculations** in relevant JavaScript files
- **Update RAG knowledge base** by replacing the PDF in `Papers/` and running `node rag/preprocess.js`

## 🐳 Docker Details

### Dockerfile
- Based on official Node.js image
- Installs dependencies and serves application on port 8051
- Optimized for production deployment

### Docker Compose
- Simplified container management
- Port mapping: `8051:8051`
- Volume mounting for development
- Restart policy: `unless-stopped`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source. Please check the repository for license details.

## 🚨 Security Notes

- **API Keys**: Never expose API keys in client-side code for production
- **CORS**: Configure proper CORS policies for production deployment
- **HTTPS**: Use HTTPS in production for secure API communications

## 🔗 Useful Links

### 📖 Project Documentation
- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md) - Complete implementation guide
- [Research Paper & Data](./NASA_ISAC.ipynb) - Scientific analysis and astronomical data
- [Project README](./README.md) - This file with setup instructions

### 🌐 External Resources
- [Three.js Documentation](https://threejs.org/docs/) - 3D graphics library
- [GSAP Documentation](https://greensock.com/docs/) - Animation library
- [dat.GUI Documentation](https://github.com/dataarts/dat.gui) - UI controls library
- [Google Gemini API](https://ai.google.dev/) - AI chatbot integration
- [Docker Documentation](https://docs.docker.com/) - Containerization
- [Vite Documentation](https://vitejs.dev/) - Build tool
- [Vercel Deployment](https://vercel.com/docs) - Cloud deployment platform

### 🚀 Space & Orbital Mechanics
- [NASA JPL Ephemeris](https://ssd.jpl.nasa.gov/horizons/) - Real planetary data
- [ESA Mission Archives](https://www.esa.int/Science_Exploration) - Space mission data
- [Orbital Mechanics Fundamentals](https://en.wikipedia.org/wiki/Orbital_mechanics) - Educational resource

## 🆘 Troubleshooting

### Common Issues
1. **Port 8051 already in use**: Change port in `package.json` and `Dockerfile`
2. **Dependencies not installing**: Delete `node_modules` and run `npm install` again
3. **Chatbot not responding**: Check API key configuration in `.env` and network connectivity
4. **Docker issues**: Ensure Docker is running and you have sufficient permissions
5. **RAG not working**: Check browser console for `[RAG] Loaded 487 chunks` message. If missing, verify `rag/knowledge-base.json` exists
6. **Regenerating knowledge base fails**: Install poppler (`brew install poppler` on macOS) and ensure the PDF exists in `Papers/`

### Getting Help
- Check the browser console for error messages
- Verify all dependencies are properly installed
- Ensure you're using a compatible Node.js version
- Use the AI assistant for orbital mechanics questions

---

Made with ❤️ for space exploration enthusiasts and orbital mechanics learners.