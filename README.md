# EPS Currency Converter

Responsive currency exchange rate dashboard built with React and Vite. Features real-time historical data visualization, multi-currency comparison, and a sleek user interface.

## Features

- 📈 **Historical Rate Visualization**: View 7-day exchange rate trends with sparkline animations.
- 💱 **Multi-Currency Support**: Compare base currency against multiple target currencies.
- 🔄 **Inverse Rates**: Toggle between standard and inverse exchange rates.
- 📱 **Responsive Design**: Fully responsive layout optimized for mobile and desktop.
- 🎨 **Modern UI/UX**:
  - Animated entry/exit for currency rows.
  - Smart positioning for dropdowns.
  - Clean, glassmorphism-inspired aesthetics.
  - Inspiration from [XE Currency Converter](https://www.xe.com/currencyconverter/) design.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State/Data**: React Query (TanStack Query)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd eps-currency-converter
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the App

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port shown in your terminal).

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the optimized assets.

## File Structure

```
src/
├── components/       # Reusable UI components
│   ├── CurrencyTable.tsx    # Main data table
│   ├── CurrencyTracker.tsx  # Dashboard container
│   ├── CustomSelect.tsx     # Animated dropdown
│   └── ...
├── hooks/           # Custom React hooks
│   ├── useCurrencies.ts     # Fetches currency list
│   ├── useHistoricalRates.ts # Fetches rate data
│   └── useSelectState.ts    # Logic for dropdowns
├── routes/          # Application routes (File-based routing)
├── lib/             # Utilities and helpers
├── styles.css       # Global styles and Tailwind directives
└── index.css        # (Optional) Additional global styles
```