'use client';

import OtpInputBase from 'react-otp-input';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  numInputs?: number;
};

export function OtpInput({ value, onChange, numInputs = 6 }: OtpInputProps) {
  return (
    <div className='w-full max-w-sm' aria-label='One-time password input'>
      <OtpInputBase
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        containerStyle={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'center',
        }}
        renderSeparator={<span className='text-gray-300'>-</span>}
        renderInput={(props) => (
          <input
            {...props}
            className='h-12 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white text-center text-lg font-semibold text-gray-900 outline-none focus:border-[#2C3248] focus:ring-1 focus:ring-[#2C3248]/20'
          />
        )}
      />
    </div>
  );
}
