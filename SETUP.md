# PageGrade Setup Guide

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Get your OpenAI API key from: https://platform.openai.com/api-keys

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Features

- **URL Input**: Paste any landing page URL
- **Content Extraction**: Automatically extracts headlines, body text, and CTAs
- **AI Analysis**: Uses GPT-4 to analyze landing page effectiveness
- **Detailed Feedback**: Provides strengths, improvements, and overall grade
- **Beautiful UI**: Modern, responsive design with Tailwind CSS

## How it Works

1. User enters a landing page URL
2. App fetches the HTML content of the page
3. Extracts key elements (headlines, body text, CTAs)
4. Sends content to OpenAI GPT-4 for analysis
5. Displays detailed feedback with actionable insights

## API Endpoints

- `POST /api/analyze` - Analyzes a landing page URL

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API
- React Hooks

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required for AI analysis) 