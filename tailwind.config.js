/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Montserrat", "sans-serif"],
            },
            colors: {
                text: "#35485c",
                primary: {
                    DEFAULT: "#FF8904",
                    50: "#FFF3E7",
                    100: "#FFE7CF",
                    200: "#FFCF9F",
                    300: "#FFB670",
                    400: "#FF9E40",
                    500: "#FF8904",
                    600: "#E67900",
                    700: "#B35E00",
                    800: "#804300",
                    900: "#4C2800",
                },
            },
            container: {
                center: true,
                screens: { xs: "475px", sm: "600px", md: "728px", lg: "984px", xl: "1240px" },
            },
        },
    },
    plugins: [
        require("tailwind-scrollbar-hide"),
        require("@tailwindcss/line-clamp"),   
    ],
};
