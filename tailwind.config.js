/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Design System Colors
        primary: "#DC2626",       // Brand Color (Crimson)
        secondary: "#111111",     // Support Color (Text Primary)
        background: "#FAFAFA",    // Lightest Gray
        surface: "#FFFFFF",       // White Surface
        textPrimary: "#111111",   // Text Primary
        textSecondary: "#6B7280", // Text Secondary
        success: "#16A34A",       // Success
        warning: "#F59E0B",       // Warning
        error: "#DC2626",         // Error
        border: "#EAEAEA",        // Border Color

        // Legacy / Additional helpers
        primaryDark: "#B91C1C",   // Red-700
        primaryLight: "#FEF2F2",  // Red-50
        primaryMid: "#FCA5A5",    // Red-300
        successLight: "#ECFDF5",  // Emerald-50
        warningLight: "#FFFBEB",  // Amber-50
        danger: "#DC2626",        // Red-500
        dangerLight: "#FEF2F2",   // Red-50
        info: "#3B82F6",          // Blue-500
        infoLight: "#EFF6FF",     // Blue-50
        purple: "#8B5CF6",        // Violet-500
        purpleLight: "#F5F3FF",   // Violet-50
        textMain: "#111111",      // Mapped to textPrimary
        textSub: "#6B7280",       // Mapped to textSecondary
        textMuted: "#94A3B8",     // Slate-400
      },
      borderRadius: {
        button: "16px",
        input: "16px",
        card: "24px",
      },
      spacing: {
        button: "56px",
        input: "56px",
        containerPadding: "24px",
        sectionGap: "32px",
        cardGap: "16px",
      },
      fontSize: {
        headline: ["28px", { lineHeight: "1.5", fontWeight: "700" }],
        title: ["20px", { lineHeight: "1.5", fontWeight: "600" }],
        subtitle: ["16px", { lineHeight: "1.5", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

