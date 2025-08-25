import FormHelperText from '@mui/material/FormHelperText';

// ----------------------------------------------------------------------

export function HelperText({ sx, helperText, errorMessage, disableGutters = false, ...other }) {
  const message = errorMessage ?? helperText;

  if (!message) {
    return null;
  }

  return (
    <FormHelperText
      error={!!errorMessage}
      sx={[{ mx: disableGutters ? 0 : 1.5 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {errorMessage || helperText}
    </FormHelperText>
  );
}
