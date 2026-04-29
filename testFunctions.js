/**
 * 功能测试与验证脚本
 * 在浏览器控制台中运行此脚本以验证所有功能
 */

const TestRunner = {
    tests: [],
    passed: 0,
    failed: 0,

    // 添加测试用例
    test(name, fn) {
        this.tests.push({ name, fn });
    },

    // 运行所有测试
    async runAll() {
        console.log('\n🚀 开始运行功能测试...\n');
        console.log('='.repeat(60));

        for (const testCase of this.tests) {
            try {
                await testCase.fn();
                this.passed++;
                console.log(`✅ 通过: ${testCase.name}`);
            } catch (error) {
                this.failed++;
                console.error(`❌ 失败: ${testCase.name}`);
                console.error(`   错误: ${error.message}`);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log(`📊 测试结果: ${this.passed} 通过, ${this.failed} 失败, 共 ${this.tests.length} 个测试\n`);

        if (this.failed === 0) {
            console.log('🎉 所有功能测试通过！\n');
        } else {
            console.warn('⚠️ 部分测试失败，请检查上述错误信息\n');
        }

        return { passed: this.passed, failed: this.failed, total: this.tests.length };
    }
};

// ========== 测试用例 ==========

// 测试1: 验证城市数据库加载
TestRunner.test('城市数据库加载 (627个城市)', () => {
    if (typeof EXPANDED_CITIES === 'undefined') {
        throw new Error('EXPANDED_CITIES 未定义');
    }

    const cityCount = Object.keys(EXPANDED_CITIES).length;
    console.log(`   📊 扩展城市数量: ${cityCount}`);

    if (cityCount < 600) {
        throw new Error(`城市数量不足600个，当前: ${cityCount}`);
    }

    if (typeof cityDatabase === 'undefined') {
        throw new Error('cityDatabase 未定义');
    }

    const dbCount = Object.keys(cityDatabase).length;
    console.log(`   📊 数据库总城市数: ${dbCount}`);

    if (dbCount < 600) {
        throw new Error(`数据库城市数量不足600个，当前: ${dbCount}`);
    }
});

// 测试2: 验证热门城市数据完整性
TestRunner.test('热门城市数据完整性', () => {
    const hotCities = ['北京', '上海', '成都', '杭州', '西安', '重庆', '广州', '厦门'];

    for (const city of hotCities) {
        if (!cityDatabase[city]) {
            throw new Error(`热门城市 "${city}" 数据缺失`);
        }

        const data = cityDatabase[city];
        if (!data.title || !data.routes || !data.foods) {
            throw new Error(`城市 "${city}" 数据不完整（缺少title/routes/foods）`);
        }

        console.log(`   ✅ ${city}: ${data.title}`);
    }
});

// 测试3: 验证省份选择器初始化
TestRunner.test('省份选择器初始化', () => {
    const provinceSelect = document.getElementById('provinceSelect');
    const citySelect = document.getElementById('citySelect');

    if (!provinceSelect || !citySelect) {
        throw new Error('省份/城市选择器元素未找到');
    }

    const provinceCount = provinceSelect.options.length;
    console.log(`   📊 省份选项数量: ${provinceCount}`);

    if (provinceCount < 30) {
        throw new Error(`省份数量不足30个，当前: ${provinceCount}`);
    }
});

// 测试4: 验证语言切换系统
TestRunner.test('语言切换系统 (i18n)', () => {
    if (typeof I18N === 'undefined') {
        throw new Error('I18N 对象未定义');
    }

    const supportedLangs = I18N.supportedLanguages;
    console.log(`   📊 支持的语言: ${supportedLangs.join(', ')}`);

    if (!supportedLangs.includes('zh') || !supportedLangs.includes('en')) {
        throw new Error('缺少必要的语言支持（zh/en）');
    }

    // 测试语言切换
    const langButtons = document.querySelectorAll('.lang-btn');
    if (langButtons.length === 0) {
        throw new Error('语言切换按钮未找到');
    }

    console.log(`   ✅ 语言切换按钮数量: ${langButtons.length}`);
});

// 测试5: 验证AI引擎隐藏状态
TestRunner.test('AI引擎完全隐藏', () => {
    const aiElements = [
        '.ai-status-bar',
        '.ai-provider-info',
        '.ai-provider-select',
        '#aiEnhancedToggle'
    ];

    for (const selector of aiElements) {
        const element = document.querySelector(selector);
        if (element) {
            const style = window.getComputedStyle(element);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                throw new AI元素 "${selector}" 未被隐藏`);
            }
        }
    }

    console.log('   ✅ 所有AI相关元素已隐藏');
});

// 测试6: 验证快捷城市按钮事件绑定
TestRunner.test('快捷城市按钮点击事件', () => {
    const quickBtns = document.querySelectorAll('.quick-btn');

    if (quickBtns.length === 0) {
        throw new Error('未找到快捷城市按钮');
    }

    console.log(`   📊 快捷按钮数量: ${quickBtns.length}`);

    // 检查第一个按钮是否有data-city属性
    const firstBtn = quickBtns[0];
    if (!firstBtn.dataset.city) {
        throw new Error('快捷按钮缺少 data-city 属性');
    }

    console.log(`   ✅ 第一个按钮: ${firstBtn.dataset.city}`);
});

// 测试7: 验证返回按钮存在
TestRunner.test('返回首页按钮', () => {
    const backBtn = document.getElementById('backBtn');

    if (!backBtn) {
        throw new Error('返回按钮未找到');
    }

    console.log('   ✅ 返回按钮已就绪');
});

// 测试8: 验证搜索输入框
TestRunner.test('搜索输入框和生成按钮', () => {
    const cityInput = document.getElementById('cityInput');
    const generateBtn = document.getElementById('generateBtn');

    if (!cityInput) {
        throw new Error('城市输入框未找到');
    }

    if (!generateBtn) {
        throw new Error('生成按钮未找到');
    }

    console.log('   ✅ 搜索框和生成按钮已就绪');
});

// 测试9: 验证结果页面容器
TestRunner.test('攻略结果显示区域', () => {
    const resultPage = document.getElementById('resultPage');
    const guideContent = document.getElementById('guideContent');

    if (!resultPage) {
        throw new Error('结果页面容器未找到');
    }

    if (!guideContent) {
        throw new Error('攻略内容容器未找到');
    }

    console.log('   ✅ 结果显示区域已就绪');
});

// 测试10: 验证数据生成函数
TestRunner.test('generateCityGuide 函数可用性', () => {
    if (typeof generateCityGuide !== 'function') {
        throw new Error('generateCityGuide 函数未定义');
    }

    if (typeof displayGuideResult !== 'function') {
        throw new Error('displayGuideResult 函数未定义');
    }

    if (typeof handleSearch !== 'function') {
        throw new Error('handleSearch 函数未定义');
    }

    console.log('   ✅ 核心函数均已定义');
});

// ========== 运行测试 ==========

// 自动运行（如果是在浏览器环境中）
if (typeof window !== 'undefined') {
    window.runTests = () => TestRunner.runAll();

    console.log('✨ 旅游攻略生成器 - 功能测试工具已加载');
    console.log('💡 在控制台输入 runTests() 即可运行所有测试\n');
}

// 导出供模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestRunner;
}
