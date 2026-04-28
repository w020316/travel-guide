// ==========================================
// API客户端 - 后端服务通信层
// 支持本地模式和后端模式自动切换
// ==========================================

const APIClient = {
    baseURL: 'http://localhost:3001/api',
    token: null,
    user: null,
    mode: 'auto', // auto, local, backend
    
    // 初始化
    init() {
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('user_data') || 'null');
        
        // 检测运行环境
        if (this.mode === 'auto') {
            this.detectMode();
        }
        
        // 设置请求拦截器
        this.setupInterceptors();
    },
    
    // 检测运行模式
    detectMode() {
        const isGitHubPages = window.location.hostname.includes('github.io');
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
        
        if (isGitHubPages) {
            this.mode = 'local';
            console.log('检测到GitHub Pages环境，使用本地模式');
        } else if (isLocalhost) {
            this.mode = 'backend';
            console.log('检测到本地开发环境，使用后端模式');
        } else {
            this.mode = 'local';
            console.log('使用本地模式');
        }
    },
    
    // 设置拦截器
    setupInterceptors() {
        // 可以在这里添加全局请求/响应处理
    },
    
    // 通用请求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // 添加认证token
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error(`API请求失败 [${endpoint}]:`, error);
            
            // 如果是网络错误或后端不可用，回退到本地模式
            if (this.mode === 'backend' && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
                console.warn('后端服务不可用，切换到本地模式');
                this.mode = 'local';
                throw new Error('BACKEND_UNAVAILABLE');
            }
            
            throw error;
        }
    },
    
    // ==================== AI攻略生成 ====================
    
    async generateGuide(city, preferences = {}) {
        if (this.mode === 'local') {
            return this.generateLocalGuide(city, preferences);
        }
        
        try {
            const result = await this.request('/ai/generate', {
                method: 'POST',
                body: JSON.stringify({ city, preferences })
            });
            
            return result.data;
        } catch (error) {
            if (error.message === 'BACKEND_UNAVAILABLE') {
                return this.generateLocalGuide(city, preferences);
            }
            throw error;
        }
    },
    
    generateLocalGuide(city, preferences) {
        // 使用前端内置的AI生成逻辑（从app_backup.js中的EMBEDDED_CITIES）
        if (typeof EMBEDDED_CITIES !== 'undefined' && EMBEDDED_CITIES[city]) {
            let cityData = JSON.parse(JSON.stringify(EMBEDDED_CITIES[city]));
            
            // 根据偏好调整数据
            if (preferences.days) {
                cityData.routes = cityData.routes.slice(0, preferences.days);
            }
            
            cityData.generatedAt = new Date().toISOString();
            cityData.source = 'local';
            
            return cityData;
        }
        
        // 生成模拟数据
        return this.generateMockGuide(city, preferences);
    },
    
    generateMockGuide(city, preferences) {
        const days = preferences.days || 3;
        return {
            city,
            title: `${city}·发现之旅`,
            season: '四季皆宜',
            days,
            routes: Array.from({ length: days }, (_, i) => ({
                day: i + 1,
                title: `第${i + 1}天：${city}精华游`,
                spots: [
                    { name: `${city}地标景点`, reason: '城市标志性建筑', duration: '2-3小时', ticket: '免费', tips: '' },
                    { name: '历史文化街区', reason: '感受当地文化', duration: '1-2小时', ticket: '免费', tips: '' }
                ]
            })),
            foods: [
                { name: `${city}特色菜`, description: '当地招牌美食', price: '38-68元', mustTry: true, location: '市中心' }
            ],
            accommodations: [
                { name: `${city}快捷酒店`, area: '市中心', priceRange: '200-400元', features: ['交通便利'] }
            ],
            source: 'mock'
        };
    },
    
    // ==================== 用户认证 ====================
    
    async login(idToken) {
        try {
            const result = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ idToken })
            });
            
            if (result.success) {
                this.token = result.token;
                this.user = result.user;
                
                localStorage.setItem('auth_token', result.token);
                localStorage.setItem('user_data', JSON.stringify(result.user));
                
                return result;
            }
            
            throw new Error(result.error || '登录失败');
        } catch (error) {
            console.error('登录失败:', error);
            throw error;
        }
    },
    
    async getProfile() {
        try {
            const result = await this.request('/auth/me');
            return result.user;
        } catch (error) {
            console.error('获取用户信息失败:', error);
            throw error;
        }
    },
    
    async updateProfile(updates) {
        try {
            const result = await this.request('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(updates)
            });
            return result;
        } catch (error) {
            console.error('更新资料失败:', error);
            throw error;
        }
    },
    
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    },
    
    isLoggedIn() {
        return !!this.token && !!this.user;
    },
    
    // ==================== 社交功能 ====================
    
    async addComment(cityId, content, parentId = null) {
        if (!this.isLoggedIn()) {
            throw new Error('请先登录');
        }
        
        return this.request('/comments', {
            method: 'POST',
            body: JSON.stringify({ cityId, content, parentId })
        });
    },
    
    async getComments(cityId, page = 1, limit = 20) {
        return this.request(`/comments/${cityId}?page=${page}&limit=${limit}`);
    },
    
    async deleteComment(commentId) {
        return this.request(`/comments/${commentId}`, { method: 'DELETE' });
    },
    
    async toggleLike(type, targetId) {
        if (!this.isLoggedIn()) {
            throw new Error('请先登录');
        }
        
        return this.request(`/likes/${type}/${targetId}`, { method: 'POST' });
    },
    
    async getUserLikes(type = null) {
        const params = type ? `?type=${type}` : '';
        return this.request(`/likes/user${params}`);
    },
    
    async followUser(userId) {
        return this.request(`/follow/${userId}`, { method: 'POST' });
    },
    
    async getFollowers() {
        return this.request('/followers');
    },
    
    async getFollowing() {
        return this.request('/following');
    },
    
    async recordView(type, targetId) {
        return this.request(`/views/${type}/${targetId}`, { method: 'POST' });
    },
    
    async getViewStats(type, targetId, range = '7d') {
        return this.request(`/stats/views/${type}/${targetId}?range=${range}`);
    },
    
    async getActivityTimeline(limit = 20) {
        return this.request(`/activity/timeline?limit=${limit}`);
    },
    
    async getTrendingContent(type = 'cities', limit = 10) {
        return this.request(`/trending/social?type=${type}&limit=${limit}`);
    },
    
    // ==================== 城市数据 ====================
    
    async getCities(page = 1, limit = 50) {
        if (this.mode === 'local') {
            return this.getLocalCities(page, limit);
        }
        
        try {
            return this.request(`/cities?page=${page}&limit=${limit}`);
        } catch (error) {
            if (error.message === 'BACKEND_UNAVAILABLE') {
                return this.getLocalCities(page, limit);
            }
            throw error;
        }
    },
    
    getLocalCities(page, limit) {
        const cities = typeof EMBEDDED_CITIES !== 'undefined' ? Object.keys(EMBEDDED_CITIES) : [];
        const start = (page - 1) * limit;
        const end = start + limit;
        
        return {
            total: cities.length,
            page,
            limit,
            data: cities.slice(start, end).map(name => ({
                name,
                tags: EMBEDDED_CITIES[name]?.tags || []
            }))
        };
    },
    
    async searchCities(keyword) {
        if (this.mode === 'local') {
            return this.searchLocalCities(keyword);
        }
        
        try {
            return this.request(`/cities/search?keyword=${encodeURIComponent(keyword)}`);
        } catch (error) {
            if (error.message === 'BACKEND_UNAVAILABLE') {
                return this.searchLocalCities(keyword);
            }
            throw error;
        }
    },
    
    searchLocalCities(keyword) {
        const cities = typeof EMBEDDED_CITIES !== 'undefined' ? EMBEDDED_CITIES : {};
        const results = [];
        
        for (const [name, data] of Object.entries(cities)) {
            if (name.includes(keyword) || 
                (data.tags && data.tags.some(tag => tag.includes(keyword)))) {
                results.push({ name, ...data });
            }
        }
        
        return results.slice(0, 20);
    },
    
    async getCityDetail(cityName) {
        if (this.mode === 'local') {
            return EMBEDDED_CITIES?.[cityName] || null;
        }
        
        try {
            const result = await this.request(`/cities/${encodeURIComponent(cityName)}`);
            return result;
        } catch (error) {
            if (error.message === 'BACKEND_UNAVAILABLE') {
                return EMBEDDED_CITIES?.[cityName] || null;
            }
            throw error;
        }
    },
    
    // ==================== 天气数据 ====================
    
    async getWeather(city) {
        if (this.mode === 'local') {
            return this.generateMockWeather(city);
        }
        
        try {
            return this.request(`/weather/${encodeURIComponent(city)}`);
        } catch (error) {
            return this.generateMockWeather(city);
        }
    },
    
    generateMockWeather(city) {
        const month = new Date().getMonth() + 1;
        const weatherTemplates = {
            winter: { temp: '-5~5°C', condition: '晴', humidity: '45%', wind: '北风3级' },
            spring: { temp: '12~22°C', condition: '多云', humidity: '60%', wind: '南风2级' },
            summer: { temp: '25~35°C', condition: '晴转多云', humidity: '75%', wind: '南风3级' },
            autumn: { temp: '15~25°C', condition: '晴', humidity: '55%', wind: '北风2级' }
        };
        
        let season = 'spring';
        if ([12, 1, 2].includes(month)) season = 'winter';
        else if ([6, 7, 8].includes(month)) season = 'summer';
        else if ([9, 10, 11].includes(month)) season = 'autumn';
        
        return {
            success: true,
            city,
            weather: weatherTemplates[season],
            source: 'local-mock'
        };
    },
    
    // ==================== 统计数据 ====================
    
    async getTrendingCities() {
        if (this.mode === 'local') {
            return this.getTrendingLocal();
        }
        
        try {
            return this.request('/trending');
        } catch (error) {
            return this.getTrendingLocal();
        }
    },
    
    getTrendingLocal() {
        const stats = loadStatsFromStorage();
        const sortedCities = Object.entries(stats.citySearches || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }));
        
        return { success: true, data: sortedCities, generatedAt: new Date().toISOString() };
    },
    
    // ==================== 健康检查 ====================
    
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
            return await response.json();
        } catch (error) {
            return { status: 'unavailable', error: error.message };
        }
    },
    
    // ==================== 工具方法 ====================
    
    setBackendURL(url) {
        this.baseURL = url;
    },
    
    setMode(mode) {
        this.mode = mode;
        console.log(`API模式设置为: ${mode}`);
    },
    
    getToken() {
        return this.token;
    },
    
    getUser() {
        return this.user;
    }
};

// 初始化APIClient
if (typeof window !== 'undefined') {
    APIClient.init();
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}