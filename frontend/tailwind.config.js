module.exports = {
    theme: {
      extend: {
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