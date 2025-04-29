import React, { TextareaHTMLAttributes } from 'react';

export default function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border rounded p-2 ${props.className || ''}`}
    />
  );
}
