
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, NewsletterOutput } from "../types";

// The API key is passed from the build environment, not hardcoded.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const SCHOOL_LOGO_URL = 'https://i.imgur.com/VCQpohZ.png';
const SCHOOL_FOOTER_INFO = 'Internationale Deutsche Schule Sarajevo | Buka 13, Mejtaš | +387 560 520 | info@idss.ba';

const SOCIAL_ICONS = {
  facebook: 'https://i.imgur.com/626v2H5.png',
  instagram: 'https://i.imgur.com/1y22n21.png',
  linkedin: 'https://i.imgur.com/2625Q1p.png'
};

const NEWSLETTER_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{HEADER_TITLE}}</title>
  <style>
    body { margin:0; padding:0; background-color:#f5f5f5; font-family: {{BODY_FONT_FAMILY}}, Arial, sans-serif; }
    table { border-spacing:0; width:100%; }
    img { display:block; border:0; outline:none; text-decoration:none; }
    a { color:{{LINK_COLOR}}; text-decoration:none; }
    .container { max-width:600px; margin:0 auto; background-color:#ffffff; }
    h1, h2, h3, p { margin:0; padding:0; }
    h1 { font-size:22px; color:#ffffff; text-align:center; font-weight:bold; }
    p { font-size:{{BODY_FONT_SIZE}}px; line-height:1.5; color:{{BODY_TEXT_COLOR}}; }
    ul, ol { padding-left:20px; color:{{BODY_TEXT_COLOR}}; font-size:{{BODY_FONT_SIZE}}px; }
    .button { display:inline-block; background-color:{{BUTTON_BACKGROUND_COLOR}}; font-weight:bold; padding:12px 20px; border-radius:6px; text-align:center; }
    hr { border:0; border-top:1px solid #e0e0e0; margin:0; }
    @media screen and (max-width: 620px) {
      .container { width: 100% !important; }
      img { max-width:100% !important; height:auto !important; }
      .button { display:block; width:100% !important; box-sizing:border-box; }
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <table width="100%" bgcolor="#004080" cellpadding="0" cellspacing="0">
    <tr><td align="center"><table class="container" style="background-color:#004080;">
      <tr><td align="center" style="padding: 20px 20px 10px 20px;"><img src="${SCHOOL_LOGO_URL}" alt="School Logo" width="150" style="display:block; margin: 0 auto;"></td></tr>
      <tr><td align="center" style="padding:10px 20px 20px 20px;"><h1>{{HEADER_TITLE}}</h1></td></tr>
    </table></td></tr>
  </table>

  <!-- PRIMARY LANGUAGE INTRO -->
  <table width="100%" bgcolor="#ffffff" cellpadding="20" cellspacing="0">
    <tr><td align="center"><table class="container"><tr><td>
      <h2 style="font-size:18px; color:#004080; font-weight:bold; margin-bottom:8px;">Welcome!</h2>
      <p>{{INTRO}}</p>
    </td></tr></table></td></tr>
  </table>

  <!-- PRIMARY LANGUAGE MAIN CONTENT -->
  <table width="100%" bgcolor="#ffffff" cellpadding="20" cellspacing="0" style="padding-top:0;">
    <tr><td align="center"><table class="container"><tr><td>
      {{MAIN_CONTENT}}
    </td></tr></table></td></tr>
  </table>

  <!-- PRIMARY LANGUAGE HIGHLIGHTS -->
  <table width="100%" bgcolor="#ffffff" cellpadding="20" cellspacing="0" style="padding-top:0;">
    <tr><td align="center"><table class="container"><tr><td>
      <h2 style="font-size:18px; color:#004080; font-weight:bold; margin-bottom:8px;">Highlights</h2>
      {{HIGHLIGHTS}}
    </td></tr></table></td></tr>
  </table>

  {{EXTRA_CONTENT_BLOCK}}

  <!-- CTA -->
  <table width="100%" bgcolor="#ffffff" cellpadding="20" cellspacing="0">
    <tr><td align="center"><table class="container"><tr><td align="center">
      <a href="{{CTA_URL}}" class="button" style="color:{{BUTTON_TEXT_COLOR}} !important; text-decoration:none;">{{CTA}}</a>
    </td></tr></table></td></tr>
  </table>

  <!-- FOOTER -->
  <table width="100%" bgcolor="#004080" cellpadding="20" cellspacing="0">
    <tr><td align="center"><table class="container" style="background-color:#004080;">
      <tr><td align="center" style="padding-bottom:15px;"><img src="${SCHOOL_LOGO_URL}" alt="School Logo" width="100" style="display:block; margin: 0 auto;"></td></tr>
      <tr><td align="center" style="padding-bottom:15px;"><p style="color:#ffffff; font-size:14px; text-align:center;">${SCHOOL_FOOTER_INFO}</p></td></tr>
      <tr><td align="center" style="padding-top:0;">{{SOCIAL_LINKS}}</td></tr>
    </table></td></tr>
  </table>
</body>
</html>
`;


const SYSTEM_INSTRUCTION = `# ROLE: School Newsletter Content AI

You are an expert AI for generating and translating content for a school newsletter. Your task is to transform raw content blocks and user preferences into polished, human-like text.

You MUST return your response as a single, valid JSON object that adheres to the provided schema. Do not output markdown fences or any text outside the JSON object.

---

## Content Generation Rules

1.  **Rewriting:** Rewrite the user's raw content based on the specified Tone, Audience, and Length. The output should be natural and engaging.
2.  **Markdown to HTML:** Convert Markdown from user input into clean HTML for the \`mainContent\` field.
    -   User-provided block titles become headings (\`<h2>\`) using the specified H2 styles.
    -   \`### Section Title\` becomes an \`<h3>\` heading using the specified H3 styles.
    -   \`**bold**\` -> \`<strong>bold</strong>\`
    -   \`*italic*\` -> \`<em>italic</em>\`
    -   Unordered lists (\`-\`) -> \`<ul>\` with \`<li>\` items.
    -   Ordered lists (\`1.\`) -> \`<ol>\` with \`<li>\` items.
    -   Paragraphs -> \`<p>\` tags.
3.  **Heading Styles:** Apply the exact inline styles to \`<h2>\` and \`<h3>\` tags based on the user's choices.
    -   **H2:** Construct a style attribute using the user's H2 font family, size, and color. For example: \`style="font-family: 'Georgia', serif; font-size: 24px; color: #333333; font-weight: bold; margin-top: 16px; margin-bottom: 8px;"\`
    -   **H3:** Construct a style attribute using the user's H3 font family, size, and color. For example: \`style="font-family: 'Verdana', sans-serif; font-size: 20px; color: #555555; font-weight: bold; margin-top: 12px; margin-bottom: 6px;"\`
4.  **Highlights:** Generate a concise, bulleted list of key takeaways for the \`highlights\` field. Return this as an array of strings.
5.  **Bilingual Generation:** If a "Secondary Language" is specified, you MUST translate the intro, mainContent, and highlights and populate the \`translatedIntro\`, \`translatedMainContent\`, and \`translatedHighlights\` fields in the JSON. If no secondary language is needed, these fields should be null or omitted.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        headerTitle: { type: Type.STRING, description: "A compelling title for the newsletter header, based on the main content." },
        intro: { type: Type.STRING, description: "A short, welcoming introduction paragraph in the primary language." },
        mainContent: { type: Type.STRING, description: "The fully processed and rewritten main content, formatted as a single HTML string, in the primary language. All content blocks should be concatenated here." },
        highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of key takeaways or highlights from the main content, in the primary language." },
        translatedIntro: { type: Type.STRING, description: "The intro translated into the secondary language. Null if not requested.", nullable: true },
        translatedMainContent: { type: Type.STRING, description: "The mainContent HTML translated into the secondary language. Null if not requested.", nullable: true },
        translatedHighlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The highlights array translated into the secondary language. Null if not requested.", nullable: true },
    },
    required: ["headerTitle", "intro", "mainContent", "highlights"],
};


const buildUserPrompt = (formData: FormData): string => {
  const secondaryLanguagePrompt = (formData.secondaryLanguage && formData.secondaryLanguage !== 'None')
    ? `- **Secondary Language:** ${formData.secondaryLanguage}`
    : `- **Secondary Language:** None`;
  
  const contentBlocks = formData.rawContent.map((block, index) => 
    `--- Content Block ${index + 1} ---\n**Title:** ${block.title}\n**Content:**\n${block.content}`
  ).join('\n\n');

  return `# Newsletter Generation Request

Generate newsletter content using the system instructions and the data below. Return a valid JSON object matching the schema.

## Content Parameters
- **Primary Language:** ${formData.primaryLanguage}
${secondaryLanguagePrompt}
- **Tone:** ${formData.tone}
- **Audience:** ${formData.audience}
- **Approximate Length:** ${formData.length} (for primary language content).

## Style Parameters
- **H2 Font Family:** ${formData.h2FontFamily}
- **H2 Font Size:** ${formData.h2FontSize}px
- **H2 Color:** ${formData.h2Color}
- **H3 Font Family:** ${formData.h3FontFamily}
- **H3 Font Size:** ${formData.h3FontSize}px
- **H3 Color:** ${formData.h3Color}

## Raw Content Blocks to Rewrite
${contentBlocks}
`;
};


export const generateNewsletterPackage = async (formData: FormData): Promise<NewsletterOutput> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured. Please follow the deployment instructions to set it up.");
  }
  
  try {
    let generatedImageDataUri: string | undefined = undefined;

    if (formData.imagePrompt && formData.imagePrompt.trim() !== '') {
      const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: formData.imagePrompt,
        config: { numberOfImages: 1, outputMimeType: 'image/png' },
      });

      if (imageResponse.generatedImages?.length > 0) {
        const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
        generatedImageDataUri = `data:image/png;base64,${base64ImageBytes}`;
      }
    }

    const userPrompt = buildUserPrompt(formData);
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.trim();
    const generatedContent = JSON.parse(jsonText);

    // --- Assemble the HTML ---
    let html = NEWSLETTER_TEMPLATE;
    html = html.replace(/{{HEADER_TITLE}}/g, generatedContent.headerTitle);
    html = html.replace(/{{INTRO}}/g, generatedContent.intro);
    html = html.replace(/{{MAIN_CONTENT}}/g, generatedContent.mainContent);
    html = html.replace(/{{HIGHLIGHTS}}/g, `<ul>${generatedContent.highlights.map((h: string) => `<li>${h}</li>`).join('')}</ul>`);
    
    html = html.replace(/{{BODY_FONT_FAMILY}}/g, formData.bodyFontFamily);
    html = html.replace(/{{BODY_FONT_SIZE}}/g, formData.bodyFontSize);
    html = html.replace(/{{LINK_COLOR}}/g, formData.linkColor);
    html = html.replace(/{{BODY_TEXT_COLOR}}/g, formData.bodyTextColor);
    html = html.replace(/{{BUTTON_BACKGROUND_COLOR}}/g, formData.buttonBackgroundColor);
    html = html.replace(/{{BUTTON_TEXT_COLOR}}/g, formData.buttonTextColor);

    html = html.replace(/{{CTA_URL}}/g, formData.ctaUrl);
    html = html.replace(/{{CTA}}/g, formData.ctaText);

    // Social Links
    let socialLinksHtml = '';
    if (formData.socials.facebook) {
        socialLinksHtml += `<a href="${formData.socials.facebook}" title="Facebook"><img src="${SOCIAL_ICONS.facebook}" alt="Facebook" width="24" height="24" style="display:inline-block; border:0;"></a>&nbsp;&nbsp;`;
    }
    if (formData.socials.instagram) {
        socialLinksHtml += `<a href="${formData.socials.instagram}" title="Instagram"><img src="${SOCIAL_ICONS.instagram}" alt="Instagram" width="24" height="24" style="display:inline-block; border:0;"></a>&nbsp;&nbsp;`;
    }
    if (formData.socials.linkedin) {
        socialLinksHtml += `<a href="${formData.socials.linkedin}" title="LinkedIn"><img src="${SOCIAL_ICONS.linkedin}" alt="LinkedIn" width="24" height="24" style="display:inline-block; border:0;"></a>`;
    }
    html = html.replace('{{SOCIAL_LINKS}}', socialLinksHtml.trim());
    
    // --- Handle extra content (image, bilingual) ---
    let extraContentHtml = '';
    const imageHtmlBlock = generatedImageDataUri ? `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr><td style="padding: 16px 20px;">
                <img src="${generatedImageDataUri}" alt="${formData.imagePrompt}" style="display: block; width: 100%; max-width: 100%; height: auto; border: 0; border-radius: 8px;">
            </td></tr>
        </table>` : '';
    
    if (imageHtmlBlock && formData.imagePosition === 'Top of content') {
        html = html.replace('{{MAIN_CONTENT}}', imageHtmlBlock + generatedContent.mainContent);
    } else if (imageHtmlBlock && formData.imagePosition === 'Middle of content') {
        const contentParts = generatedContent.mainContent.split('</h2>');
        if (contentParts.length > 1) {
            const middleIndex = Math.floor(contentParts.length / 2);
            contentParts.splice(middleIndex, 0, imageHtmlBlock);
            html = html.replace('{{MAIN_CONTENT}}', contentParts.join('</h2>'));
        } else {
             html = html.replace('{{MAIN_CONTENT}}', generatedContent.mainContent + imageHtmlBlock);
        }
    } else if (imageHtmlBlock && formData.imagePosition === 'Before CTA') {
        extraContentHtml += imageHtmlBlock;
    }

    if (generatedContent.translatedIntro) {
        const separatorStyle = formData.separatorStyle === 'Thin Line' 
            ? 'border-bottom: 1px solid #e0e0e0;' 
            : 'border-bottom: 2px dashed #cccccc;';
        
        const separatorHtml = formData.separatorStyle !== 'None' ? `<table width="100%" bgcolor="#ffffff" cellpadding="20" cellspacing="0"><tr><td align="center"><table class="container" style="width:100%;"><tr><td style="${separatorStyle}">&nbsp;</td></tr></table></td></tr></table>` : '';

        extraContentHtml += `
            ${separatorHtml}
            <table width="100%" bgcolor="#ffffff" cellpadding="20" cellspacing="0"><tr><td align="center"><table class="container"><tr><td><p>${generatedContent.translatedIntro}</p></td></tr></table></td></tr>
            <table width="100%" bgcolor="#ffffff" cellpadding="20" cellspacing="0" style="padding-top:0;"><tr><td align="center"><table class="container"><tr><td>${generatedContent.translatedMainContent}</td></tr></table></td></tr>
            <table width="100%" bgcolor="#ffffff" cellpadding="20" cellspacing="0" style="padding-top:0;"><tr><td align="center"><table class="container"><tr><td><ul>${generatedContent.translatedHighlights.map((h: string) => `<li>${h}</li>`).join('')}</ul></td></tr></table></td></tr>
        `;
    }

    html = html.replace('{{EXTRA_CONTENT_BLOCK}}', extraContentHtml);

    return { html };

  } catch (error: any) {
    console.error("Error generating newsletter package:", error);
    let errorMessage = "An unknown error occurred during AI generation.";
    if (error.message) {
      errorMessage = error.message;
    }
    if (error.response?.promptFeedback?.blockReason) {
       errorMessage = `Content blocked: ${error.response.promptFeedback.blockReason}. Please revise your input.`;
    } else if (error instanceof SyntaxError) {
        errorMessage = "The AI returned an invalid JSON response. Please try again.";
    }
    throw new Error(`AI generation failed: ${errorMessage}`);
  }
};
