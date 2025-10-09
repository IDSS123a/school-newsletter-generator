import React, { useEffect, useRef, memo } from 'react';

// TypeScript declarations for Quill since it's loaded from CDN
declare global {
  interface Window {
    Quill: any;
  }
}

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  height?: number;
  placeholder?: string;
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      // If script tag exists, Quill might still be loading.
      // Poll for the global window.Quill object.
      const checkInterval = setInterval(() => {
        if (window.Quill) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

const loadCss = (href: string) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
};


const RichTextEditorComponent: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  height = 250,
  placeholder = 'Enter content...',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);
  const isInitialized = useRef(false);
  
  // This ref holds the latest onChange callback.
  // We update it directly during render to ensure that the 'text-change'
  // event handler's closure always has access to the most recent callback.
  // This prevents race conditions and stale closure bugs during rapid state
  // changes in the parent component.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;


  // Initialization effect
  useEffect(() => {
    const initializeQuill = async () => {
      if (!editorRef.current || isInitialized.current) {
        return;
      }
      
      try {
        // Load CSS and JS in parallel
        loadCss('https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css');
        await loadScript('https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js');

        if (editorRef.current && !quillInstance.current) {
            isInitialized.current = true;
            
            quillInstance.current = new window.Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [2, 3, false] }],
                        ['bold', 'italic', 'underline', 'link'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['clean']
                    ]
                },
                placeholder: placeholder
            });
            
            // Set initial content
            if (value) {
                quillInstance.current.root.innerHTML = value;
            }
            
            // Attach event listener
            quillInstance.current.on('text-change', (delta: any, oldDelta: any, source: string) => {
                if (source === 'user' && onChangeRef.current) {
                    // Accessing .current gets the latest onChange function, avoiding stale closures.
                    const content = quillInstance.current.root.innerHTML;
                    if (content !== '<p><br></p>') {
                       onChangeRef.current(content);
                    } else {
                       onChangeRef.current('');
                    }
                }
            });
             console.log('✅ Quill editor initialized successfully.');
        }
      } catch (error) {
          console.error("❌ Failed to load or initialize Quill editor:", error);
      }
    };
    
    initializeQuill();
    
    return () => {
      // No specific cleanup needed for Quill instance itself,
      // but good practice to nullify refs
      quillInstance.current = null;
      isInitialized.current = false;
    };
  }, []); // Empty dependency array, runs only once

  // Effect to sync value from parent
  useEffect(() => {
      if (quillInstance.current) {
          const editorContent = quillInstance.current.root.innerHTML;
          const normalizedValue = value || '<p><br></p>';

          if (editorContent !== normalizedValue) {
            if (value) {
              quillInstance.current.root.innerHTML = value;
            } else {
              quillInstance.current.root.innerHTML = '<p><br></p>';
            }
          }
      }
  }, [value]);

  return (
      <div ref={editorRef} style={{ height: `${height}px`, backgroundColor: 'white' }} />
  );
};

export const RichTextEditor = memo(RichTextEditorComponent);