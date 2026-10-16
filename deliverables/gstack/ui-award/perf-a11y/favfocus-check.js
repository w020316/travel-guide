const { chromium } = require('playwright-core');
const BASE='http://127.0.0.1:3001/index.html';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-dev-shm-usage']});
  const c=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
  const p=await c.newPage(); await p.goto(BASE,{waitUntil:'load'}); await sleep(1500);
  await p.evaluate(()=>{const favs=[1,2,3].map(i=>({city:'城市'+i,title:'标题'+i,subtitle:'副'+i,time:Date.now()-i*1000}));
    localStorage.setItem('xj_favorites',JSON.stringify(favs));});
  await p.reload({waitUntil:'load'}); await sleep(1800);
  await p.click('#navFavoritesBtn'); await sleep(500);
  const wrapVisible=await p.evaluate(()=>!document.getElementById('favSearchWrap').hidden);
  for(let i=0;i<8;i++){await p.keyboard.press('Tab');await sleep(120);const id=await p.evaluate(()=>document.activeElement.id);if(id==='favSearchInput')break;}
  const r=await p.evaluate(()=>{const e=document.activeElement;const s=getComputedStyle(e);
    return {id:e.id,cls:(e.className||'').toString(),focusVisible:e.matches(':focus-visible'),
      outline:s.outlineStyle+' '+s.outlineWidth,boxShadow:s.boxShadow,borderColor:s.borderColor};});
  console.log('favSearchWrap visible:',wrapVisible);
  console.log('active after tabs:',JSON.stringify(r,null,2));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
