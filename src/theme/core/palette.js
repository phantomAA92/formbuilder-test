import { varAlpha, createPaletteChannel } from 'minimal-shared/utils';

import { opacity } from './opacity';
import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

/**
 * ➤
 * ➤ ➤ Core palette (primary, secondary, info, success, warning, error, common, grey)
 * ➤
 */
export const primary = createPaletteChannel(themeConfig.palette.primary);
export const secondary = createPaletteChannel(themeConfig.palette.secondary);
export const info = createPaletteChannel(themeConfig.palette.info);
export const success = createPaletteChannel(themeConfig.palette.success);
export const warning = createPaletteChannel(themeConfig.palette.warning);
export const error = createPaletteChannel(themeConfig.palette.error);
export const common = createPaletteChannel(themeConfig.palette.common);
export const grey = createPaletteChannel(themeConfig.palette.grey);

/**
 * ➤
 * ➤ ➤ Text, background, action
 * ➤
 */
export const text = {
  light: createPaletteChannel({ primary: grey[800], secondary: grey[600], disabled: grey[500] }),
  dark: createPaletteChannel({ primary: '#FFFFFF', secondary: grey[500], disabled: grey[600] }),
};

export const background = {
  light: createPaletteChannel({ paper: '#FFFFFF', default: '#FFFFFF', neutral: grey[200] }),
  dark: createPaletteChannel({ paper: grey[800], default: grey[900], neutral: '#28323D' }),
};

export const action = (mode) => ({
  active: mode === 'light' ? grey[600] : grey[500],
  hover: varAlpha(grey['500Channel'], 0.08),
  selected: varAlpha(grey['500Channel'], 0.16),
  focus: varAlpha(grey['500Channel'], 0.24),
  disabled: varAlpha(grey['500Channel'], 0.8),
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  selectedOpacity: 0.08,
  focusOpacity: 0.12,
  activatedOpacity: 0.12,
  disabledOpacity: 0.48,
});

/**
 * ➤
 * ➤ ➤ Extended palette
 * ➤
 */
export const extendPalette = {
  shared: {
    inputUnderline: varAlpha(grey['500Channel'], opacity.inputUnderline),
    inputOutlined: varAlpha(grey['500Channel'], 0.2),
    paperOutlined: varAlpha(grey['500Channel'], 0.16),
    buttonOutlined: varAlpha(grey['500Channel'], 0.32),
  },
};

/**
 * ➤
 * ➤ ➤ Base configuration
 * ➤
 */
const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  common,
  grey,
  divider: varAlpha(grey['500Channel'], 0.2),
  TableCell: { border: varAlpha(grey['500Channel'], 0.2) },
  ...extendPalette,
};

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const palette = {
  light: {
    ...basePalette,
    text: text.light,
    background: background.light,
    action: action('light'),
  },
  dark: {
    ...basePalette,
    text: text.dark,
    background: background.dark,
    action: action('dark'),
  },
};

export const colorKeys = {
  palette: ['primary', 'secondary', 'info', 'success', 'warning', 'error'],
  common: ['black', 'white'],
};
