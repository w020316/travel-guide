/* =========================================================
   行纪 XING JI — 主应用逻辑
   统一处理：本地 627 城数据库 + 后端 AI 攻略生成
   修复：使用 EXPANDED_CITIES（旧代码误用 EMBEDDED_CITIES 导致本地模式失效）
   ========================================================= */

(function () {
    'use strict';

    // ---------- 城市数据库（来自 data/expandedCities.js）----------
    const CITIES = (typeof EXPANDED_CITIES !== 'undefined') ? EXPANDED_CITIES : {};

    // ---------- 状态 ----------
    const state = {
        selectedDays: 3,
        travelType: 'balanced',
        budgetRange: 'medium',
        currentGuide: null,
        currentCity: null,
        posterStyle: 'fresh',
        favorites: loadFavorites(),
        history: loadHistory()
    };

    // ---------- API 客户端 ----------
    const API = {
        // 同源部署时用相对路径；本地 file:// 打开时回退到本地模式
        base: detectBaseURL(),
        mode: detectMode(),

        async generateGuide(city, prefs) {
            if (this.mode === 'local') return buildLocalGuide(city, prefs);
            try {
                const ctrl = new AbortController();
                const timer = setTimeout(() => ctrl.abort(), 45000);
                const res = await fetch(`${this.base}/api/ai/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ city, preferences: prefs }),
                    signal: ctrl.signal
                });
                clearTimeout(timer);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (json.success && json.data) return json.data;
                throw new Error(json.error || '生成失败');
            } catch (e) {
                console.warn('后端生成失败，回退本地数据:', e.message);
                return buildLocalGuide(city, prefs);
            }
        },

        async getTrending() {
            if (this.mode === 'local') return null;
            try {
                const res = await fetch(`${this.base}/api/expanded/trending?limit=12`, { signal: AbortSignal.timeout(5000) });
                if (!res.ok) return null;
                const json = await res.json();
                return json.success ? json.data : null;
            } catch { return null; }
        }
    };

    function detectBaseURL() {
        if (typeof window === 'undefined') return '';
        const h = window.location.hostname;
        if (h === 'localhost' || h === '127.0.0.1') {
            // 同源（后端托管）时用相对，独立打开前端时指向 3001
            return window.location.port === '3001' ? '' : 'http://localhost:3001';
        }
        return ''; // 生产同源
    }
    function detectMode() {
        if (typeof window === 'undefined') return 'local';
        if (window.location.protocol === 'file:') return 'local';
        return 'backend';
    }

    // ---------- 本地攻略生成（基于 627 城数据库）----------
    function buildLocalGuide(city, prefs) {
        const base = CITIES[city];
        const days = prefs.days || 3;
        if (!base) {
            return {
                city, title: `${city}·发现之旅`, subtitle: '探索这座城市的独特魅力',
                season: '四季皆宜', duration: `${days}天`, overallBudget: `${days * 500}-${days * 1200}元`,
                difficulty: '适中', source: 'local-mock',
                routes: buildMockRoutes(city, days),
                foods: [{ name: `${city}特色菜`, description: '当地招牌美食', price: '38-68元', mustTry: true, whereToEat: [{ name: '老字号', address: '市中心' }] }],
                accommodations: [{ name: `${city}舒适酒店`, area: '市中心', priceRange: { lowSeason: '200元', peakSeason: '400元' }, features: ['交通便利', '性价比高'] }],
                tips: { prepare: ['身份证', '舒适鞋', '充电宝'], avoid: ['避开节假日高峰', '警惕黑导游'], bestTime: ['春秋两季最佳'] },
                budget: { total: `${days * 600}元`, breakdown: { 交通: '400元', 住宿: `${days * 250}元`, 餐饮: `${days * 150}元`, 门票: '200元' }, moneySavingTips: ['提前预订', '使用学生证'] },
                transportation: { arrival: '高铁/飞机可达', localTransport: '地铁+公交便捷' },
                tags: ['本地数据']
            };
        }
        // 基于 DB 数据按天数扩展
        const routes = normalizeRoutes(base.routes, days, city);
        return {
            city,
            title: base.title || `${city}·旅行手记`,
            subtitle: base.poster?.subtitle || base.atmosphere || `发现${city}的独特魅力`,
            season: base.season || '四季皆宜',
            duration: `${days}天`,
            overallBudget: `${days * 400}-${days * 1200}元`,
            difficulty: '适中',
            source: 'local-db',
            routes,
            foods: (base.foods || []).map(f => ({
                name: f.name, description: f.description || '', price: f.price || '—',
                mustTry: !!f.mustTry, rating: 5, whereToEat: [{ name: f.location || '当地老字号', address: '市区' }]
            })),
            accommodations: [{ name: `${city}精品住宿`, area: '市中心', priceRange: { lowSeason: '200元', peakSeason: '500元' }, features: ['交通便利', '干净卫生', '近景点'] }],
            tips: { prepare: ['身份证件', '舒适步行鞋', '充电宝', '雨具'], avoid: ['避开旅游旺季人流', '不轻信路边揽客'], bestTime: [base.season || '春秋最佳'] },
            budget: { total: `${days * 600}元`, breakdown: { 交通: '400元', 住宿: `${days * 280}元`, 餐饮: `${days * 160}元`, 门票: '200元' }, moneySavingTips: ['提前预订酒店', '关注景区免票日'] },
            transportation: { arrival: '高铁/飞机/自驾均可到达', localTransport: '地铁、公交、网约车便利' },
            tags: base.tags || []
        };
    }

    function normalizeRoutes(routeStrs, days, city) {
        const list = routeStrs || [];
        const out = [];
        for (let i = 0; i < days; i++) {
            const route = list[i % Math.max(list.length, 1)] || `${city}精华景点漫步`;
            out.push({
                day: i + 1,
                theme: `第 ${i + 1} 天 · ${city}探索`,
                routeLine: route,
                spots: route.split('→').map(s => s.trim()).filter(Boolean)
            });
        }
        return out;
    }
    function buildMockRoutes(city, days) {
        const out = [];
        for (let i = 0; i < days; i++) {
            out.push({
                day: i + 1, theme: `第 ${i + 1} 天 · ${city}精华`,
                routeLine: `${city}地标→历史街区→美食街`,
                spots: [`${city}地标景点`, '历史文化街区', '特色美食街']
            });
        }
        return out;
    }

    // ---------- DOM 引用 ----------
    const $ = (id) => document.getElementById(id);
    const dom = {
        cityInput: $('cityInput'), suggestions: $('searchSuggestions'), form: $('searchForm'),
        dayPills: $('dayPills'), travelType: $('travelType'), budgetRange: $('budgetRange'),
        quickCities: $('quickCities'), rankingList: $('rankingList'),
        historySection: $('historySection'), historyList: $('recentHistoryList'),
        loading: $('loading'), loadingCity: $('loadingCity'), loadingSub: $('loadingSub'), loadingBar: $('loadingBar'),
        resultPage: $('resultPage'), homePage: $('homePage'),
        resultTitle: $('resultTitle'), guideContent: $('guideContent'), poster: $('poster'),
        backBtn: $('backBtn'), favoriteBtn: $('favoriteBtn'), copyTextBtn: $('copyTextBtn'), downloadPosterBtn: $('downloadPosterBtn'),
        posterStyles: $('posterStyles'),
        navFavCount: $('navFavCount'), navFavoritesBtn: $('navFavoritesBtn'),
        favoritesModal: $('favoritesModal'), closeFavoritesModal: $('closeFavoritesModal'),
        favoritesList: $('favoritesList'), emptyFavorites: $('emptyFavorites'),
        clearAllFavorites: $('clearAllFavorites'), exportFavorites: $('exportFavorites'),
        brandHome: $('brandHome'), toastWrap: $('toastWrap')
    };

    // ---------- 初始化 ----------
    function init() {
        renderQuickCities();
        renderRanking();
        renderHistory();
        updateFavCount();
        bindEvents();
    }

    // ---------- 热门城市快捷 ----------
    function renderQuickCities() {
        const hot = ['北京', '上海', '成都', '杭州', '西安', '重庆', '厦门', '丽江', '三亚', '大理', '拉萨', '敦煌'];
        const frag = document.createDocumentFragment();
        hot.forEach(c => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'qc-btn';
            b.textContent = c;
            b.onclick = (e) => { e.preventDefault(); dom.cityInput.value = c; submitCity(c); };
            frag.appendChild(b);
        });
        dom.quickCities.appendChild(frag);
    }

    // ---------- 排行榜 ----------
    function renderRanking() {
        const list = Object.entries(CITIES)
            .map(([name, d]) => ({ name, ...d }))
            .sort((a, b) => scoreCity(b) - scoreCity(a))
            .slice(0, 12);

        if (!list.length) { dom.rankingList.innerHTML = '<p class="empty-guide">城市数据加载中…</p>'; return; }

        dom.rankingList.innerHTML = list.map((c, i) => `
            <article class="rank-card" data-rank="${String(i + 1).padStart(2, '0')}" data-city="${c.name}">
                <div class="rc-body">
                    <div class="rc-name">${c.name}</div>
                    <div class="rc-title">${c.title || ''}</div>
                    <div class="rc-tags">${(c.tags || []).slice(0, 3).map(t => `<span class="rc-tag">${t}</span>`).join('')}</div>
                    <div class="rc-meta">
                        <span>季节 <strong>${c.season || '四季皆宜'}</strong></span>
                        <span>建议 <strong>${c.days || '3'}天</strong></span>
                    </div>
                </div>
                <div class="rc-arrow">→</div>
            </article>
        `).join('');

        dom.rankingList.querySelectorAll('.rank-card').forEach(card => {
            card.onclick = () => { const city = card.dataset.city; dom.cityInput.value = city; submitCity(city); };
        });
    }

    // 简单的城市热度评分（按季节 + 标签）
    function scoreCity(c) {
        let s = 50;
        const month = new Date().getMonth() + 1;
        const season = c.season || '';
        if ((month >= 3 && month <= 5) && season.includes('春')) s += 30;
        if ((month >= 9 && month <= 11) && season.includes('秋')) s += 30;
        if (season.includes('四季') || season.includes('全年')) s += 15;
        if ((c.tags || []).includes('历史文化')) s += 8;
        if ((c.tags || []).includes('美食')) s += 8;
        if (c.foods && c.foods.length > 3) s += 6;
        if (c.routes && c.routes.length > 3) s += 6;
        return s + Math.random() * 4;
    }

    // ---------- 历史 ----------
    function renderHistory() {
        if (!state.history.length) { dom.historySection.hidden = true; return; }
        dom.historySection.hidden = false;
        dom.historyList.innerHTML = state.history.slice(0, 8).map(h => `
            <div class="history-chip" data-city="${h.city}">
                <span>${h.city}</span><span class="hc-time">${timeAgo(h.time)}</span>
            </div>
        `).join('');
        dom.historyList.querySelectorAll('.history-chip').forEach(chip => {
            chip.onclick = () => { const city = chip.dataset.city; dom.cityInput.value = city; submitCity(city); };
        });
    }

    // ---------- 事件绑定 ----------
    function bindEvents() {
        dom.form.addEventListener('submit', (e) => { e.preventDefault(); submitCity(dom.cityInput.value.trim()); });

        // 天数
        dom.dayPills.querySelectorAll('.pill').forEach(p => {
            p.onclick = () => {
                dom.dayPills.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
                p.classList.add('active');
                state.selectedDays = parseInt(p.dataset.days, 10);
            };
        });
        dom.travelType.onchange = () => state.travelType = dom.travelType.value;
        dom.budgetRange.onchange = () => state.budgetRange = dom.budgetRange.value;

        // 搜索建议
        let suggestTimer;
        dom.cityInput.addEventListener('input', () => {
            clearTimeout(suggestTimer);
            const q = dom.cityInput.value.trim();
            if (!q) { dom.suggestions.hidden = true; return; }
            suggestTimer = setTimeout(() => showSuggestions(q), 160);
        });
        dom.cityInput.addEventListener('blur', () => setTimeout(() => dom.suggestions.hidden = true, 200));
        dom.cityInput.addEventListener('focus', () => {
            if (dom.suggestions.innerHTML) dom.suggestions.hidden = false;
        });

        // 结果页
        dom.backBtn.onclick = showHome;
        dom.favoriteBtn.onclick = toggleFavorite;
        dom.copyTextBtn.onclick = copyGuideText;
        dom.downloadPosterBtn.onclick = downloadPoster;

        // 海报风格
        dom.posterStyles.querySelectorAll('.style-pill').forEach(p => {
            p.onclick = () => {
                dom.posterStyles.querySelectorAll('.style-pill').forEach(x => x.classList.remove('active'));
                p.classList.add('active');
                state.posterStyle = p.dataset.style;
                renderPoster();
            };
        });

        // 收藏
        dom.navFavoritesBtn.onclick = openFavorites;
        dom.closeFavoritesModal.onclick = closeFavorites;
        dom.favoritesModal.addEventListener('click', (e) => { if (e.target === dom.favoritesModal) closeFavorites(); });
        dom.clearAllFavorites.onclick = clearFavorites;
        dom.exportFavorites.onclick = exportFavorites;

        dom.brandHome.onclick = (e) => { e.preventDefault(); showHome(); };
    }

    // ---------- 搜索建议 ----------
    function showSuggestions(q) {
        const lower = q.toLowerCase();
        const matches = Object.entries(CITIES)
            .map(([name, d]) => {
                let score = 0;
                if (name === q) score = 100;
                else if (name.includes(q)) score = 85;
                else if ((d.tags || []).some(t => t.includes(q))) score = 60;
                else if ((d.title || '').includes(q)) score = 40;
                return { name, d, score };
            })
            .filter(m => m.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        if (!matches.length) { dom.suggestions.hidden = true; return; }
        dom.suggestions.innerHTML = matches.map(m => `
            <div class="suggestion-item" data-city="${m.name}">
                <div>
                    <div class="s-name">${m.name}</div>
                    <div class="s-title">${m.d.title || ''}</div>
                </div>
                <div class="s-tags">${(m.d.tags || []).slice(0, 2).join(' · ')}</div>
            </div>
        `).join('');
        dom.suggestions.hidden = false;
        dom.suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.onmousedown = () => { dom.cityInput.value = item.dataset.city; dom.suggestions.hidden = true; submitCity(item.dataset.city); };
        });
    }

    // ---------- 提交生成 ----------
    async function submitCity(city) {
        if (!city) { toast('请输入城市名称', 'error'); return; }
        showLoading(city);
        const prefs = { days: state.selectedDays, travelType: state.travelType, budgetRange: state.budgetRange };
        try {
            const guide = await API.generateGuide(city, prefs);
            state.currentGuide = guide;
            state.currentCity = city;
            addHistory(city);
            renderResult(guide);
            hideLoading();
            showResult();
        } catch (e) {
            hideLoading();
            toast('生成失败：' + e.message, 'error');
        }
    }

    // ---------- 渲染结果 ----------
    function renderResult(g) {
        dom.resultTitle.textContent = g.title || `${g.city}攻略`;
        renderGuide(g);
        renderPoster();
        updateFavoriteBtn();
    }

    function renderGuide(g) {
        const sections = [];

        // 头部
        sections.push(`
            <div class="gc-head">
                <div class="gc-eyebrow">${g.source === 'local-db' || g.source === 'local-mock' ? '本地数据 · ' : ''}${g.duration || ''} · ${g.difficulty || '适中'}</div>
                <h1>${g.title || g.city}</h1>
                <p class="gc-sub">${g.subtitle || ''}</p>
                <div class="gc-stats">
                    <div class="gc-stat">最佳季节 <strong>${g.season || '四季皆宜'}</strong></div>
                    <div class="gc-stat">行程 <strong>${g.duration || '3天'}</strong></div>
                    <div class="gc-stat">预算 <strong>${g.overallBudget || (g.budget && g.budget.total) || '待估'}</strong></div>
                </div>
            </div>
        `);

        // 行程
        if (g.routes && g.routes.length) {
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">01</span>每日行程</h2>
                    ${g.routes.map(r => {
                        const spots = r.spots && Array.isArray(r.spots)
                            ? r.spots.map(s => typeof s === 'string' ? s : s.name).filter(Boolean)
                            : [];
                        const routeLine = r.routeLine || (typeof r.route === 'string' ? r.route : '') || '';
                        return `
                            <div class="route-day">
                                <div class="route-day-head">
                                    <span class="route-day-num">${String(r.day || 1).padStart(2, '0')}</span>
                                    <span class="route-day-theme">${r.theme || r.title || `Day ${r.day || 1}`}</span>
                                </div>
                                ${routeLine ? `<div class="route-day-route">${routeLine}</div>` : ''}
                                ${spots.length ? `<ul class="route-list">${spots.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
                            </div>
                        `;
                    }).join('')}
                </section>
            `);
        }

        // 美食
        if (g.foods && g.foods.length) {
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">02</span>必尝美食</h2>
                    <div class="food-grid">
                        ${g.foods.map(f => `
                            <div class="food-card">
                                ${f.mustTry ? '<span class="fc-must">必吃</span>' : ''}
                                <div class="fc-name">${f.name}</div>
                                ${f.description ? `<div class="fc-desc">${f.description}</div>` : ''}
                                <div class="fc-meta">
                                    <span class="fc-price">${f.price || '—'}</span>
                                    <span class="fc-loc">${(f.whereToEat && f.whereToEat[0] && f.whereToEat[0].name) || f.location || ''}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `);
        }

        // 预算
        if (g.budget) {
            const b = g.budget;
            const items = b.breakdown || {};
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">03</span>费用预算</h2>
                    <div class="budget-box">
                        <div class="budget-total">${b.total || g.overallBudget || '待估'}</div>
                        <div class="budget-label">预估总费用（参考）</div>
                        <div class="budget-items">
                            ${Object.entries(items).map(([k, v]) => `
                                <div class="budget-item"><div class="bi-label">${k}</div><div class="bi-val">${v}</div></div>
                            `).join('')}
                        </div>
                        ${b.moneySavingTips && b.moneySavingTips.length ? `
                            <div style="margin-top:18px;font-size:14px;color:var(--muted);">省钱建议：${b.moneySavingTips.join('；')}</div>
                        ` : ''}
                    </div>
                </section>
            `);
        }

        // 贴士
        if (g.tips) {
            const t = g.tips;
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">04</span>实用贴士</h2>
                    <div class="tips-grid">
                        ${t.prepare && t.prepare.length ? `<div class="tip-block"><h4>行前准备</h4><ul>${t.prepare.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}
                        ${t.avoid && t.avoid.length ? `<div class="tip-block"><h4>避坑指南</h4><ul>${t.avoid.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}
                        ${t.bestTime && t.bestTime.length ? `<div class="tip-block"><h4>最佳时间</h4><ul>${t.bestTime.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}
                    </div>
                </section>
            `);
        }

        // 交通
        if (g.transportation) {
            const tr = g.transportation;
            sections.push(`
                <section class="gc-section">
                    <h2><span class="gc-idx">05</span>交通指南</h2>
                    <div class="transport-card">
                        ${tr.arrival ? `<h4>如何到达</h4><p>${typeof tr.arrival === 'string' ? tr.arrival : (tr.arrival.byAir?.details || tr.arrival.byTrain?.details || '高铁/飞机可达')}</p>` : ''}
                        ${tr.localTransport ? `<h4>市内交通</h4><p>${typeof tr.localTransport === 'string' ? tr.localTransport : (tr.localTransport.metro || tr.localTransport.bus || '地铁、公交便利')}</p>` : ''}
                    </div>
                </section>
            `);
        }

        dom.guideContent.innerHTML = sections.join('') || '<div class="empty-guide">暂无攻略数据</div>';
    }

    // ---------- 海报 ----------
    function renderPoster() {
        const g = state.currentGuide;
        if (!g) return;
        const style = state.posterStyle;
        const tags = (g.tags || []).slice(0, 3);
        const routes = (g.routes || []).slice(0, 4).map(r => r.routeLine || (typeof r.route === 'string' ? r.route : r.theme) || '').filter(Boolean);

        dom.poster.className = `poster style-${style}`;
        dom.poster.innerHTML = `
            <div class="p-top">
                <div class="p-eyebrow">XING JI · TRAVEL POSTER</div>
                <div class="p-city">${g.city}</div>
                <div class="p-sub">${g.subtitle || g.title || ''}</div>
            </div>
            <div class="p-mid">
                <ul class="p-routes">
                    ${routes.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
            <div class="p-bot">
                <div class="p-tags">${tags.map(t => `<span>${t}</span>`).join('')}</div>
                <div class="p-days">${g.duration || '3天'}</div>
            </div>
        `;
    }

    // ---------- 视图切换 ----------
    function showResult() {
        dom.homePage.hidden = true;
        dom.resultPage.hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function showHome() {
        dom.resultPage.hidden = true;
        dom.homePage.hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ---------- 加载 ----------
    let loadingTimer;
    function showLoading(city) {
        dom.loadingCity.textContent = city;
        dom.loadingSub.textContent = 'AI 正在分析景点、美食与预算…';
        dom.loadingBar.style.width = '0%';
        dom.loading.hidden = false;
        let p = 0;
        loadingTimer = setInterval(() => {
            p = Math.min(p + Math.random() * 14, 92);
            dom.loadingBar.style.width = p + '%';
            if (p > 30) dom.loadingSub.textContent = '正在匹配你的旅行偏好…';
            if (p > 65) dom.loadingSub.textContent = '排版生成专属海报…';
        }, 420);
    }
    function hideLoading() {
        clearInterval(loadingTimer);
        dom.loadingBar.style.width = '100%';
        setTimeout(() => { dom.loading.hidden = true; }, 320);
    }

    // ---------- 收藏 ----------
    function loadFavorites() {
        try { return JSON.parse(localStorage.getItem('xj_favorites') || '[]'); } catch { return []; }
    }
    function saveFavorites() { localStorage.setItem('xj_favorites', JSON.stringify(state.favorites)); }
    function updateFavCount() { dom.navFavCount.textContent = state.favorites.length; }

    function toggleFavorite() {
        if (!state.currentGuide) return;
        const g = state.currentGuide;
        const idx = state.favorites.findIndex(f => f.city === g.city);
        if (idx >= 0) {
            state.favorites.splice(idx, 1);
            toast('已取消收藏');
        } else {
            state.favorites.unshift({ city: g.city, title: g.title, subtitle: g.subtitle, time: Date.now() });
            toast('已加入收藏', 'success');
        }
        saveFavorites();
        updateFavCount();
        updateFavoriteBtn();
    }
    function updateFavoriteBtn() {
        const fav = state.favorites.some(f => f.city === state.currentCity);
        dom.favoriteBtn.classList.toggle('active', fav);
        dom.favoriteBtn.textContent = fav ? '已收藏' : '收藏';
    }

    function openFavorites() {
        renderFavoritesList();
        dom.favoritesModal.hidden = false;
    }
    function closeFavorites() { dom.favoritesModal.hidden = true; }
    function renderFavoritesList() {
        if (!state.favorites.length) {
            dom.favoritesList.innerHTML = '';
            dom.emptyFavorites.hidden = false;
            return;
        }
        dom.emptyFavorites.hidden = true;
        dom.favoritesList.innerHTML = state.favorites.map(f => `
            <div class="fav-item">
                <div>
                    <div class="fi-name">${f.city}</div>
                    <div class="fi-title">${f.title || ''}</div>
                </div>
                <div class="fi-actions">
                    <button class="fi-btn view" data-city="${f.city}">查看</button>
                    <button class="fi-btn del" data-city="${f.city}">删除</button>
                </div>
            </div>
        `).join('');
        dom.favoritesList.querySelectorAll('.fi-btn.view').forEach(b => {
            b.onclick = () => { closeFavorites(); dom.cityInput.value = b.dataset.city; submitCity(b.dataset.city); };
        });
        dom.favoritesList.querySelectorAll('.fi-btn.del').forEach(b => {
            b.onclick = () => {
                state.favorites = state.favorites.filter(f => f.city !== b.dataset.city);
                saveFavorites(); updateFavCount(); renderFavoritesList(); updateFavoriteBtn();
                toast('已删除');
            };
        });
    }
    function clearFavorites() {
        if (!state.favorites.length) return;
        if (!confirm('确定清空所有收藏？')) return;
        state.favorites = [];
        saveFavorites(); updateFavCount(); renderFavoritesList(); updateFavoriteBtn();
        toast('已清空收藏');
    }
    function exportFavorites() {
        if (!state.favorites.length) { toast('暂无收藏可导出', 'error'); return; }
        const text = state.favorites.map((f, i) => `${i + 1}. ${f.city} — ${f.title || ''}`).join('\n');
        downloadFile('我的收藏.txt', text);
        toast('已导出收藏列表', 'success');
    }

    // ---------- 历史 ----------
    function loadHistory() {
        try { return JSON.parse(localStorage.getItem('xj_history') || '[]'); } catch { return []; }
    }
    function addHistory(city) {
        state.history = state.history.filter(h => h.city !== city);
        state.history.unshift({ city, time: Date.now() });
        state.history = state.history.slice(0, 12);
        localStorage.setItem('xj_history', JSON.stringify(state.history));
        renderHistory();
    }

    // ---------- 复制 / 下载 ----------
    function copyGuideText() {
        const g = state.currentGuide;
        if (!g) return;
        let text = `《${g.title}》\n${g.subtitle || ''}\n${'─'.repeat(30)}\n`;
        text += `城市：${g.city}\n季节：${g.season || '四季皆宜'}\n行程：${g.duration || '3天'}\n预算：${g.overallBudget || (g.budget && g.budget.total) || '待估'}\n`;
        if (g.routes) {
            text += `\n【行程】\n`;
            g.routes.forEach(r => { text += `Day ${r.day} ${r.theme || ''}：${r.routeLine || ''}\n`; });
        }
        if (g.foods) {
            text += `\n【美食】\n`;
            g.foods.forEach(f => { text += `· ${f.name} ${f.price || ''} ${f.mustTry ? '(必吃)' : ''}\n`; });
        }
        navigator.clipboard.writeText(text).then(
            () => toast('攻略已复制到剪贴板', 'success'),
            () => toast('复制失败，请手动选择', 'error')
        );
    }

    function downloadPoster() {
        if (typeof html2canvas === 'undefined') { toast('海报组件未加载，请刷新重试', 'error'); return; }
        const node = dom.poster;
        toast('正在生成海报…');
        html2canvas(node, { scale: 2, backgroundColor: null, useCORS: true }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${state.currentCity || '旅行'}-海报.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast('海报已下载', 'success');
        }).catch(() => toast('海报生成失败', 'error'));
    }

    function downloadFile(name, content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.download = name;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // ---------- Toast ----------
    function toast(msg, type) {
        const t = document.createElement('div');
        t.className = 'toast' + (type ? ' ' + type : '');
        t.textContent = msg;
        dom.toastWrap.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(() => t.remove(), 300); }, 2400);
    }

    // ---------- 工具 ----------
    function timeAgo(ts) {
        const s = Math.floor((Date.now() - ts) / 1000);
        if (s < 60) return '刚刚';
        if (s < 3600) return Math.floor(s / 60) + '分钟前';
        if (s < 86400) return Math.floor(s / 3600) + '小时前';
        return Math.floor(s / 86400) + '天前';
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
