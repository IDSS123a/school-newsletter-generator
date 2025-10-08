
import React, { useState } from 'react';
import type { FormData } from '../../types';
import { FormInput } from './FormControls';

interface Props {
  formData: FormData;
  dispatch: React.Dispatch<any>;
}

interface SocialErrors {
    facebook: string;
    instagram: string;
    linkedin: string;
}

export const SocialLinks: React.FC<Props> = ({ formData, dispatch }) => {
    const [errors, setErrors] = useState<SocialErrors>({ facebook: '', instagram: '', linkedin: '' });

    const validateUrl = (url: string): string => {
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            return 'URL must start with http:// or https://';
        }
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as { name: keyof SocialErrors, value: string };
        setErrors(prev => ({ ...prev, [name]: validateUrl(value) }));
        dispatch({ type: 'UPDATE_SOCIAL_FIELD', payload: { field: name, value: value } });
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Social Media Links</h3>
             <p className="text-xs text-gray-500">Optional: Add links to your social media profiles to be included in the footer.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                    label="Facebook URL"
                    name="facebook"
                    value={formData.socials.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/YourSchoolPage"
                    error={errors.facebook}
                />
                <FormInput
                    label="Instagram URL"
                    name="instagram"
                    value={formData.socials.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/YourSchoolHandle"
                    error={errors.instagram}
                />
                <FormInput
                    label="LinkedIn URL"
                    name="linkedin"
                    value={formData.socials.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/school/YourSchool"
                    error={errors.linkedin}
                />
            </div>
        </div>
    );
};
