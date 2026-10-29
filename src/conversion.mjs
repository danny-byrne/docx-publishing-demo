/** Normalize escaped component markers and Word's surrounding paragraphs. */
export function cleanMammothHtml(raw) {
 return raw.replace(/&lt;/g,'<').replace(/&gt;/g,'>')
  .replace(/<p>\s*(<div\b[^>]*>)\s*<\/p>/gi,'$1')
  .replace(/<p>\s*(<\/div>)\s*<\/p>/gi,'$1')
  .replace(/<p>\s*(<div\b[^>]*>[\s\S]*?<\/div>)\s*<\/p>/gi,'$1')
  .replace(/<p>\s*(<img\b[^>]*\/?>)\s*<\/p>/gi,'$1');
}
