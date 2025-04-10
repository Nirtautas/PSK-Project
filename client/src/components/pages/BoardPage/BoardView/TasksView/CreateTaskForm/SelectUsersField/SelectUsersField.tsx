import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags({setSelectedUsers}: {setSelectedUsers: (value: any) => void})  {
  //TODO: this should be replaced with the actual API call to get users
  const users = [{
      id: 1,
      userRole: 'Owner',
      firstName: 'Jonas',
      lastName: 'Jonaitis'
  },
  {
      id: 2,
      userRole: 'Owner',
      firstName: 'Petras',
      lastName: 'Jonaitis'
  },
  {
      id: 3,
      userRole: 'Owner',
      firstName: 'Eugenijus',
      lastName: 'Jonaitis'
  },
  {
      id: 4,
      userRole: 'Owner',
      firstName: 'Tomas',
      lastName: 'Jonaitis'
  },
  {
      id: 5,
      userRole: 'Owner',
      firstName: 'Tomas',
      lastName: 'Jonaitis'
  }];

  return (
    <Autocomplete
      multiple
      options={users}
      disableCloseOnSelect
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={option.id} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {`${option.firstName} ${option.lastName}`}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="Users" placeholder="Assigned users" />
      )}
      onChange={(event, value) => setSelectedUsers(value)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
    />
  );
}

