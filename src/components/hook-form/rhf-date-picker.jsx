import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// ----------------------------------------------------------------------

function normalizeDateValue(value) {
  if (dayjs.isDayjs(value)) return value;

  const parsed = value ? dayjs(value) : null;
  return parsed?.isValid() ? parsed : null;
}

// ----------------------------------------------------------------------

export function RHFDatePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          value={normalizeDateValue(field.value)}
          onChange={(newValue) => {
            if (!newValue) {
              field.onChange(null);
              return;
            }

            const parsedValue = dayjs(newValue);
            field.onChange(parsedValue.isValid() ? parsedValue.format() : newValue);
          }}
          slotProps={{
            ...slotProps,
            textField: {
              ...slotProps?.textField,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
            },
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFTimePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          value={normalizeDateValue(field.value)}
          onChange={(newValue) => {
            if (!newValue) {
              field.onChange(null);
              return;
            }

            const parsedValue = dayjs(newValue);
            field.onChange(parsedValue.isValid() ? parsedValue.format() : newValue);
          }}
          slotProps={{
            ...slotProps,
            textField: {
              ...slotProps?.textField,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
            },
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFDateTimePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          value={normalizeDateValue(field.value)}
          onChange={(newValue) => {
            if (!newValue) {
              field.onChange(null);
              return;
            }

            const parsedValue = dayjs(newValue);
            field.onChange(parsedValue.isValid() ? parsedValue.format() : newValue);
          }}
          slotProps={{
            ...slotProps,
            textField: {
              ...slotProps?.textField,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
            },
          }}
          {...other}
        />
      )}
    />
  );
}
