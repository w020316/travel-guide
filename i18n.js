/**
 * 国际化多语言系统 (i18n)
 * 支持: 中文(zh)、英文(en)、日文(ja)、韩文(ko)
 * 版本: 2.0.0
 */

const I18N = {
    currentLanguage: 'zh',
    defaultLanguage: 'zh',
    supportedLanguages: ['zh', 'en', 'ja', 'ko'],
    translations: {},

    // 初始化
    init() {
        this.loadTranslations();
        this.detectLanguage();
        this.applyLanguage(this.currentLanguage);
        this.bindEvents();
        console.log(`🌐 i18n系统初始化完成，当前语言: ${this.currentLanguage}`);
    },

    // 加载所有翻译
    loadTranslations() {
        this.translations = {
            zh: {
                // 应用标题和副标题
                app: {
                    title: '旅游攻略生成器',
                    subtitle: 'AI智能规划您的完美旅程',
                    description: '输入城市名称，一键生成个性化旅游攻略'
                },

                // 搜索区域
                search: {
                    placeholder: '🔍 输入城市名称或使用语音...',
                    generate: '✨ AI生成攻略',
                    generating: '⏳ 正在生成攻略...',
                    clear: '清空'
                },

                // 热门标签
                home: {
                    hotCities: '热门城市：',
                    popularDestinations: '热门目的地',
                    recommended: '为您推荐'
                },

                // 结果区域
                result: {
                    title: '旅游攻略',
                    generatedFor: '为 {city} 生成的攻略',
                    days: '天行程',
                    budget: '预算',
                    bestSeason: '最佳季节',
                    tags: '特色标签',
                    routes: '推荐路线',
                    foods: '必吃美食',
                    tips: '旅行小贴士',
                    accommodation: '住宿推荐',
                    transport: '交通指南',
                    download: '下载攻略',
                    share: '分享',
                    regenerate: '重新生成',
                    loading: '正在加载...'
                },

                // 海报
                poster: {
                    explore: '探索',
                    discover: '发现',
                    adventure: '冒险之旅'
                },

                // 美食
                food: {
                    mustTry: '必吃',
                    price: '价格',
                    location: '推荐地点',
                    description: '特色介绍'
                },

                // 预算
                budget: {
                    low: '经济型',
                    medium: '舒适型',
                    high: '豪华型',
                    currency: '元',
                    perPerson: '/人',
                    total: '总预算'
                },

                // 按钮
                button: {
                    confirm: '确认',
                    cancel: '取消',
                    save: '保存',
                    copy: '复制',
                    close: '关闭',
                    more: '查看更多',
                    back: '返回'
                },

                // 消息提示
                message: {
                    success: '操作成功！',
                    error: '出错了，请重试',
                    noResult: '未找到相关结果',
                    loading: '加载中...',
                    cityNotFound: '未找到该城市，请检查名称',
                    networkError: '网络连接失败'
                },

                // 页脚
                footer: {
                    copyright: '© 2026 旅游攻略生成器',
                    madeWith: '用 ❤️ 制作',
                    about: '关于我们',
                    contact: '联系我们',
                    privacy: '隐私政策'
                }
            },

            en: {
                app: {
                    title: 'Travel Guide Generator',
                    subtitle: 'AI-Powered Perfect Trip Planner',
                    description: 'Enter a city name to generate personalized travel guides'
                },
                search: {
                    placeholder: '🔍 Enter city name or use voice...',
                    generate: '✨ AI Generate Guide',
                    generating: '⏳ Generating guide...',
                    clear: 'Clear'
                },
                home: {
                    hotCities: 'Popular Cities:',
                    popularDestinations: 'Top Destinations',
                    recommended: 'Recommended for You'
                },
                result: {
                    title: 'Travel Guide',
                    generatedFor: 'Guide for {city}',
                    days: 'Days Itinerary',
                    budget: 'Budget',
                    bestSeason: 'Best Season',
                    tags: 'Tags',
                    routes: 'Recommended Routes',
                    foods: 'Must-Try Foods',
                    tips: 'Travel Tips',
                    accommodation: 'Accommodation',
                    transport: 'Transportation',
                    download: 'Download Guide',
                    share: 'Share',
                    regenerate: 'Regenerate',
                    loading: 'Loading...'
                },
                poster: {
                    explore: 'Explore',
                    discover: 'Discover',
                    adventure: 'Adventure Awaits'
                },
                food: {
                    mustTry: 'Must Try',
                    price: 'Price',
                    location: 'Location',
                    description: 'Description'
                },
                budget: {
                    low: 'Budget',
                    medium: 'Comfortable',
                    high: 'Luxury',
                    currency: 'CNY',
                    perPerson: '/person',
                    total: 'Total Budget'
                },
                button: {
                    confirm: 'Confirm',
                    cancel: 'Cancel',
                    save: 'Save',
                    copy: 'Copy',
                    close: 'Close',
                    more: 'View More',
                    back: 'Back'
                },
                message: {
                    success: 'Success!',
                    error: 'Something went wrong, please try again',
                    noResult: 'No results found',
                    loading: 'Loading...',
                    cityNotFound: 'City not found, please check the name',
                    networkError: 'Network connection failed'
                },
                footer: {
                    copyright: '© 2026 Travel Guide Generator',
                    madeWith: 'Made with ❤️',
                    about: 'About Us',
                    contact: 'Contact',
                    privacy: 'Privacy Policy'
                }
            },

            ja: {
                app: {
                    title: '旅行ガイド生成器',
                    subtitle: 'AIによる完璧な旅のプランナー',
                    description: '都市名を入力して、パーソナライズされた旅行ガイドを生成'
                },
                search: {
                    placeholder: '🔍 都市名を入力または音声を使用...',
                    generate: '✨ AIガイドを生成',
                    generating: '⏳ ガイドを生成中...',
                    clear: 'クリア'
                },
                home: {
                    hotCities: '人気都市：',
                    popularDestinations: '人気の目的地',
                    recommended: 'あなたへのおすすめ'
                },
                result: {
                    title: '旅行ガイド',
                    generatedFor: '{city}のためのガイド',
                    days: '日の旅程',
                    budget: '予算',
                    bestSeason: 'ベストシーズン',
                    tags: 'タグ',
                    routes: 'おすすめルート',
                    foods: '必ず食べたい料理',
                    tips: '旅行のヒント',
                    accommodation: '宿泊推奨',
                    transport: '交通案内',
                    download: 'ガイドをダウンロード',
                    share: '共有',
                    regenerate: '再生成',
                    loading: '読み込み中...'
                },
                poster: {
                    explore: '探検',
                    discover: '発見',
                    adventure: '冒険の旅'
                },
                food: {
                    mustTry: '必食',
                    price: '価格',
                    location: '場所',
                    description: '説明'
                },
                budget: {
                    low: '経済的',
                    medium: '快適',
                    high: 'ラグジュアリー',
                    currency: '元',
                    perPerson: '/人',
                    total: '総予算'
                },
                button: {
                    confirm: '確認',
                    cancel: 'キャンセル',
                    save: '保存',
                    copy: 'コピー',
                    close: '閉じる',
                    more: 'もっと見る',
                    back: '戻る'
                },
                message: {
                    success: '成功しました！',
                    error: 'エラーが発生しました、もう一度お試しください',
                    noResult: '結果が見つかりませんでした',
                    loading: '読み込み中...',
                    cityNotFound: '都市が見つかりません、名前を確認してください',
                    networkError: 'ネットワーク接続に失敗しました'
                },
                footer: {
                    copyright: '© 2026 旅行ガイド生成器',
                    madeWith: '❤️で作られました',
                    about: '私たちについて',
                    contact: 'お問い合わせ',
                    privacy: 'プライバシーポリシー'
                }
            },

            ko: {
                app: {
                    title: '여행 가이드 생성기',
                    subtitle: 'AI 기반 완벽한 여행 플래너',
                    description: '도시 이름을 입력하여 맞춤형 여행 가이드를 생성하세요'
                },
                search: {
                    placeholder: '🔍 도시 이름을 입력하거나 음성을 사용...',
                    generate: '✨ AI 가이드 생성',
                    generating: '⏳ 가이드 생성 중...',
                    clear: '지우기'
                },
                home: {
                    hotCities: '인기 도시:',
                    popularDestinations: '인기 목적지',
                    recommended: '추천 여행지'
                },
                result: {
                    title: '여행 가이드',
                    generatedFor: '{city}를 위한 가이드',
                    days: '일 여정',
                    budget: '예산',
                    bestSeason: '최적 계절',
                    tags: '태그',
                    routes: '추천 경로',
                    foods: '꼭 먹어야 할 음식',
                    tips: '여행 팁',
                    accommodation: '숙소 추천',
                    transport: '교통 안내',
                    download: '가이드 다운로드',
                    share: '공유',
                    regenerate: '재생성',
                    loading: '로딩 중...'
                },
                poster: {
                    explore: '탐색',
                    discover: '발견',
                    adventure: '모험의 시작'
                },
                food: {
                    mustTry: '맛봐야 함',
                    price: '가격',
                    location: '위치',
                    description: '설명'
                },
                budget: {
                    low: '경제형',
                    medium: '편안형',
                    high: '럭셔리',
                    currency: '위안',
                    perPerson: '/인',
                    total: '총 예산'
                },
                button: {
                    confirm: '확인',
                    cancel: '취소',
                    save: '저장',
                    copy: '복사',
                    close: '닫기',
                    more: '더 보기',
                    back: '뒤로'
                },
                message: {
                    success: '성공!',
                    error: '오류가 발생했습니다, 다시 시도해주세요',
                    noResult: '결과를 찾을 수 없습니다',
                    loading: '로딩 중...',
                    cityNotFound: '도시를 찾을 수 없습니다, 이름을 확인해 주세요',
                    networkError: '네트워크 연결에 실패했습니다'
                },
                footer: {
                    copyright: '© 2026 여행 가이드 생성기',
                    madeWith: '❤️로 만듦',
                    about: '소개',
                    contact: '문의',
                    privacy: '개인정보 처리방침'
                }
            }
        };
    },

    // 检测浏览器语言
    detectLanguage() {
        const savedLang = localStorage.getItem('preferred_language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
            return;
        }

        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.substring(0, 2).toLowerCase();

        if (this.supportedLanguages.includes(langCode)) {
            this.currentLanguage = langCode;
        } else {
            this.currentLanguage = this.defaultLanguage;
        }

        localStorage.setItem('preferred_language', this.currentLanguage);
    },

    // 切换语言
    switchLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`⚠️ 不支持的语言: ${lang}`);
            return false;
        }

        this.currentLanguage = lang;
        localStorage.setItem('preferred_language', lang);
        this.applyLanguage(lang);

        console.log(`🌐 语言已切换至: ${this.getLanguageName(lang)}`);

        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang, name: this.getLanguageName(lang) }
        }));

        return true;
    },

    // 获取语言显示名称
    getLanguageName(lang) {
        const names = {
            zh: '中文',
            en: 'English',
            ja: '日本語',
            ko: '한국어'
        };
        return names[lang] || lang;
    },

    // 获取翻译文本
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // 回退到默认语言
                value = this.translations[this.defaultLanguage];
                for (const k2 of keys) {
                    if (value && typeof value === 'object' && k2 in value) {
                        value = value[k2];
                    } else {
                        return key; // 返回原始key
                    }
                }
                break;
            }
        }

        if (typeof value === 'string') {
            // 替换参数
            Object.keys(params).forEach(param => {
                value = value.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
            });
            return value;
        }

        return key;
    },

    // 应用语言到DOM
    applyLanguage(lang) {
        this.updateAllText();
        this.updateLanguageSwitcher();
        document.documentElement.lang = lang;
        document.documentElement.dir = this.isRTL(lang) ? 'rtl' : 'ltr';
    },

    // 更新所有带data-i18n属性的元素
    updateAllText() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                const translatedText = this.t(key);
                if (translatedText && el.textContent !== translatedText) {
                    el.textContent = translatedText;
                }
            }
        });

        // 更新placeholder属性
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                const translatedPlaceholder = this.t(key);
                if (translatedPlaceholder) {
                    el.placeholder = translatedPlaceholder;
                }
            }
        });
    },

    // 更新语言切换器UI状态
    updateLanguageSwitcher() {
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        });
    },

    // 是否是RTL语言（从右到左）
    isRTL(lang) {
        const rtlLanguages = ['ar', 'he', 'fa'];
        return rtlLanguages.includes(lang);
    },

    // 绑定事件
    bindEvents() {
        // 语言切换按钮点击事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            }
        });
    },

    // 动态添加翻译文本
    addDynamicTranslation(element, key, params = {}) {
        if (!element) return;

        element.setAttribute('data-i18n', key);
        element.textContent = this.t(key, params);
    }
};

// 导出全局对象
window.I18N = I18N;

// 自动初始化（当DOM加载完成后）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18N.init());
} else {
    I18N.init();
}
