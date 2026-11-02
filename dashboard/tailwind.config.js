/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        ink: {
          primary: "#1E293B",
          muted: "#475569", // Slate 600 (WCAG AA kontras > 5.0:1)
          faint: "#94A3B8",
        },
        sdg: "#E5243B", // SDG 1 Red
        okabe: {
          blue: "#0072B2",   // Klaster 1: Perkotaan Modern & Formal
          amber: "#E69F00",  // Klaster 2: Kabupaten Penyangga Mapan
          teal: "#009E73",   // Klaster 3: Perdesaan Agraris Rentan
          vermillion: "#D55E00", // Klaster 4: Wilayah 3T Deprivasi Akut
        },
        quadrant: {
          q1: "#D55E00", // Prioritas Utama / Beban Ganda
          q2: "#E69F00", // Kerentanan Tersembunyi
          q3: "#CC79A7", // Kantong Kemiskinan Daya Beli
          q4: "#0072B2", // Wilayah Terbina / Mapan
          q1_bg: "rgba(213, 94, 0, 0.07)",
          q2_bg: "rgba(230, 159, 0, 0.07)",
          q3_bg: "rgba(204, 121, 167, 0.07)",
          q4_bg: "rgba(0, 114, 178, 0.07)",
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
