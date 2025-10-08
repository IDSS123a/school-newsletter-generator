
import React from 'react';
import type { FormData } from '../../types';
import { FormTextarea, FormSelect } from './FormControls';

interface Props {
  formData: FormData;
  dispatch: React.Dispatch<any>;
}

export const ImageGeneration: React.FC<Props> = ({ formData, dispatch }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { field: e.target.name, value: e.target.value } });
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Optional: Generate an Image</h3>
            <FormTextarea
                label="Describe an image to generate for your newsletter."
                name="imagePrompt"
                value={formData.imagePrompt}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., a happy student holding a book in the library"
                helpText="If you provide a description, the AI will create a unique image and place it in the content."
            />
            <FormSelect
                label="Image Position"
                name="imagePosition"
                value={formData.imagePosition}
                onChange={handleInputChange}
            >
                <option>Top of content</option>
                <option>Middle of content</option>
                <option>Before CTA</option>
            </FormSelect>
        </div>
    );
};
