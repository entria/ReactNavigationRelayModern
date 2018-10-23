import * as React from 'react';
import { render } from 'react-native-testing-library';

import { ThemeProvider } from 'styled-components';

import theme from '../src/theme';

export const withTheme = node => <ThemeProvider theme={{ ...theme }}>{node}</ThemeProvider>;

const customRender = (node, ...options) => {
  return render(withTheme(node), ...options);
};

export * from 'react-native-testing-library';

// override render method
export { customRender as render };
