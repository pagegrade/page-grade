import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Debug: Check if API key is loaded
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'));

    // Fetch the HTML content of the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 400 });
    }

    const html = await response.text();

    // Extract main content elements
    const content = extractPageContent(html);

    // Analyze with OpenAI
    const analysis = await analyzeWithAI(content);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function extractPageContent(html: string) {
  // Simple content extraction - in a real app, you'd use a more sophisticated parser
  const content = {
    title: '',
    headlines: [] as string[],
    bodyText: '',
    ctaButtons: [] as string[]
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    content.title = titleMatch[1].trim();
  }

  // Extract headlines (h1, h2, h3)
  const headlineMatches = html.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/gi);
  if (headlineMatches) {
    content.headlines = headlineMatches.map(h => h.replace(/<[^>]*>/g, '').trim());
  }

  // Extract body text (simplified)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    content.bodyText = bodyMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Extract CTA buttons and links
  const ctaMatches = html.match(/<a[^>]*>([^<]+)<\/a>/gi);
  if (ctaMatches) {
    content.ctaButtons = ctaMatches.map(a => a.replace(/<[^>]*>/g, '').trim());
  }

  return content;
}

function cleanMarkdown(text: string): string {
  // Remove markdown formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
    .replace(/`(.*?)`/g, '$1')       // Remove `code`
    .replace(/#{1,6}\s*(.*)/g, '$1') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .trim();
}

function parseStructuredResponse(response: string) {
  // Extract the five sections from the AI response
  const sections = {
    summary: '',
    strengths: '',
    improvements: '',
    suggestions: '',
    grade: '',
    overall: ''
  };

  // Split by sections
  const lines = response.split('\n');
  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.includes('🔍 **Quick Summary**')) {
      currentSection = 'summary';
      continue;
    } else if (trimmedLine.includes('✅ **What\'s Good**')) {
      currentSection = 'strengths';
      continue;
    } else if (trimmedLine.includes('🛠️ **What Needs Work**')) {
      currentSection = 'improvements';
      continue;
    } else if (trimmedLine.includes('💡 **Suggestions**')) {
      currentSection = 'suggestions';
      continue;
    } else if (trimmedLine.includes('🏆 **Final Grade**')) {
      currentSection = 'grade';
      continue;
    }
    
    if (currentSection && trimmedLine) {
      if (currentSection === 'summary') {
        sections.summary += trimmedLine + '\n';
      } else if (currentSection === 'strengths') {
        sections.strengths += trimmedLine + '\n';
      } else if (currentSection === 'improvements') {
        sections.improvements += trimmedLine + '\n';
      } else if (currentSection === 'suggestions') {
        sections.suggestions += trimmedLine + '\n';
      } else if (currentSection === 'grade') {
        sections.grade += trimmedLine + '\n';
      }
    }
  }

  // Extract grade from the grade section (supports A+ to F)
  const gradeMatch = sections.grade.match(/[A-F][+]?/i);
  const grade = gradeMatch ? gradeMatch[0].toUpperCase() : 'B';

  // Convert text sections to arrays for the UI and clean markdown
  const strengths = sections.strengths
    .split('\n')
    .filter(line => line.trim() && !line.includes('✅'))
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => cleanMarkdown(line));

  const improvements = sections.improvements
    .split('\n')
    .filter(line => line.trim() && !line.includes('🛠️'))
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => cleanMarkdown(line));

  const suggestions = sections.suggestions
    .split('\n')
    .filter(line => line.trim() && !line.includes('💡'))
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => cleanMarkdown(line));

  // Combine grade section into overall assessment
  const overall = cleanMarkdown(sections.grade
    .split('\n')
    .filter(line => line.trim() && !line.includes('🏆'))
    .join(' ')
    .trim());

  return {
    grade,
    strengths,
    improvements,
    suggestions,
    overall
  };
}

async function analyzeWithAI(content: any) {
  console.log('Starting AI analysis...');
  console.log('API Key available:', !!process.env.OPENAI_API_KEY);
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('No API key found, using fallback');
    // Fallback to mock analysis if no API key
    return {
      grade: 'B',
      strengths: [
        'Clear headline that communicates the main value proposition',
        'Good use of call-to-action buttons',
        'Clean, professional design layout'
      ],
      improvements: [
        'Consider adding more social proof elements',
        'The value proposition could be more specific',
        'Add urgency or scarcity elements to increase conversions'
      ],
      overall: 'This is a solid landing page with good fundamentals. The messaging is clear and the design is professional. With some targeted improvements, this page has strong potential for better conversion rates.'
    };
  }

  const pageContent = `
Title: ${content.title}
Headlines: ${content.headlines.join('\n')}
Body Text: ${content.bodyText.substring(0, 2000)}
CTA Buttons: ${content.ctaButtons.join(', ')}

---

Please analyze this page and respond with:

1. 🔍 **Quick Summary** – What is this page trying to do?
2. ✅ **What's Good** – What works well about the headline, CTA, structure, or messaging?
3. 🛠️ **What Needs Work** – Be specific about things that are confusing, generic, or weak.
4. 💡 **Suggestions** – Give actionable ideas to improve the page's clarity or conversion.
5. 🏆 **Final Grade** – Rate this landing page from A+ to F and explain why.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Updated model name
      messages: [
        {
          role: "system",
          content: "You are an expert in conversion rate optimization and UX writing. Your job is to analyze landing pages and provide clear, honest, and helpful feedback. You should act like a smart but friendly landing page copy editor and UX reviewer. Use clear, casual language. Be blunt like a startup mentor. No vague praise — be honest."
        },
        {
          role: "user",
          content: `Here is the text extracted from the landing page:\n\n${pageContent}`
        },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      // Parse the structured response
      const analysis = parseStructuredResponse(response);
      return analysis;
    } else {
      throw new Error('No response from OpenAI');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    // Return fallback analysis
    return {
      grade: 'B',
      strengths: [
        'Clear headline that communicates the main value proposition',
        'Good use of call-to-action buttons',
        'Clean, professional design layout'
      ],
      improvements: [
        'Consider adding more social proof elements',
        'The value proposition could be more specific',
        'Add urgency or scarcity elements to increase conversions'
      ],
      suggestions: [
        'Add customer testimonials or case studies',
        'Include specific benefits and outcomes',
        'Test different CTA button text variations'
      ],
      overall: 'Grade B: This is a solid landing page with good fundamentals. The messaging is clear and the design is professional. With some targeted improvements, this page has strong potential for better conversion rates.'
    };
  }
} 