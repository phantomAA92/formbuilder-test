import { useEffect } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import rtlPlugin from '@mui/stylis-plugin-rtl';

// ----------------------------------------------------------------------

const cacheRtl = createCache({
  key: 'rtl',
  stylisPlugins: [rtlPlugin],
});

export function Rtl({ children, direction }) {
  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  if (direction === 'rtl') {
    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
  }

  return <>{children}</>;
}
