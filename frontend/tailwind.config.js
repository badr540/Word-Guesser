module.exports = {
    theme: {
      extend: {
        fontSize: {
          base: "clamp(1rem, 1.5vw, 1.25rem)", // for base text (16px–20px)
          lg: "clamp(1.125rem, 2vw, 1.5rem)",  // for larger text
          xl: "clamp(1.25rem, 3vw, 2rem)",     // etc.
          "2xl": "clamp(1.5rem, 4vw, 2.5rem)",
        },
        keyframes: {
          'shrink-expand': {
            '0%': { transform: 'scaleY(1)'},
            '50%': { transform: 'scaleY(0)'},
            '100%': { transform: 'scaleY(1)', backgroundColor: '#34d399' }, 
          },
        },
        animation: {
          'shrink-expand': 'shrink-expand 1s ease-in-out forwards',
        },
      },
    },
    plugins: [],
  }