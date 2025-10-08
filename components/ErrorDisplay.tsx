
import React from 'react';

interface Props {
  error: string;
}

const ExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const ErrorDisplay: React.FC<Props> = ({ error }) => {
    let title = "Generation Failed";
    let message = error;

    const rawMessage = error.replace(/^AI generation failed:\s*/, "");

    if (rawMessage.startsWith("Content blocked:")) {
        title = "Content Moderation Error";
        const reason = rawMessage.split(':')[1]?.split('.')[0]?.trim().toLowerCase() || "safety reasons";
        message = `The AI could not process your request because the input was blocked for ${reason}. Please review your content for anything that might violate safety policies (e.g., hate speech, harassment, etc.) and try again.`;
    } else if (rawMessage.includes("did not return valid HTML")) {
        title = "Invalid AI Response";
        message = "The AI returned an incomplete or invalid response. This can sometimes happen with complex requests. Please try simplifying your content or adjusting the generation parameters.";
    } else {
        message = rawMessage;
    }


    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <div className="flex">
                <div className="py-1">
                    <ExclamationIcon className="h-6 w-6 text-red-500 mr-4" />
                </div>
                <div>
                    <p className="font-bold">{title}</p>
                    <p className="text-sm">{message}</p>
                </div>
            </div>
        </div>
    );
};
