import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import mammoth from 'mammoth';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {cleanMammothHtml} from '../src/conversion.mjs';
import {renderArticle,safeHref} from '../src/render.mjs';
const fixture=name=>fileURLToPath(new URL(`../public/samples/${name}.docx`,import.meta.url));
const render=html=>renderToStaticMarkup(React.createElement('article',{},renderArticle(html)));
const options={styleMap:["p[style-name='Title'] => h1:fresh","p[style-name='Heading 1'] => h2:fresh","p[style-name='Heading 2'] => h3:fresh"]};
test('the real sample converts into a readable title, list, quote, and local illustration',async()=>{
 const {value}=await mammoth.convertToHtml({path:fixture('Field-Journal')},options);
 const result=render(cleanMammothHtml(value));
 assert.match(result,/<h1>A morning on the ridge<\/h1>/);
 assert.match(result,/<ul>/);assert.match(result,/article-quote/);assert.match(result,/article-info/);
 assert.match(result,/ridgeline.svg/);assert.match(result,/Fictional|fictional/);
 assert.doesNotMatch(result,/<p>\s*<(?:div|img)/);
});
test('the component reference exercises every supported marker',async()=>{
 const {value}=await mammoth.convertToHtml({path:fixture('Component-Reference')},options);
 const result=render(cleanMammothHtml(value));
 for(const pattern of [/article-quote/,/article-info/,/ridgeline.svg/,/article-date/,/<hr\/>/,/<video/])assert.match(result,pattern);
});
test('cleanup preserves ordinary paragraphs around a multi-paragraph marker',()=>{
 assert.equal(cleanMammothHtml('<p>Before</p><p>&lt;div id=quote&gt;</p><p>Keep this.</p><p>&lt;/div&gt;</p><p>After</p>'),'<p>Before</p><div id=quote><p>Keep this.</p></div><p>After</p>');
});
test('renderer drops executable elements, arbitrary images, attributes, and unsafe links',()=>{
 const result=render('<script>alert(1)</script><iframe src="https://example.com"></iframe><img src=x onerror=alert(1)><p onclick="alert(1)" style="color:red">Readable</p><a href="javascript:alert(1)">Unsafe</a><svg onload="alert(1)"></svg>');
 assert.doesNotMatch(result,/script|iframe|onerror|onclick|style=|javascript:|<svg|<img/);
 assert.match(result,/Readable/);assert.match(result,/Unsafe/);
});
test('links preserve supported destinations without document-supplied attributes',()=>{
 assert.equal(safeHref('javascript:alert(1)'),undefined);assert.equal(safeHref('//example.com'),undefined);
 const result=render('<a href="https://example.com" onclick="bad()">Example</a>');
 assert.match(result,/href="https:\/\/example.com"/);assert.match(result,/noopener noreferrer/);assert.doesNotMatch(result,/onclick/);
});
test('invalid DOCX bytes reject rather than render a partial document',async()=>{
 await assert.rejects(()=>mammoth.convertToHtml({buffer:Buffer.from('not a Word document')}));
});
