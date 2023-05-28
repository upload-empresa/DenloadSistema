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
