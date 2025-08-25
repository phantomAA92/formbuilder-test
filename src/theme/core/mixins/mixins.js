import { borderGradient } from './border';
import { maxLine, textGradient } from './text';
import { bgBlur, bgGradient } from './background';
import { softStyles, paperStyles, filledStyles, menuItemStyles } from './global-styles-components';

// ----------------------------------------------------------------------

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const mixins = {
  hideScrollX: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  hideScrollY: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  bgBlur,
  maxLine,
  bgGradient,
  softStyles,
  paperStyles,
  textGradient,
  filledStyles,
  borderGradient,
  menuItemStyles,
};
