
import React, { useState } from 'react';
import type { FormData } from '../../types';
import { FormTextarea, FormSelect } from './FormControls';
import { generateImage } from '../../services/geminiService';

interface Props {
  formData: FormData;
  dispatch: React.Dispatch<any>;
  isPreviewLoading: boolean;
}

export const ImageGeneration: React.FC<Props> = ({ formData, dispatch, isPreviewLoading }) => {
    const [previewError, setPreviewError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        // Clear the existing image from state when prompt changes
        if (e.target.name === 'imagePrompt') {
            dispatch({ type: 'UPDATE_FIELD', payload: { field: 'generatedImageDataUri', value: '' } });
        }
        dispatch({ type: 'UPDATE_FIELD', payload: { field: e.target.name, value: e.target.value } });
    };
    
    const handleGeneratePreview = async () => {
        const trimmedPrompt = formData.imagePrompt.trim();
        if (trimmedPrompt.length < 10) {
            setPreviewError("Prompt must be at least 10 characters long.");
            return;
        }

        dispatch({ type: 'SET_IMAGE_PREVIEW_LOADING', payload: true });
        setPreviewError(null);

        try {
            const url = await generateImage(trimmedPrompt);
            dispatch({ type: 'UPDATE_FIELD', payload: { field: 'generatedImageDataUri', value: url } });
        } catch (err) {
            console.error("Image generation preview failed:", err);
            setPreviewError('The image could not be created. Please try a different prompt.');
            dispatch({ type: 'UPDATE_FIELD', payload: { field: 'generatedImageDataUri', value: '' } });
        } finally {
            dispatch({ type: 'SET_IMAGE_PREVIEW_LOADING', payload: false });
        }
    };


    const trimmedPromptLength = formData.imagePrompt.trim().length;
    const isPromptTooShort = trimmedPromptLength < 10;
    const charCountColor = (trimmedPromptLength < 10 && formData.imagePrompt.length > 0) ? 'text-red-500' : 'text-gray-500';

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
                helpText="If you provide a description (min. 10 characters), you can generate a unique image by clicking the button below."
                charCount={
                    <span className={`text-xs font-medium ${charCountColor}`}>
                        {trimmedPromptLength} / 10
                    </span>
                }
            />
            
            <div className="flex justify-end">
                 <button
                    type="button"
                    onClick={handleGeneratePreview}
                    disabled={isPreviewLoading || isPromptTooShort}
                    className="relative flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#004080] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                     {isPreviewLoading ? 'Generating...' : 'Generate Preview'}
                </button>
            </div>

            {/* Preview Area */}
            {(isPreviewLoading || previewError || formData.generatedImageDataUri) && (
                 <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center min-h-[200px]">
                    {isPreviewLoading && (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <div className="w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                            <p className="mt-2 text-sm">Generating preview...</p>
                        </div>
                    )}
                    {previewError && !isPreviewLoading && (
                        <div className="text-red-600 text-sm text-center">
                            <p className="font-semibold">Error generating preview:</p>
                            <p>{previewError}</p>
                        </div>
                    )}
                    {formData.generatedImageDataUri && !isPreviewLoading && !previewError && (
                        <img 
                            src={formData.generatedImageDataUri} 
                            alt="Generated image preview" 
                            className="rounded-md max-w-full h-auto"
                        />
                    )}
                 </div>
            )}
           
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
