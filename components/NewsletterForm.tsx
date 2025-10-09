import React from 'react';
import type { FormData } from '../types';

import { ContentParameters } from './form/ContentParameters';
import { StyleCustomization } from './form/StyleCustomization';
import { ContentBlocks } from './form/ContentBlocks';
import { ImageGeneration } from './form/ImageGeneration';
import { CallToAction } from './form/CallToAction';
import { FormActions } from './form/FormActions';

interface FormProps {
  formData: FormData;
  dispatch: React.Dispatch<any>;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isPreviewLoading: boolean;
}

export const NewsletterForm: React.FC<FormProps> = ({ formData, dispatch, handleSubmit, isLoading, isPreviewLoading }) => {
  const handleSavePreferences = () => {
    try {
      const { rawContent, ...prefsToSave } = formData;
      localStorage.setItem('newsletter_prefs', JSON.stringify(prefsToSave));
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Error saving preferences.');
    }
  };

  const handleLoadPreferences = () => {
    try {
      const savedPrefs = localStorage.getItem('newsletter_prefs');
      if (savedPrefs) {
        const parsedPrefs = JSON.parse(savedPrefs);
        dispatch({ type: 'LOAD_STATE', payload: parsedPrefs });
        alert('Preferences loaded successfully!');
      } else {
        alert('No saved preferences found.');
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      alert('Error loading preferences.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[#004080] mb-4">Newsletter Generator</h2>

      <ContentParameters formData={formData} dispatch={dispatch} />
      <StyleCustomization formData={formData} dispatch={dispatch} />
      <ContentBlocks formData={formData} dispatch={dispatch} />
      <ImageGeneration formData={formData} dispatch={dispatch} isPreviewLoading={isPreviewLoading} />
      <CallToAction formData={formData} dispatch={dispatch} />
      
      <FormActions 
        isLoading={isLoading} 
        isPreviewLoading={isPreviewLoading}
        onSave={handleSavePreferences} 
        onLoad={handleLoadPreferences} 
      />
    </form>
  );
};