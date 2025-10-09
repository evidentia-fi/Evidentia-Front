'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';

interface ICopyToClipboardProps {
  textToCopy: string;
}

export default function CopyToClipboard({ textToCopy }: ICopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Не вдалося скопіювати', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className='flex size-6 cursor-pointer items-center justify-center rounded-full border bg-gray-50'
    >
      {copied ? (
        <Check className='stroke-green-800' size={12} />
      ) : (
        <Copy className='stroke-gray-900' size={12} />
      )}
    </button>
  );
}
