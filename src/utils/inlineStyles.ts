import juice from "juice";

const css = `
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.5rem 0;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.25rem;
  }

  ol {
    list-style-type: decimal;
    padding-left: 1.25rem;
  }

  blockquote {
    border-left: 3px solid #e2e8f0;
    padding-left: 1rem;
    margin-left: 0;
    color: #64748b;
    font-style: italic;
  }

  code {
    background-color: #f1f5f9;
    color: #0f172a;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.85em;
    padding: 0.15em 0.35em;
    border-radius: 0.25rem;
  }

  pre {
    background-color: #f1f5f9;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }

  pre code {
    background: none;
    padding: 0;
    font-size: 0.875em;
  }

  a {
    color: #2563eb;
    text-decoration: underline;
  }

  u {
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 0.375rem;
    margin: 0.5rem 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.9em;
  }

  th, td {
    padding: 0.5rem 0.75rem;
    text-align: left;
  }

  th {
    font-weight: 600;
  }
`;

export function inlineStyles(html: string): string {
  return juice(`<style>${css}</style>${html}`);
}