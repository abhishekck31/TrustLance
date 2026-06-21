// This file defines the custom color token system for TrustLance.
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Base/Semantic Tokens ---
        '--background': 'var(--color-background)',
        '--card': 'var(--color-card)',
        '--primary': 'var(--color-primary)',
        '--secondary': 'var(--color-secondary)',
        '--success': 'var(--color-success)',
        '--warning': 'var(--color-warning)',
        '--danger': 'var(--color-danger)',

        // --- Concrete Color Definitions (Example Values - these would typically be defined in globals.css or directly here) ---
        'background': '#F4F4F7',       // Light gray/off-white for background
        'card': '#FFFFFF',            // Pure white for cards
        'primary': '#3B82F6',         // A nice blue (e.g., Tailwind blue-500)
        'secondary': '#6B7280',       // Gray for secondary elements
        'success': '#10B981',         // Green
        'warning': '#F59E0B',         // Amber/Yellow
        'danger': '#EF4444',          // Red
      },
    },
  },
  plugins: [],
}