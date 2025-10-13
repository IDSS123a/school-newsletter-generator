# School Newsletter Generator

![GHBanner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

A web application for generating professional school newsletters using AI (Google Gemini).

View your app in AI Studio: [https://ai.studio/apps/drive/10Zqy7rhQKHQmbWlQxw1gnvQzUKiTnJWl](https://ai.studio/apps/drive/10Zqy7rhQKHQmbWlQxw1gnvQzUKiTnJWl)

## Features

- 🤖 AI-powered content generation using Google Gemini
- 🎨 Custom styling and design options
- 🌐 Multi-language support
- 📸 AI image generation
- 📧 Email-ready HTML output
- 🎯 SEO-optimized meta tags

## Project Structure

```text
school-newsletter-generator/
├── components/          # React components
│   ├── form/           # Form-related components
│   ├── ErrorDisplay.tsx
│   ├── Loader.tsx
│   ├── NewsletterForm.tsx
│   └── OutputDisplay.tsx
├── services/           # API services and utilities
│   ├── geminiService.ts
│   ├── styleExtractorService.ts
│   └── newsletter-template.html
├── public/             # Static assets
├── tests/              # Test files
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── index.html          # HTML template
└── vite.config.ts      # Vite configuration
```

## Run Locally

**Prerequisites:** Node.js 18+ and npm

1. **Clone the repository**

   ```bash
   git clone https://github.com/IDSS123a/school-newsletter-generator.git
   cd school-newsletter-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Get your Gemini API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Set `VITE_GEMINI_API_KEY` in `.env` to your API key

   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at: [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Alias for preview
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Technologies

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **AI:** Google Generative AI (Gemini)
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint + Prettier

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
