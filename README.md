# AeroSight - NASA Space Apps Challenge

AeroSight is a modern, immersive web dashboard that visualizes real-time and forecasted air quality data using NASA TEMPO satellite data, ground sensors, and weather forecasts. Built for the NASA Space Apps Challenge 2024.

## 🚀 Features

### 🌍 3D Earth Visualization
- Interactive 3D globe powered by Three.js
- Real-time air quality heat zones with color-coded AQI levels
- Clickable locations with detailed metrics
- Smooth rotation and zoom controls

### 📊 Real-time Monitoring
- Live air quality metrics (PM2.5, PM10, NO₂, O₃, CO, SO₂)
- Color-coded AQI indicators (Green to Red scale)
- Location-based data from NASA TEMPO satellite
- Ground sensor integration

### 📈 Predictive Analytics
- 24-72 hour air quality forecasts
- Interactive charts with Recharts
- Weather correlation data
- AI-powered insights and recommendations

### 🎨 Futuristic UI/UX
- Dark space-inspired theme with neon accents
- Glassmorphism design elements
- Smooth animations with Framer Motion
- Responsive design for all devices
- NASA branding and mission control aesthetics

### 🔔 Smart Notifications
- Real-time air quality alerts
- Severity-based warning system
- Location-specific notifications
- Dismissible alert system

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **3D Graphics**: Three.js
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Orbitron, Rajdhani, Poppins

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aerosight
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── globe/          # 3D globe visualization
│   ├── dashboard/      # Dashboard-specific components
│   └── charts/         # Data visualization components
├── pages/              # Main application pages
├── data/               # Mock data and constants
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🌟 Key Components

### GlobeVisualization
- Three.js-powered 3D Earth
- Air quality data points with color coding
- Interactive controls and hover effects
- Real-time data updates

### AQIChart
- Recharts-based forecast visualization
- Multi-metric display (AQI, PM2.5, PM10, etc.)
- Interactive tooltips and legends
- Smooth animations

### Sidebar
- Location selection and search
- Alert management
- AI insights panel
- Real-time metrics display

### NotificationBanner
- Dynamic alert system
- Severity-based styling
- Dismissible notifications
- Auto-expiration handling

## 🎨 Design System

### Colors
- **Space Dark**: `#0A0A0A` - Primary background
- **Space Blue**: `#1a1a2e` - Secondary background
- **Neon Cyan**: `#00ffff` - Primary accent
- **Neon Blue**: `#0080ff` - Secondary accent
- **Neon Purple**: `#8000ff` - Tertiary accent

### Typography
- **Orbitron**: Headers and titles (futuristic)
- **Rajdhani**: UI elements and labels
- **Poppins**: Body text and descriptions

### Effects
- Glassmorphism panels with backdrop blur
- Neon glow effects and gradients
- Smooth transitions and animations
- Particle background effects

## 📊 Data Sources

### Mock Data Includes:
- **NASA TEMPO Satellite Data**: Air quality measurements
- **Ground Sensors**: Local air quality monitoring
- **Weather Forecasts**: Temperature, humidity, wind data
- **AQI Calculations**: Real-time air quality indices

### Supported Metrics:
- AQI (Air Quality Index)
- PM2.5 (Fine particulate matter)
- PM10 (Coarse particulate matter)
- NO₂ (Nitrogen dioxide)
- O₃ (Ozone)
- CO (Carbon monoxide)
- SO₂ (Sulfur dioxide)

## 🌍 Supported Locations

- Toronto, Canada
- London, United Kingdom
- Tokyo, Japan
- New York, United States
- Beijing, China

## 🚀 Deployment

The application is built as a static site and can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your repository
- **GitHub Pages**: Use GitHub Actions
- **AWS S3**: Upload build files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is created for the NASA Space Apps Challenge 2024. Please refer to the challenge guidelines for usage terms.

## 🙏 Acknowledgments

- **NASA** for providing TEMPO satellite data
- **Space Apps Challenge** for the inspiration
- **Three.js** community for 3D graphics support
- **Open source** libraries and tools used

## 📞 Contact

For questions or support regarding this project, please reach out through the NASA Space Apps Challenge platform.

---

**Built with ❤️ for NASA Space Apps Challenge 2024**

*Visualizing Earth's Breath — Real-time Air Quality from Space*
