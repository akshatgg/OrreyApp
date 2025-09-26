# 🌌 Traveling the Orbits - Interactive Solar System Simulator

An interactive 3D orbital mechanics simulator that allows users to explore space travel, satellite trajectories, and orbital dynamics. The project features a comprehensive solar system simulation with gravity assist maneuvers, real-time orbital calculations, and an AI-powered space assistant chatbot.

## 📖 Quick Navigation

- **🚀 [Quick Start](#-quick-start)** - Get up and running in minutes
- **📚 [Documentation & Research](#-documentation--research)** - Complete technical guides and scientific data
- **🔧 [Configuration](#-configuration)** - API keys and customization
- **🐳 [Docker Setup](#-docker-details)** - Containerized deployment
- **🔗 [Useful Links](#-useful-links)** - External resources and references

## 📋 Project Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **README.md** | Project overview, setup guide | `./README.md` (this file) |
| **TECHNICAL_DOCUMENTATION.md** | Complete technical implementation guide | [`./TECHNICAL_DOCUMENTATION.md`](./TECHNICAL_DOCUMENTATION.md) |
| **NASA_ISAC.ipynb** | Research paper with scientific data & analysis | [`./NASA_ISAC.ipynb`](./NASA_ISAC.ipynb) |

## 🚀 Features

- **Interactive 3D Solar System**: Visualize planets, satellites, and their orbital paths
- **Orbital Mechanics Simulation**: Real-time physics calculations for realistic space travel
- **Gravity Assist Maneuvers**: Pre-configured scenarios for complex space missions
- **AI Space Assistant**: Integrated chatbot powered by Google's Gemini API for space-related questions
- **Dynamic Camera Controls**: Click and drag to adjust view, mouse wheel for zoom
- **Time Controls**: Adjust simulation speed and time parameters
- **Trail Visualization**: Track satellite and celestial body movements
- **Responsive Design**: Modern UI with Space Mono typography and dark theme

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6 modules)
- **3D Graphics**: Three.js for 3D rendering and animations
- **Animation**: GSAP (GreenSock) for smooth animations
- **UI Controls**: dat.GUI for interactive parameter controls
- **AI Integration**: Google Gemini API for chatbot functionality
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

### Option 3: Building for Production

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your web server

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
├── 📄 styles.css                     # Additional styling
├── 📁 chatbot/                       # AI chatbot implementation
│   ├── 📄 index.js                   # Chatbot main logic
│   ├── 📄 chatbot.js                 # Core chatbot functionality
│   ├── 📁 components/                # React-like chatbot components
│   ├── 📁 hooks/                     # Custom hooks for API integration
│   └── 📁 styles/                    # Chatbot-specific styles
├── 📁 resources/                     # Static assets and resources
├── 📁 dist/                          # Built files for production
├── 📄 package.json                   # Node.js dependencies and scripts
├── 📄 Dockerfile                     # Docker configuration
├── 📄 docker-compose.yml             # Docker Compose configuration
├── 📄 README.md                      # Project overview and setup guide
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
The project uses Google's Gemini API for the chatbot. For production use:
1. Obtain a Gemini API key from Google AI Studio
2. Replace the API key in `index.html` (line 559)
3. **Important**: For production, move API key to backend for security

### Customization
- **Modify orbital parameters** in `satellite_class.js`
- **Add new celestial bodies** in `solar_system.js`
- **Customize UI appearance** in `index.html` styles section
- **Adjust physics calculations** in relevant JavaScript files

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
3. **Chatbot not responding**: Check API key configuration and network connectivity
4. **Docker issues**: Ensure Docker is running and you have sufficient permissions

### Getting Help
- Check the browser console for error messages
- Verify all dependencies are properly installed
- Ensure you're using a compatible Node.js version
- Use the AI assistant for orbital mechanics questions

---

Made with ❤️ for space exploration enthusiasts and orbital mechanics learners.