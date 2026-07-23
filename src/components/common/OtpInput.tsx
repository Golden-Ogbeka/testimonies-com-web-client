'use client';

import OtpInputBase from 'react-otp-input';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  numInputs?: number;
};

export function OtpInput({ value, onChange, numInputs = 6 }: OtpInputProps) {
  return (
    <div className="w-full max-w-sm" aria-label="One-time password input">
      <OtpInputBase
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        containerStyle={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'center',
        }}
        renderSeparator={<span className="text-border-light">-</span>}
        renderInput={(props) => (
          <input
            {...props}
            className="h-12 min-w-0 flex-1 rounded-none border border-border bg-background text-center text-lg font-semibold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        )}
      />
    </div>
  );
}
