import React, { useCallback } from 'react';
import type { FormData, ContentBlock } from '../../types';
import { FormInput } from './FormControls';
import { RichTextEditor } from '../form/RichTextEditor';

interface ContentBlockItemProps {
  block: ContentBlock;
  index: number;
  onBlockChange: (id: number, field: 'title' | 'content', value: string) => void;
  onRemoveBlock: (id: number) => void;
  isOnlyBlock: boolean;
}

const ContentBlockItem: React.FC<ContentBlockItemProps> = ({ block, index, onBlockChange, onRemoveBlock, isOnlyBlock }) => {
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBlockChange(block.id, 'title', e.target.value);
  };
  
  const handleContentChange = useCallback((content: string) => {
    onBlockChange(block.id, 'content', content);
  }, [onBlockChange, block.id]);
  
  const handleRemove = () => {
    onRemoveBlock(block.id);
  };

  return (
    <div className="p-3 border rounded-md relative bg-gray-50">
      {!isOnlyBlock && (
        <button
            type="button"
            onClick={handleRemove}
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
        onChange={handleTitleChange}
        placeholder="e.g., Upcoming Events"
      />
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content<span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          value={block.content}
          onChange={handleContentChange}
          placeholder="Enter content for this block..."
        />
      </div>
    </div>
  );
};
const MemoizedContentBlockItem = React.memo(ContentBlockItem);


interface Props {
  formData: FormData;
  dispatch: React.Dispatch<any>;
}

export const ContentBlocks: React.FC<Props> = ({ formData, dispatch }) => {
  const handleAddBlock = useCallback(() => {
    dispatch({ type: 'ADD_CONTENT_BLOCK' });
  },[dispatch]);

  const handleRemoveBlock = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_CONTENT_BLOCK', payload: { id } });
  }, [dispatch]);

  const handleBlockChange = useCallback((id: number, field: 'title' | 'content', value: string) => {
    dispatch({ type: 'UPDATE_CONTENT_BLOCK', payload: { id, field, value } });
  }, [dispatch]);

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
          <MemoizedContentBlockItem
            key={block.id}
            block={block}
            index={index}
            onBlockChange={handleBlockChange}
            onRemoveBlock={handleRemoveBlock}
            isOnlyBlock={formData.rawContent.length <= 1}
          />
        ))}
      </div>
    </div>
  );
};