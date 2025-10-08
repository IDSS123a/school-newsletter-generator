
import React from 'react';
import type { FormData } from '../../types';
import { FormSelect, FormColorPicker, FormInput } from './FormControls';

interface Props {
  formData: FormData;
  dispatch: React.Dispatch<any>;
}

const FONT_FAMILIES = ['Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS', 'Georgia', 'Times New Roman', 'Courier New'];
const FONT_SIZES = Array.from({ length: 19 }, (_, i) => i + 14); // 14px to 32px

export const StyleCustomization: React.FC<Props> = ({ formData, dispatch }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { field: e.target.name, value: e.target.value } });
    };

    return (
        <div className="space-y-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Style Customization</h3>
            
            {/* Body Text Styling */}
            <div>
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3">Body Text</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormSelect label="Font Family" name="bodyFontFamily" value={formData.bodyFontFamily} onChange={handleInputChange}>
                        {FONT_FAMILIES.map(font => <option key={font} value={font}>{font}</option>)}
                    </FormSelect>
                    <FormSelect label="Font Size (px)" name="bodyFontSize" value={formData.bodyFontSize} onChange={handleInputChange}>
                        {FONT_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                    </FormSelect>
                     <FormColorPicker label="Text Color" name="bodyTextColor" value={formData.bodyTextColor} onChange={handleInputChange} />
                </div>
            </div>

            {/* H2 Styling */}
            <div>
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3">Heading 2 (H2)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormSelect label="Font Family" name="h2FontFamily" value={formData.h2FontFamily} onChange={handleInputChange}>
                         {FONT_FAMILIES.map(font => <option key={font} value={font}>{font}</option>)}
                    </FormSelect>
                    <FormSelect label="Font Size (px)" name="h2FontSize" value={formData.h2FontSize} onChange={handleInputChange}>
                        {FONT_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                    </FormSelect>
                    <FormColorPicker label="Color" name="h2Color" value={formData.h2Color} onChange={handleInputChange} />
                </div>
            </div>

            {/* H3 Styling */}
            <div>
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3">Heading 3 (H3)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormSelect label="Font Family" name="h3FontFamily" value={formData.h3FontFamily} onChange={handleInputChange}>
                         {FONT_FAMILIES.map(font => <option key={font} value={font}>{font}</option>)}
                    </FormSelect>
                    <FormSelect label="Font Size (px)" name="h3FontSize" value={formData.h3FontSize} onChange={handleInputChange}>
                         {FONT_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                    </FormSelect>
                    <FormColorPicker label="Color" name="h3Color" value={formData.h3Color} onChange={handleInputChange} />
                </div>
            </div>

            {/* Links and Buttons */}
            <div>
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3">Links & Buttons</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormColorPicker label="Link Color" name="linkColor" value={formData.linkColor} onChange={handleInputChange} />
                    <FormColorPicker label="Button Background" name="buttonBackgroundColor" value={formData.buttonBackgroundColor} onChange={handleInputChange} />
                    <FormColorPicker label="Button Text" name="buttonTextColor" value={formData.buttonTextColor} onChange={handleInputChange} />
                </div>
            </div>
        </div>
    );
};
