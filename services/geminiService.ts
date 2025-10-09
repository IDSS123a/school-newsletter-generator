import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, NewsletterOutput } from "../types";

// Always use new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Accessibility & Dynamic Asset Utils ---
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Expand shorthand form (e.g. "FFF") to full form (e.g. "FFFFFF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}


function getLuminance(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 0; // Default to dark if color is invalid
  const { r, g, b } = rgb;
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// --- Dynamic School & Social Assets ---
const SCHOOL_DATA = {
    name: 'Internationale Deutsche Schule Sarajevo',
    address: 'Buka 13, 71000 Sarajevo, Bosnia and Herzegovina',
    logoLight: 'https://i.imgur.com/E12yk3O.png', // White logo for dark backgrounds
    logoDark: 'https://i.imgur.com/VCQpohZ.png',   // Dark logo for light backgrounds
    facebookUrl: 'https://www.facebook.com/idsssarajevo',
    instagramUrl: 'https://www.instagram.com/idss.ba/',
    linkedinUrl: 'https://www.linkedin.com/company/international-german-school-sarajevo/?viewAsMember=true',
};

const SOCIAL_ICONS = {
    light: { // White icons for dark backgrounds
        facebook: 'https://i.imgur.com/kjnSnZh.png',
        instagram: 'https://i.imgur.com/iNzTuZX.png',
        linkedin: 'https://i.imgur.com/dYmyLNE.png',
    },
    dark: { // Dark icons for light backgrounds
        facebook: 'https://i.imgur.com/8Qy3v4j.png',
        instagram: 'https://i.imgur.com/PAA2k4j.png',
        linkedin: 'https://i.imgur.com/OQIq4aC.png',
    }
};


// --- NEW STRATEGY: Fetching the template at runtime ---
let templateCache: string | null = null;
const getNewsletterTemplate = async (): Promise<string> => {
    if (templateCache) {
        return templateCache;
    }
    try {
        const response = await fetch('./services/newsletter-template.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.statusText}`);
        }
        const html = await response.text();
        templateCache = html;
        return html;
    } catch (error) {
        console.error("Could not load newsletter template.", error);
        throw new Error("Critical error: Newsletter template could not be loaded.");
    }
};


export const generateImage = async (prompt: string): Promise<string> => {
  if (!prompt || prompt.trim().length < 10) {
    throw new Error('A descriptive image prompt of at least 10 characters is required.');
  }
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error('No image was returned from the API. Please try a different prompt.');
    }
  } catch (error: any) {
    console.error("Image generation failed:", error);
    const message = error.message || 'An unknown error occurred during image generation.';
    throw new Error(`AI generation failed: ${message}`);
  }
};

const constructFinalPrompt = (formData: FormData): string => {
    const { primaryLanguage, secondaryLanguage, tone, audience, length, rawContent, ctaText, ctaUrl, separatorStyle, imagePrompt, imagePosition, generatedImageDataUri } = formData;

    const contentBlocksString = rawContent.map(block =>
        `### Block Title: ${block.title}\n### Block Content:\n${block.content}`
    ).join('\n\n---\n\n');

    let imageInstruction = "No image will be included.";
    if (generatedImageDataUri && imagePrompt) {
        imageInstruction = `
An image has been generated for this newsletter. You MUST embed it within the content flow.
- **Image Position:** ${imagePosition}
- **Image Alt Text:** Create a descriptive alt text for an image generated from this prompt: "${imagePrompt}".
- **Embedding:** You MUST place the image using an '<img>' tag. For the 'src' attribute of this tag, you MUST use the exact placeholder string "{{IMAGE_SRC_PLACEHOLDER}}". For example: <img src="{{IMAGE_SRC_PLACEHOLDER}}" alt="...">.
`;
    }

    const secondaryLangInstruction = secondaryLanguage && secondaryLanguage !== 'None'
        ? `
**Translation Requirement:**
1. First, generate the COMPLETE newsletter content in ${primaryLanguage}.
2. After the primary language content is finished, insert a separator.
3. Finally, provide a FULL translation of the entire generated content in ${secondaryLanguage}.
The structure MUST be [Full ${primaryLanguage} Content] -> [Separator] -> [Full ${secondaryLanguage} Content].
`
        : `The entire newsletter should be in ${primaryLanguage}. Do NOT add any translations.`;

    const separatorInstruction = separatorStyle !== 'None'
        ? `Use a '${separatorStyle}' (<hr> with appropriate inline styling) to separate the main content blocks within the primary language section.`
        : 'Do not use a separator between content blocks within the primary language section.';
        
    const stylingInstruction = `
- **Body Text Color:** ${formData.bodyTextColor}
- **H2 Headings Color:** ${formData.h2Color}
- **H3 Headings Color:** ${formData.h3Color}
- **Links (<a>) Color:** ${formData.linkColor}
- **CTA Button:** Background Color: ${formData.buttonBackgroundColor}; Text Color: ${formData.buttonTextColor};
`;
    
    let basePrompt = `
You are an expert copywriter, email developer, and SEO specialist. Your task is to generate a complete newsletter package based on the provided specifications. You MUST return a single JSON object that matches the required schema.

--- PART 1: NEWSLETTER CONTENT BODY ---
Use these instructions to generate the main HTML content for the newsletter. The content should be a raw HTML snippet. Do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags.

**Content Generation Specifications:**
- **Primary Language:** ${primaryLanguage}
- **Tone:** ${tone}
- **Target Audience:** ${audience}
- **Desired Length:** ${length}
- **Translation:** ${secondaryLangInstruction}
- **Raw Content to Rewrite:** Rewrite and format the following content blocks. Block titles should become H2 headings. Preserve existing HTML formatting like <h3>, <p>, <ul>, <strong>, etc.
${contentBlocksString}
- **Call to Action (CTA):** Create a prominent, clickable button with the text "${ctaText}" linking to "${ctaUrl}".
- **Image:** ${imageInstruction} If an image is included, ensure it is responsive (max-width: 100%; height: auto;).
- **Styling:** Use inline CSS for all colors based on this guide: ${stylingInstruction}
- **Separators:** ${separatorInstruction}

--- PART 2: SEO METADATA ---
Based on the same raw content, generate the following in ${primaryLanguage}:
1.  A concise meta description (max 160 characters).
2.  A comma-separated list of 5-7 relevant keywords.

--- FINAL INSTRUCTIONS ---
Combine the results from Part 1 and Part 2 into a single, valid JSON object.
`;
    
    return basePrompt;
};


