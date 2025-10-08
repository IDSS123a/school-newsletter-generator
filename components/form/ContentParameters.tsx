
import React from 'react';
import type { FormData } from '../../types';
import { FormSelect } from './FormControls';

interface Props {
  formData: FormData;
  dispatch: React.Dispatch<any>;
}

export const ContentParameters: React.FC<Props> = ({ formData, dispatch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field: e.target.name, value: e.target.value } });
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Content Parameters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect label="Primary Language" name="primaryLanguage" value={formData.primaryLanguage} onChange={handleInputChange} required>
          <option>English</option>
          <option>Bosnian</option>
          <option>German</option>
        </FormSelect>
        <FormSelect label="Secondary Language" name="secondaryLanguage" value={formData.secondaryLanguage} onChange={handleInputChange}>
          <option value="None">None</option>
          <option>English</option>
          <option>Bosnian</option>
          <option>German</option>
        </FormSelect>
        <FormSelect label="Tone" name="tone" value={formData.tone} onChange={handleInputChange} required>
          <option>Professional</option>
          <option>Friendly</option>
          <option>Playful</option>
          <option>Neutral</option>
        </FormSelect>
        <FormSelect label="Audience" name="audience" value={formData.audience} onChange={handleInputChange} required>
          <option>Parents</option>
          <option>Students</option>
          <option>Teachers</option>
          <option>Public</option>
        </FormSelect>
        <FormSelect label="Length" name="length" value={formData.length} onChange={handleInputChange} required>
          <option>Short</option>
          <option>Medium</option>
          <option>Long</option>
        </FormSelect>
        <FormSelect label="Separator Style" name="separatorStyle" value={formData.separatorStyle} onChange={handleInputChange}>
          <option>Thin Line</option>
          <option>Dashed Line</option>
          <option value="None">None</option>
        </FormSelect>
      </div>
    </div>
  );
};
