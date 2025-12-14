// Tailwind Configuration Injection
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#1e40af", // Corporate Deep Blue
                "primary-hover": "#1e3a8a", 
                "secondary": "#64748b", // Slate Grey
                "background-light": "#f8fafc", // Slate 50
                "background-dark": "#0f172a", // Slate 900
                "surface-light": "#ffffff",
                "surface-dark": "#1e293b",
                "border-light": "#e2e8f0", // Slate 200
                "border-dark": "#334155", // Slate 700
                "text-main": "#1e293b", // Slate 800
                "text-muted": "#64748b", // Slate 500
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
        },
    },
}
