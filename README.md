# Predict Visualize Train

A React TypeScript application for predicting, visualizing, and training data models.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:8080

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Docker Support

### Development

To run the application in development mode using Docker:

```bash
docker build -t predict-visualize-train:dev --target dev .
docker run -p 8080:8080 -v $(pwd):/app -v /app/node_modules predict-visualize-train:dev
```

### Production

To build and run the production version:

```bash
docker build -t predict-visualize-train .
docker run -p 80:80 predict-visualize-train
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
