const { chromium } = require('playwright-core');
const BASE='http://127.0.0.1:3001/index.html';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-dev-shm-usage']});
  const c=await b.newContext({viewport:{width:600,height:900},serviceWorkers:'block'});
  const p=await c.newPage(); await p.goto(BASE,{waitUntil:'load'}); await sleep(2000);
  await p.click('#navMenuBtn'); await sleep(400);
  const seen=[];
  for(let i=0;i<6;i++){
    await p.keyboard.press('Tab'); await sleep(150);
    seen.push(await p.evaluate(()=>{const e=document.activeElement;const s=getComputedStyle(e);
      return {tag:e.tagName,cls:(e.className||'').toString().slice(0,20),text:(e.textContent||'').trim().slice(0,10),
        focusVisible:e.matches(':focus-visible'),
        outline:s.outlineStyle+' '+s.outlineWidth+' '+s.outlineColor+' off'+s.outlineOffset, bg:s.backgroundColor};}));
  }
  console.log(JSON.stringify(seen,null,2));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
