
export interface ContentBlock {
  id: number;
  title: string;
  content: string;
}

export interface FormData {
  primaryLanguage: string;
  secondaryLanguage: string;
  tone: string;
  audience: string;
  length: string;
  rawContent: ContentBlock[];
  ctaText: string;
  ctaUrl: string;
  separatorStyle: string;
  
  bodyFontFamily: string;
  bodyFontSize: string;
  bodyTextColor: string;

  h2FontFamily: string;
  h2FontSize: string;
  h2Color: string;
  
  h3FontFamily: string;
  h3FontSize: string;
  h3Color: string;
  
  linkColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;

  imagePrompt: string;
  imagePosition: string;
  
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

export interface NewsletterOutput {
  html: string;
}
