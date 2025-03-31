'use client'

import { useState } from 'react'

import { 
  FormControl, 
  InputLabel, 
  InputAdornment, 
  OutlinedInput, 
  IconButton, 
  FormHelperText 
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

type PasswordInputProps = {
  id?: string;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({
  id = "outlined-adornment-password",
  label = "Password",
  required = false,
  error = false,
  helperText = "",
  value,
  onChange
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" required={required} error={error} fullWidth>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'hide the password' : 'display the password'}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default PasswordInput