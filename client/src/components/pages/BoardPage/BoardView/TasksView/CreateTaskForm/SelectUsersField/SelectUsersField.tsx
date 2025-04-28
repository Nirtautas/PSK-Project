import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import BoardOnUserApi from '@/api/boardOnUser.api';
import { BoardUser, TaskUser } from '@/types/types';
import { useEffect, useState } from 'react';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props = {
	onUsersChange: (value: any) => void
	selectedUsers?: TaskUser[]
	boardId: number
}

export default function CheckboxesTags({ onUsersChange, selectedUsers, boardId }: Props) {
	const [users, setUsers] = useState<BoardUser[]>([])
	const [selected, setSelected] = useState<BoardUser[]>([])

	useEffect(() => {
		const fetchUsers = async () => {
			const users = await BoardOnUserApi.getBoardUsers(boardId)
			setUsers(users.result || [])
			if (selectedUsers && users.result) {
				const selectedFiltered = (users.result).filter(u =>
					selectedUsers.some(su => su.id === u.id)
				)
				setSelected(selectedFiltered)
			}
		}
		fetchUsers()
	}, [boardId])

	return (
		<Autocomplete
			multiple
			options={users}
			value={selected}
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
			onChange={(event, value) => {
				onUsersChange(value)
				setSelected(value)
			}}
			isOptionEqualToValue={(user, value) => user.id === value.id}
		/>
	);
}

