
import React, { useReducer, Reducer } from 'react';
import type { FormData, NewsletterOutput, ContentBlock } from './types';
import { NewsletterForm } from './components/NewsletterForm';
import { OutputDisplay } from './components/OutputDisplay';
import { Loader } from './components/Loader';
import { generateNewsletterPackage } from './services/geminiService';
import { ErrorDisplay } from './components/ErrorDisplay';

type FormState = FormData;

type Action =
  | { type: 'UPDATE_FIELD'; payload: { field: keyof Omit<FormState, 'rawContent' | 'socials'>; value: string } }
  | { type: 'UPDATE_SOCIAL_FIELD'; payload: { field: keyof FormState['socials']; value: string } }
  | { type: 'ADD_CONTENT_BLOCK' }
  | { type: 'REMOVE_CONTENT_BLOCK'; payload: { id: number } }
  | { type: 'UPDATE_CONTENT_BLOCK'; payload: { id: number; field: 'title' | 'content'; value: string } }
  | { type: 'LOAD_STATE'; payload: Omit<FormState, 'rawContent'> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_OUTPUT'; payload: NewsletterOutput | null };


interface AppState {
  formData: FormState;
  isLoading: boolean;
  error: string | null;
  output: NewsletterOutput | null;
}

const initialState: AppState = {
  formData: {
    primaryLanguage: 'English',
    secondaryLanguage: 'Bosnian',
    tone: 'Friendly',
    audience: 'Parents',
    length: 'Medium',
    rawContent: [
      {
        id: 1,
        title: 'Annual School Fair is Almost Here!',
        content: `Our annual school fair is happening next Friday, **October 25th**, from *3 PM to 6 PM*. It's a day of fun, games, and community spirit!\n\n### We Need Your Help!\nWe are looking for parent volunteers for:\n- The bake sale\n- Game booths\n- Setup and cleanup`
      },
      {
        id: 2,
        title: 'Show Your Spirit',
        content: 'Students are encouraged to wear their house colors to show school spirit! All proceeds will go towards new library books.'
      }
    ],
    ctaText: 'Volunteer Now',
    ctaUrl: 'https://schoolwebsite.com/volunteer-signup',
    separatorStyle: 'Thin Line',
    
    // Style settings
    bodyFontFamily: 'Arial',
    bodyFontSize: '16',
    bodyTextColor: '#333333',
    
    h2FontFamily: 'Arial',
    h2FontSize: '22',
    h2Color: '#004080',

    h3FontFamily: 'Arial',
    h3FontSize: '18',
    h3Color: '#004080',

    linkColor: '#004080',
    buttonBackgroundColor: '#ffcc00',
    buttonTextColor: '#004080',

    imagePrompt: '',
    imagePosition: 'Middle of content',

    socials: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  },
  isLoading: false,
  error: null,
  output: null
};

const appReducer: Reducer<AppState, Action> = (state, action): AppState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, formData: { ...state.formData, [action.payload.field]: action.payload.value } };
    case 'UPDATE_SOCIAL_FIELD':
      return { ...state, formData: { ...state.formData, socials: { ...state.formData.socials, [action.payload.field]: action.payload.value } } };
    case 'ADD_CONTENT_BLOCK':
      const newBlock: ContentBlock = { id: Date.now(), title: '', content: '' };
      return { ...state, formData: { ...state.formData, rawContent: [...state.formData.rawContent, newBlock] } };
    case 'REMOVE_CONTENT_BLOCK':
      return { ...state, formData: { ...state.formData, rawContent: state.formData.rawContent.filter(block => block.id !== action.payload.id) } };
    case 'UPDATE_CONTENT_BLOCK':
      return {
        ...state,
        formData: {
          ...state.formData,
          rawContent: state.formData.rawContent.map(block =>
            block.id === action.payload.id ? { ...block, [action.payload.field]: action.payload.value } : block
          )
        }
      };
    case 'LOAD_STATE':
       return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_OUTPUT':
      return { ...state, output: action.payload };
    default:
      return state;
  }
};


const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { formData, isLoading, error, output } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_OUTPUT', payload: null });

    try {
      const result = await generateNewsletterPackage(formData);
      dispatch({ type: 'SET_OUTPUT', payload: result });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error(err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <svg className="w-16 h-16 mx-auto mb-4 text-[#004080]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m-4 3h2m-4 3h2" /></svg>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#004080]">School Newsletter Generator</h1>
          <p className="mt-2 text-md text-gray-600 max-w-2xl mx-auto">
            Provide your raw content and select your desired options. The AI will rewrite your text and generate a complete, responsive HTML newsletter ready to send.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <NewsletterForm
              formData={formData}
              dispatch={dispatch}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 lg:sticky top-8 self-start">
            <h2 className="text-2xl font-bold text-[#004080] mb-4">Generated Newsletter</h2>
            {isLoading && <Loader />}
            {error && <ErrorDisplay error={error} />}
            {output && !isLoading && <OutputDisplay output={output} />}
            {!isLoading && !error && !output && (
              <div className="text-center py-10 px-4 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Your generated newsletter preview will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
