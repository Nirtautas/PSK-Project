import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Simulated user list (should be fetched)
const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name: string, selectedUsers: readonly string[], theme: Theme) {
  return {
    fontWeight: selectedUsers.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function SelectUsersField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (selected: string[]) => void;
}) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    const selectedValues = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
    onChange(selectedValues);
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="select-users-label">Select Users</InputLabel>
      <Select
        labelId="select-users-label"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="Select Users" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((user) => (
              <Chip key={user} label={user} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name} style={getStyles(name, value, theme)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
