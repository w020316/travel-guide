const { chromium } = require('playwright-core');
const BASE='http://127.0.0.1:3001/index.html';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-dev-shm-usage']});
  const c=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
  const p=await c.newPage();
  await p.goto(BASE,{waitUntil:'load'}); await sleep(1800);
  await p.keyboard.press('Tab');
  const before=await p.evaluate(()=>{const e=document.activeElement;const r=e.getBoundingClientRect();const s=getComputedStyle(e);return{cls:e.className,top:s.top,rectTop:Math.round(r.top),vis:r.top>=0&&r.bottom>0};});
  await sleep(500);
  const after=await p.evaluate(()=>{const e=document.activeElement;const r=e.getBoundingClientRect();const s=getComputedStyle(e);return{cls:e.className,top:s.top,rectTop:Math.round(r.top),rectLeft:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height),vis:r.top>=0&&r.bottom>0,outline:s.outlineWidth+' '+s.outlineColor};});
  console.log('BEFORE settle:',JSON.stringify(before));
  console.log('AFTER  settle:',JSON.stringify(after));
  await p.locator('.skip-link').screenshot({path:'deliverables/gstack/ui-award/perf-a11y/r3/skip-link.png'});
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
