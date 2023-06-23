import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    blue: {
      '50': '#82CDFC',
      '100': '#CDD6FF',
      '400': '#2FACFA',
      '500': '#2D8BBA',
    },
    blackAlphas: {
      '700': '#82735C',
    },
  },
  breakpoints: {
    '2xl': '2560px',
    xl: '1440px',
    lg: '1024px',
    md: '768px',
    sm: '425px',
    xs: '375px',
    xxs: '320px',
  },
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
  },
  styles: {
    global: {
      body: {
        bg: '#EDF1F2',
      },
    },
  },
});
