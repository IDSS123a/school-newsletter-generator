import React, { useState } from 'react';
import { extractStylesFromUrl } from '../../services/styleExtractorService';
import { FormInput } from './FormControls';

interface Props {
  dispatch: React.Dispatch<any>;
}

export const StyleImporter: React.FC<Props> = ({ dispatch }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    setError(null);

    // A more robust URL validation process.
    // 1. Automatically prepend 'https://' if the user forgets a protocol.
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    
    // 2. Use the browser's native URL parser for validation.
    let parsedUrl;
    try {
      parsedUrl = new URL(fullUrl);
      // A simple `new URL()` can sometimes pass invalid inputs (like 'https:'),
      // so we double-check that the protocol is either http or https.
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('Invalid protocol');
      }
    } catch (err) {
      setError('Please enter a valid URL.');
      return;
    }

    setIsLoading(true);
    dispatch({ type: 'SET_STYLE_IMPORTING', payload: true });

    try {
      // Pass the validated and parsed URL's href property to the service.
      const styles = await extractStylesFromUrl(parsedUrl.href);
      dispatch({ type: 'APPLY_IMPORTED_STYLES', payload: styles });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      dispatch({ type: 'SET_STYLE_IMPORTING', payload: false });
    }
  };
  
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
        <h4 className="text-md font-semibold text-gray-700">🎨 Import Style from Web</h4>
        <p className="text-xs text-gray-600">
            Enter a URL to automatically extract its color scheme and fonts. This will override your current style settings.
        </p>
        <div className="flex items-start space-x-2">
            <div className="flex-grow">
                 <FormInput
                    label=""
                    name="style_import_url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="e.g., your-school-website.com"
                />
            </div>
            <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                // The button uses a relative container and an absolutely positioned spinner
                // to ensure the spinner is perfectly centered. The text span is made
                // invisible during loading to maintain a consistent button size and prevent layout shift.
                className="relative flex justify-center items-center px-4 py-2 mt-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#004080] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
                <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
                    Analyze
                </span>
            </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};