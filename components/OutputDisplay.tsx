
import React, { useState } from 'react';
import type { NewsletterOutput } from '../types';

interface OutputProps {
  output: NewsletterOutput;
}

const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

export const OutputDisplay: React.FC<OutputProps> = ({ output }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output.html);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePreviewInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(output.html);
      newWindow.document.close();
    } else {
      alert('Please allow pop-ups to preview the newsletter.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
         <h3 className="text-lg font-semibold text-gray-700">Live Preview</h3>
         <div className="flex items-center space-x-2">
            <button
                onClick={() => setShowCode(!showCode)}
                title={showCode ? "Show Preview" : "Show HTML Code"}
                className="flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffcc00]"
            >
               {showCode ? 'Preview' : 'View Code'}
            </button>
            <button
                onClick={handlePreviewInNewTab}
                title="Preview in new tab"
                className="flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffcc00]"
            >
                <EyeIcon className="w-4 h-4" />
            </button>
            <button
                onClick={handleCopy}
                title="Copy HTML to clipboard"
                className="flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffcc00]"
            >
                {isCopied ? <CheckIcon className="w-4 h-4 mr-1 text-green-600" /> : <ClipboardIcon className="w-4 h-4 mr-1" />}
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
      </div>
      
      {showCode ? (
        <pre className="p-3 bg-gray-800 text-white rounded-md text-xs overflow-x-auto max-h-[60vh]">
          <code className="font-mono">{output.html}</code>
        </pre>
      ) : (
        <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: '60vh' }}>
          <iframe
            srcDoc={output.html}
            title="Newsletter Preview"
            className="w-full h-full border-0"
            sandbox=""
          />
        </div>
      )}

       <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Next Steps</h3>
        <ul className="list-disc list-inside space-y-1 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
            <li>Review the preview above. If you need changes, adjust the form and regenerate.</li>
            <li>Once satisfied, click "Copy" to get the HTML code.</li>
            <li>Paste it into the source code view of your email marketing tool.</li>
            <li>Always send a test email to yourself before sending to your audience.</li>
        </ul>
      </div>
    </div>
  );
};
