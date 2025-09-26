# Unified Equinix Portal

A modern, responsive customer portal for Equinix's digital infrastructure services. This React-based application provides customers with a comprehensive platform to browse, configure, and manage their colocation and interconnection services.

## Overview

The Unified Equinix Portal is designed to streamline the customer experience for Equinix's digital infrastructure offerings. The portal enables customers to explore products, design custom solutions, manage quotes and orders, and track their services through an intuitive, modern interface.

### Key Features

- **Product Catalog**: Browse comprehensive colocation and interconnection services
- **Solution Builder**: Design custom infrastructure solutions tailored to specific needs
- **Quote Management**: Create, review, and manage service quotes
- **Order Tracking**: Monitor active orders and service deployments
- **Configuration Tools**: Configure and customize infrastructure services
- **Profile Management**: Manage account settings and preferences
- **Responsive Design**: Optimized for desktop and mobile devices

### Services Covered

- **Colocation Services**: Secure data center space with enterprise-grade infrastructure
- **Interconnection Services**: Direct connectivity to cloud providers, networks, and partners
- **Custom Solutions**: Integrated infrastructure solutions for complex requirements
- **Support Packages**: Various support and service level options

## Tech Stack

- **Frontend**: React 18 with functional components and hooks
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router DOM for client-side navigation
- **State Management**: Zustand for lightweight state management
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for modern iconography
- **Animations**: Framer Motion for smooth interactions

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd unified-equinix-portal
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Navbar, LoadingSpinner)
│   ├── layout/         # Layout components (MainLayout, OrderStepper)
│   ├── products/       # Product-specific components
│   └── ui/             # Basic UI components (Button, Modal)
├── pages/              # Page components for routing
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── data/               # Mock data and API utilities
├── utils/              # Utility functions and constants
└── styles/             # Global stylesheets
```

## Development

This project uses modern React patterns and best practices:

- Functional components with hooks
- Custom hooks for state management and side effects
- Component composition for reusability
- Responsive design with Tailwind CSS
- Modern JavaScript (ES6+) features

### Code Quality

- ESLint configuration for consistent code style
- React-specific linting rules
- Modern React patterns enforcement

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
