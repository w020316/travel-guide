const { chromium } = require('playwright-core');
const BASE='http://127.0.0.1:3001/index.html';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const b=await chromium.launch({channel:'msedge',headless:true,args:['--disable-dev-shm-usage']});
  const out={};
  // 桌面：modal 内层 ARIA
  const c=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
  const p=await c.newPage(); await p.goto(BASE,{waitUntil:'load'}); await sleep(2000);
  await p.click('#navFavoritesBtn'); await sleep(400);
  out.modal=await p.evaluate(()=>{const d=document.querySelector('#favoritesModal .modal');const lb=d.getAttribute('aria-labelledby');
    const t=lb?document.getElementById(lb):null;
    return {role:d.getAttribute('role'),ariaModal:d.getAttribute('aria-modal'),labelledby:lb,labelText:t?t.textContent.trim():null};});
  await c.close();
  // 移动端：nav-menu-item 焦点环
  const c2=await b.newContext({viewport:{width:600,height:900},serviceWorkers:'block'});
  const p2=await c2.newPage(); await p2.goto(BASE,{waitUntil:'load'}); await sleep(2000);
  const btnVis=await p2.evaluate(()=>{const b=document.getElementById('navMenuBtn');return {display:getComputedStyle(b).display,hidden:!!b.closest('[hidden]')};});
  await p2.click('#navMenuBtn'); await sleep(400);
  const menuOpen=await p2.evaluate(()=>({hidden:document.getElementById('navMenu').hidden,expanded:document.getElementById('navMenuBtn').getAttribute('aria-expanded')}));
  // 聚焦第一个 nav-menu-item
  const focusRing=await p2.evaluate(()=>{const it=document.querySelector('#navMenu .nav-menu-item'); it.focus();
    const s=getComputedStyle(it); const r=it.getBoundingClientRect();
    return {cls:it.className,outline:s.outlineStyle+' '+s.outlineWidth+' '+s.outlineColor+' off'+s.outlineOffset,rect:Math.round(r.width)+'x'+Math.round(r.height)};});
  await sleep(300);
  const focusRing2=await p2.evaluate(()=>{const it=document.querySelector('#navMenu .nav-menu-item');const s=getComputedStyle(it);
    return {outline:s.outlineStyle+' '+s.outlineWidth+' '+s.outlineColor+' off'+s.outlineOffset};});
  out.mobileNav={btnVis,menuOpen,focusRing,focusRingAfter:focusRing2};
  await c2.close();
  console.log(JSON.stringify(out,null,2));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
