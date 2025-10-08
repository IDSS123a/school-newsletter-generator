import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (content: string) => void;
  required?: boolean;
}

export const RichTextEditor: React.FC<Props> = ({ label, name, value, onChange, required = false }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <Editor
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          doctype: '<!DOCTYPE html>',
          schema: 'html5',
          height: 250,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic | bullist numlist | ' +
            'removeformat | help',
          content_style: 'body { font-family:Inter,sans-serif; font-size:14px }'
        }}
      />
    </div>
  );
};