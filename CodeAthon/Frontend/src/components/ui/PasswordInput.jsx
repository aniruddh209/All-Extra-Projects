import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input';

/**
 * Password input with integrated toggle for password visibility.
 */
export const PasswordInput = React.forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      leftIcon={Lock}
      rightIcon={
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="p-1 text-[#71717A] hover:text-[#F5F5F5] transition-colors focus:outline-none"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
