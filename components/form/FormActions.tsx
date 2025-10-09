import React from 'react';

interface Props {
  isLoading: boolean;
  isPreviewLoading: boolean;
  onSave: () => void;
  onLoad: () => void;
}

export const FormActions: React.FC<Props> = ({ isLoading, isPreviewLoading, onSave, onLoad }) => {
  const isAnyActionRunning = isLoading || isPreviewLoading;

  return (
    <div className="pt-4 space-y-3">
        <div className="flex items-center justify-end space-x-3">
            <button
                type="button"
                onClick={onSave}
                disabled={isAnyActionRunning}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
                Save Preferences
            </button>
             <button
                type="button"
                onClick={onLoad}
                disabled={isAnyActionRunning}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
                Load Preferences
            </button>
        </div>
      <button
        type="submit"
        disabled={isAnyActionRunning}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-[#004080] bg-[#ffcc00] hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading && !isPreviewLoading ? 'Generating...' : isPreviewLoading ? 'Generating Image...' : 'Generate Newsletter'}
      </button>
    </div>
  );
};