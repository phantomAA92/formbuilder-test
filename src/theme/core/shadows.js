import { varAlpha } from 'minimal-shared/utils';

import { createTheme } from '@mui/material/styles';

import { grey, common } from './palette';

// ----------------------------------------------------------------------

function updateShadowColor(shadow, colorChannel) {
  return shadow.replace(/rgba\(\d+,\d+,\d+,(.*?)\)/g, (_, alpha) =>
    varAlpha(colorChannel, parseFloat(alpha))
  );
}

function createShadows(colorChannel) {
  // Get default MUI shadows
  const { shadows: defaultShadows } = createTheme();

  return defaultShadows.map((shadow) => updateShadowColor(shadow, colorChannel));
}

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const shadows = {
  light: createShadows(grey['500Channel']),
  dark: createShadows(common.blackChannel),
};