export const generateNewsletterPackage = async (formData: FormData): Promise<NewsletterOutput> => {
  try {
    const finalPrompt = constructFinalPrompt(formData);
    
    const fullResponseSchema = {
        type: Type.OBJECT,
        properties: {
            description: { type: Type.STRING, description: "A meta description for the newsletter (max 160 characters)." },
            keywords: { type: Type.STRING, description: "A comma-separated list of 5-7 relevant keywords." },
            contentHtml: { type: Type.STRING, description: "The complete HTML for the newsletter's main content body. Should not include <html>, <head>, or <body> tags." }
        },
        required: ['description', 'keywords', 'contentHtml']
    };

    const [allContentResponse, NEWSLETTER_TEMPLATE] = await Promise.all([
        ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: finalPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: fullResponseSchema,
            }
        }),
        getNewsletterTemplate()
    ]);
    
    const allContent = JSON.parse(allContentResponse.text.trim());
    const { description, keywords, contentHtml } = allContent;
    
    // --- NEW: Replace the image placeholder AFTER receiving the response ---
    // This is more robust and efficient than sending the large base64 string to the AI.
    let processedContentHtml = contentHtml;
    if (formData.generatedImageDataUri) {
        processedContentHtml = contentHtml.replace(/{{IMAGE_SRC_PLACEHOLDER}}/g, formData.generatedImageDataUri);
    }

    // --- DYNAMIC COLOR & ASSET LOGIC ---
    const headerBgColor = formData.h2Color; // Header and Footer use H2 color for consistency
    const isHeaderBgDark = getLuminance(headerBgColor) < 0.5;
    
    const logoUrl = isHeaderBgDark ? SCHOOL_DATA.logoLight : SCHOOL_DATA.logoDark;
    const footerTextColor = isHeaderBgDark ? '#FFFFFF' : '#333333';
    const socialIcons = isHeaderBgDark ? SOCIAL_ICONS.light : SOCIAL_ICONS.dark;

    // --- REVISED SOCIAL LINKS HTML FOR HORIZONTAL LAYOUT ---
    const socialLinksHtml = `
      <td style="padding: 0 5px;"><a href="${SCHOOL_DATA.facebookUrl}" style="text-decoration: none;"><img src="${socialIcons.facebook}" alt="Facebook" width="24" height="24" style="display: block;"></a></td>
      <td style="padding: 0 5px;"><a href="${SCHOOL_DATA.instagramUrl}" style="text-decoration: none;"><img src="${socialIcons.instagram}" alt="Instagram" width="24" height="24" style="display: block;"></a></td>
      <td style="padding: 0 5px;"><a href="${SCHOOL_DATA.linkedinUrl}" style="text-decoration: none;"><img src="${socialIcons.linkedin}" alt="LinkedIn" width="24" height="24" style="display: block;"></a></td>
    `;

    // Assemble the final HTML
    let finalHtml = NEWSLETTER_TEMPLATE;
    const currentYear = new Date().getFullYear();

    finalHtml = finalHtml
      .replace(/{{LOGO_URL}}/g, logoUrl)
      .replace(/{{SCHOOL_NAME}}/g, SCHOOL_DATA.name)
      .replace(/{{SCHOOL_ADDRESS}}/g, SCHOOL_DATA.address)
      .replace(/{{CURRENT_YEAR}}/g, currentYear.toString())
      .replace(/{{HEADER_BG_COLOR}}/g, headerBgColor)
      .replace(/{{FOOTER_BG_COLOR}}/g, headerBgColor)
      .replace(/{{FOOTER_TEXT_COLOR}}/g, footerTextColor)
      .replace(/{{SOCIAL_LINKS_HTML}}/g, socialLinksHtml)
      .replace(/{{CONTENT_BODY}}/g, processedContentHtml) // Use the processed HTML
      .replace(/{{META_DESCRIPTION}}/g, description)
      .replace(/{{META_KEYWORDS}}/g, keywords);
      
    return { html: finalHtml };

  } catch (error: any) {
    console.error("Newsletter generation failed:", error);
    const message = error.message || 'An unknown error occurred during newsletter generation.';
    throw new Error(`AI generation failed: ${message}`);
  }
};