import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import BoardOnUserApi from '@/api/boardOnUser.api';
import { BoardUser } from '@/types/types';
import { useEffect, useState } from 'react';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props = {
  setSelectedUsers: (value: any) => void
  boardId: number
}

export default function CheckboxesTags({setSelectedUsers, boardId}: Props)  {
  const [users, setUsers] = useState<BoardUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await BoardOnUserApi.getBoardUsers(boardId)
      setUsers(users.result || [])
    }
    fetchUsers()
  }, [boardId])

  return (
    <Autocomplete
      multiple
      options={users}
      disableCloseOnSelect
      getOptionLabel={(user) => `${user.userName}`}
      renderOption={(props, user, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={user.id} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {`${user.userName}`}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="Users" placeholder="Assigned users" />
      )}
      onChange={(event, value) => setSelectedUsers(value)}
      isOptionEqualToValue={(user, value) => user.id === value.id}
    />
  );
}

