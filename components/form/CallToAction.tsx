
import React, { useState } from 'react';
import type { FormData } from '../../types';
import { FormInput } from './FormControls';

interface Props {
  formData: FormData;
  dispatch: React.Dispatch<any>;
}

export const CallToAction: React.FC<Props> = ({ formData, dispatch }) => {
    const [ctaUrlError, setCtaUrlError] = useState('');

    const validateUrl = (url: string) => {
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            return 'URL must start with http:// or https://';
        }
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'ctaUrl') {
            setCtaUrlError(validateUrl(value));
        }
        dispatch({ type: 'UPDATE_FIELD', payload: { field: name, value: value } });
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Call to Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="CTA Button Text" name="ctaText" value={formData.ctaText} onChange={handleInputChange} placeholder="e.g., Read More" required />
                <FormInput
                    label="CTA Button URL"
                    name="ctaUrl"
                    value={formData.ctaUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    required
                    error={ctaUrlError}
                />
            </div>
        </div>
    );
};
