/**
 * TEMPORARY iOS diagnostics (branch debug/ios-diagnostics). Remove before merge.
 *
 * Everything here is inert unless the page was opened with `?debug=1`: the
 * inline gate below only then creates `window.__AUREN_DBG` and loads
 * `/auren-debug.js`, which renders the on-screen panel.
 */

type AurenDebug = {
  flags: Record<string, number | boolean>;
  mark: (name: string, data?: unknown) => void;
};

declare global {
  interface Window {
    __AUREN_DBG?: AurenDebug;
  }
}

export function dbgMark(name: string, data?: unknown) {
  if (typeof window !== "undefined") window.__AUREN_DBG?.mark(name, data);
}

export function dbgFlag(name: string) {
  return typeof window !== "undefined" && !!window.__AUREN_DBG?.flags[name];
}

/**
 * Runs synchronously at the top of <body>, before any Next/React chunk, so it
 * captures boot errors even if hydration never happens. ES5 on purpose.
 */
export const DEBUG_GATE = `(function(){try{
var q=location.search,ss=window.sessionStorage,K="auren-debug";
if(/[?&]debug=0(&|$)/.test(q)){ss.removeItem(K);return}
var on=/[?&]debug=1(&|$)/.test(q),saved=ss.getItem(K);
if(!on&&!saved)return;
var flags={};
if(on){["no3d","nonative","noresize","nolenis"].forEach(function(f){if(new RegExp("[?&]dbg-"+f+"=1(&|$)").test(q))flags[f]=1});ss.setItem(K,JSON.stringify(flags))}
else{try{flags=JSON.parse(saved)||{}}catch(x){}}
var t0=Date.now(),log=[];
var D=window.__AUREN_DBG={flags:flags,log:log,marks:[],t0:t0,
push:function(e){e.t=Date.now()-t0;log.push(e);if(log.length>400)log.shift();if(D.onpush)D.onpush(e)},
mark:function(n,d){D.marks.push({t:Date.now()-t0,n:n,d:d});if(D.marks.length>400)D.marks.shift();if(D.onmark)D.onmark()}};
addEventListener("error",function(e){var t=e.target;if(t&&t!==window&&t.tagName){D.push({type:"resource",msg:t.tagName+" failed",src:t.currentSrc||t.src||t.href})}else{D.push({type:"error",msg:String(e.message),src:e.filename,line:e.lineno,col:e.colno,stack:e.error&&e.error.stack?String(e.error.stack).slice(0,1500):""})}},true);
addEventListener("unhandledrejection",function(e){var r=e.reason;D.push({type:"rejection",msg:String(r&&r.message||r),stack:r&&r.stack?String(r.stack).slice(0,1500):""})});
document.addEventListener("securitypolicyviolation",function(e){D.push({type:"csp",msg:e.violatedDirective,src:e.blockedURI})});
["error","warn"].forEach(function(k){var o=console[k];console[k]=function(){try{D.push({type:"console."+k,msg:[].map.call(arguments,function(a){try{return a instanceof Error?a.message+" "+a.stack:typeof a=="object"?JSON.stringify(a).slice(0,400):String(a)}catch(x){return String(a)}}).join(" ").slice(0,1500)})}catch(x){}return o.apply(console,arguments)}});
D.native={scrollTimeline:typeof ScrollTimeline!="undefined",viewTimeline:typeof ViewTimeline!="undefined"};
if(flags.nonative){["ScrollTimeline","ViewTimeline"].forEach(function(n){try{delete window[n]}catch(x){}if(typeof window[n]!="undefined"){try{Object.defineProperty(window,n,{value:undefined,configurable:true,writable:true})}catch(x){}}});D.nativeAfterFlag={scrollTimeline:typeof ScrollTimeline!="undefined",viewTimeline:typeof ViewTimeline!="undefined"}}
if(flags.no3d)document.documentElement.classList.add("dbg-no3d");
var s=document.createElement("script");s.src="/auren-debug.js?v=1";s.async=true;(document.head||document.documentElement).appendChild(s);
}catch(e){}})();`;
