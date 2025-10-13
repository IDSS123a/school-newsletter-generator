import React from 'react';
import type { FormData } from '../../types';
import { FormSelect, FormColorPicker } from './FormControls';
import { StyleImporter } from './StyleImporter';

// --- Accessibility Utils ---

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Expand shorthand form (e.g. "FFF") to full form (e.g. "FFFFFF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}


function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 21; // Return max contrast if colors are invalid

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

const ContrastWarning: React.FC = () => (
    <div className="flex items-center space-x-1" title="Low contrast ratio. This may be difficult for some users to read.">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-medium text-yellow-700">Low Contrast</span>
    </div>
);

// --- Component ---

interface Props {
  formData: FormData;
  dispatch: React.Dispatch<any>;
}

const FONT_FAMILIES = ['Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS', 'Georgia', 'Times New Roman', 'Courier New'];
const FONT_SIZES = Array.from({ length: 19 }, (_, i) => i + 14); // 14px to 32px
const WCAG_AA_RATIO = 4.5;

export const StyleCustomization: React.FC<Props> = ({ formData, dispatch }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { field: e.target.name, value: e.target.value } });
    };

    const bodyTextContrast = getContrastRatio(formData.bodyTextColor, '#ffffff');
    const isBodyTextContrastLow = bodyTextContrast < WCAG_AA_RATIO;

    const buttonContrast = getContrastRatio(formData.buttonTextColor, formData.buttonBackgroundColor);
    const isButtonContrastLow = buttonContrast < WCAG_AA_RATIO;


    return (
        <div className="space-y-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Style Customization</h3>
            
            <StyleImporter dispatch={dispatch} />
            
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
                     <FormColorPicker 
                        label="Text Color" 
                        name="bodyTextColor" 
                        value={formData.bodyTextColor} 
                        onChange={handleInputChange} 
                        warning={isBodyTextContrastLow ? <ContrastWarning /> : null}
                     />
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
                    <FormColorPicker 
                        label="Button Background" 
                        name="buttonBackgroundColor" 
                        value={formData.buttonBackgroundColor} 
                        onChange={handleInputChange} 
                        warning={isButtonContrastLow ? <ContrastWarning /> : null}
                    />
                    <FormColorPicker 
                        label="Button Text" 
                        name="buttonTextColor" 
                        value={formData.buttonTextColor} 
                        onChange={handleInputChange} 
                        warning={isButtonContrastLow ? <ContrastWarning /> : null}
                    />
                </div>
            </div>
        </div>
    );
};