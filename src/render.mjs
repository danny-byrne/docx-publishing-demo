import React from 'react';
import parse, { domToReact } from 'html-react-parser';
const h=React.createElement;
const allowed=new Set(['p','h1','h2','h3','h4','strong','em','b','i','u','s','ul','ol','li','br','blockquote','table','thead','tbody','tr','td','th','sup','sub','hr','code','pre']);
const blocked=new Set(['script','style','iframe','object','embed','form','input','button','svg','math','link','meta','video','audio','source']);
export const imageIds={
 ridge:{src:'./images/ridgeline.svg',alt:'An original illustration of layered mountains at sunrise',caption:'A quiet ridgeline, drawn for this fictional journal.'}
};
export function safeHref(value=''){return /^(https?:\/\/|#[a-zA-Z0-9_-])/i.test(value)?value:undefined}
export function renderArticle(html){
 const options={replace(node){
  if(!node.name)return;
  const name=node.name.toLowerCase(),attrs=node.attribs||{};
  const children=()=>domToReact(node.children||[],options);
  if(blocked.has(name))return h(React.Fragment);
  if(name==='div'&&attrs.id==='quote')return h('blockquote',{className:'article-quote'},children());
  if(name==='div'&&attrs.id==='info')return h('aside',{className:'article-info'},h('span',{className:'eyebrow'},'FIELD NOTE'),h('div',{},children()));
  if(name==='div'&&attrs.id==='datestamp')return h('p',{className:'article-date'},children());
  if(name==='div'&&attrs.id==='horizontalLine')return h('hr');
  if(name==='div'&&attrs.id==='video')return h('figure',{className:'article-video'},h('video',{controls:true,preload:'none','aria-label':'Neutral sample video of flowers'},h('source',{src:'https://developer.mozilla.org/shared-assets/videos/flower.mp4',type:'video/mp4'})),h('figcaption',{},'Optional CC0 sample video from MDN. Playback uses an external host.'));
  if(name==='img'){const image=imageIds[attrs.id];return image?h('figure',{},h('img',{src:image.src,alt:image.alt}),h('figcaption',{},image.caption)):h(React.Fragment);}
  if(name==='a'){const href=safeHref(attrs.href);return href?h('a',{href,target:href.startsWith('#')?undefined:'_blank',rel:'noopener noreferrer'},children()):h('span',{},children());}
  if(allowed.has(name))return h(name,{},...(name==='br'||name==='hr'?[]:[children()]));
  return h(React.Fragment,{},children());
 }};
 return parse(html,options);
}
