const { chromium } = require('playwright-core');
const BASE='http://127.0.0.1:3001/index.html';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-dev-shm-usage']});
  const c=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
  const p=await c.newPage();
  await p.goto(BASE,{waitUntil:'load'}); await sleep(2600);
  for(let i=0;i<5;i++)await p.keyboard.press("Tab");
  await sleep(500);
  const r=await p.evaluate(()=>{const e=document.activeElement;const s=getComputedStyle(e);
    return {id:e.id,tag:e.tagName,focusVisible:e.matches(':focus-visible'),boxShadow:s.boxShadow,borderColor:s.borderColor};});
  console.log('AFTER SETTLE:',JSON.stringify(r,null,2));
  await p.locator('#cityInput').screenshot({path:'deliverables/gstack/ui-award/perf-a11y/focus-cityInput.png'});
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
