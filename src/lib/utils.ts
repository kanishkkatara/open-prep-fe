import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { marked } from 'marked'
import katex from 'katex'
import DOMPurify from 'dompurify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Calculate progress percentage
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Delay function for simulating API calls
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

const windowDefined = typeof window !== 'undefined'

function toLaTeXFriendly(input: string): string {
  return input
    // Convert [ math ] → \[ math \]
    .replace(/\[\s*([\s\S]+?)\s*\]/g, (_, expr) => `\\[${expr.trim()}\\]`)
    // Convert ( math ) → \( math \)
    .replace(/\(\s*([\s\S]+?)\s*\)/g, (_, expr) => `\\(${expr.trim()}\\)`)
    // Optional: convert ^ to LaTeX-style exponents
    .replace(/([a-zA-Z0-9])\^([a-zA-Z0-9])/g, (_, base, exp) => `${base}^{${exp}}`)
    // Optional: convert sqrt(x) → \sqrt{x}
    .replace(/sqrt\((.+?)\)/g, (_, inside) => `\\sqrt{${inside}}`)

}

// ✅ Now an async function
export const renderContent = async (text = ''): Promise<string> => {
  // Step 1: Preprocess math content
  text = toLaTeXFriendly(text)

  // Step 2: Await markdown parsing
  const rawHtml: string = await marked.parseInline(text)

  // Step 3: Render block math
  let html = rawHtml.replace(/(?:\\\[|\$\$)(.+?)(?:\\\]|\$\$)/gs, (_: string, expr: string) => {
    try {
      return katex.renderToString(expr.trim(), { throwOnError: false, displayMode: true })
    } catch {
      return `<code>${expr}</code>`
    }
  })

  // Step 4: Render inline math
  html = html.replace(/\\\((.+?)\\\)/g, (_: string, expr: string) => {
    try {
      return katex.renderToString(expr.trim(), { throwOnError: false, displayMode: false })
    } catch {
      return `<code>${expr}</code>`
    }
  })

  // Step 5: Sanitize
  return windowDefined ? DOMPurify.sanitize(html) : html
}
