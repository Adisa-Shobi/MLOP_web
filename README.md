# Predict Visualize Train

A React TypeScript application for predicting, visualizing, and training data models.

## Quick Start with Docker Compose

### Prerequisites

- Docker
- Docker Compose

### Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd predict-visualize-train
```

2. Start the development environment:
```bash
docker compose up
```

The application will be available at http://localhost:8080

### Development Workflow

- The application will automatically reload when you make changes to the source code
- All dependencies are managed within the Docker container
- No need to install Node.js or npm locally

### Stopping the Application

To stop the application:
```bash
docker compose down
```

## Features

- Data visualization
- Model training
- Prediction capabilities
- Modern UI with shadcn/ui components
- Responsive design
- TypeScript support

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query
- Recharts
- Axios

## Manual Development Setup (Optional)

If you prefer to develop without Docker, you'll need:

- Node.js 20 or higher
- npm or yarn

Then follow these steps:

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```
