
import React from 'react';
import type { FormData } from '../../types';
import { FormInput, FormTextarea } from './FormControls';

interface Props {
  formData: FormData;
  dispatch: React.Dispatch<any>;
}

export const ContentBlocks: React.FC<Props> = ({ formData, dispatch }) => {
  const handleAddBlock = () => {
    dispatch({ type: 'ADD_CONTENT_BLOCK' });
  };

  const handleRemoveBlock = (id: number) => {
    dispatch({ type: 'REMOVE_CONTENT_BLOCK', payload: { id } });
  };

  const handleBlockChange = (id: number, field: 'title' | 'content', value: string) => {
    dispatch({ type: 'UPDATE_CONTENT_BLOCK', payload: { id, field, value } });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center border-b pb-2">
         <h3 className="text-lg font-semibold text-gray-800">Raw Content</h3>
         <button
          type="button"
          onClick={handleAddBlock}
          className="px-3 py-1 text-sm font-medium text-white bg-[#004080] rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          + Add Block
        </button>
      </div>
     
      <p className="text-xs text-gray-500">
        Provide the key information in blocks. Each block title will become a heading. Use the editor below for formatting.
      </p>

      <div className="space-y-4">
        {formData.rawContent.map((block, index) => (
          <div key={block.id} className="p-3 border rounded-md relative bg-gray-50">
             {formData.rawContent.length > 1 && (
                <button
                    type="button"
                    onClick={() => handleRemoveBlock(block.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                    title="Remove Block"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
             )}
            <FormInput
              label={`Block ${index + 1} Title (becomes H2)`}
              name={`block_title_${block.id}`}
              value={block.title}
              onChange={(e) => handleBlockChange(block.id, 'title', e.target.value)}
              placeholder="e.g., Upcoming Events"
            />
            <div className="mt-2">
              <FormTextarea
                label="Content"
                name={`block_content_${block.id}`}
                value={block.content}
                onChange={(e) => handleBlockChange(block.id, 'content', e.target.value)}
                required
                rows={6}
                helpText="You can use Markdown for formatting (e.g., **bold**, *italic*, - lists)."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
