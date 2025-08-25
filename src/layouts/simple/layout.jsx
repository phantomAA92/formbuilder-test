import { merge } from 'es-toolkit';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

import { SimpleCompactContent } from './content';
import { SettingsButton } from '../components/settings-button';
import { MainSection, LayoutSection, HeaderSection } from '../core';

// ----------------------------------------------------------------------

export function SimpleLayout({ sx, cssVars, children, slotProps, layoutQuery = 'md' }) {
  const renderHeader = () => {
    const headerSlotProps = { container: { maxWidth: false } };

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: <Logo />,
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/** @slot Help link */}
          <Link
            href="#"
            component={RouterLink}
            color="inherit"
            sx={{ typography: 'subtitle2' }}
          >
            Need help?
          </Link>

          {/** @slot Settings button */}
          <SettingsButton />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => {
    const { compact, ...restContentProps } = slotProps?.content ?? {};

    return (
      <MainSection {...slotProps?.main}>
        {compact ? (
          <SimpleCompactContent layoutQuery={layoutQuery} {...restContentProps}>
            {children}
          </SimpleCompactContent>
        ) : (
          children
        )}
      </MainSection>
    );
  };

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ '--layout-simple-content-compact-width': '448px', ...cssVars }}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
