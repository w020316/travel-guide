/**
 * 城市数据验证工具
 * 用于验证627个城市数据的完整性和真实性
 * 版本: 2.0.0
 */

const DataValidator = {
    // 验证结果统计
    stats: {
        totalCities: 0,
        validCities: 0,
        invalidCities: 0,
        warnings: [],
        errors: []
    },

    // 真实存在的中国城市列表（用于验证）
    realChineseCities: [
        '北京', '上海', '天津', '重庆',
        '石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定',
        '张家口', '承德', '沧州', '廊坊', '衡水',
        '太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁',
        '呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安盟', '锡林郭勒', '阿拉善',
        '沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛',
        '长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边',
        '哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭',
        '南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁',
        '杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水',
        '合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '宿州', '六安', '亳州', '池州', '宣城',
        '福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德',
        '南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶',
        '济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽',
        '郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店', '济源',
        '武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施',
        '长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西',
        '广州', '韶关', '深圳', '珠海', '汕头', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮',
        '南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左',
        '海口', '三亚', '三沙', '儋州',
        '成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山',
        '贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南',
        '昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '德宏', '怒江', '迪庆',
        '拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里',
        '西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛',
        '兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '甘南', '临夏',
        '西宁', '海东',
        '银川', '石嘴山', '吴忠', '固原', '中卫',
        '乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏柯', '喀什', '和田', '伊犁哈萨克', '塔城地区', '阿勒泰地区', '石河子', '阿拉尔', '图木舒克', '五家渠', '北屯', '铁门关', '双河', '可克达拉', '昆玉', '胡杨河'
    ],

    // 验证单个城市
    validateCity(cityName, cityData) {
        const issues = [];
        const warnings = [];

        // 1. 验证城市名称真实性
        if (!this.isRealCity(cityName)) {
            issues.push(`❌ 城市名称可能不真实: ${cityName}`);
        }

        // 2. 验证必填字段
        if (!cityData.title || cityData.title.trim() === '') {
            issues.push('❌ 缺少标题 (title)');
        } else if (cityData.title.length < 4) {
            warnings.push(`⚠️ 标题过短: "${cityData.title}"`);
        }

        if (!cityData.season) {
            issues.push('❌ 缺少季节信息 (season)');
        } else if (!this.isValidSeason(cityData.season)) {
            warnings.push(`⚠️ 季节格式可能不正确: ${cityData.season}`);
        }

        if (!cityData.days) {
            issues.push('❌ 缺少游玩天数 (days)');
        } else if (!/^\d+(-\d+)?(天|日)$/.test(cityData.days)) {
            warnings.push(`⚠️ 天数格式不正确: ${cityData.days}`);
        }

        // 3. 验证标签
        if (!cityData.tags || !Array.isArray(cityData.tags) || cityData.tags.length === 0) {
            issues.push('❌ 缺少标签或标签为空');
        } else if (cityData.tags.length > 10) {
            warnings.push(`⚠️ 标签数量过多 (${cityData.tags.length}/10)`);
        }

        // 4. 验证路线
        if (!cityData.routes || !Array.isArray(cityData.routes) || cityData.routes.length === 0) {
            warnings.push('⚠️ 没有推荐路线');
        } else if (cityData.routes.some(route => typeof route !== 'string' || route.trim() === '')) {
            issues.push('❌ 路线数据格式错误');
        }

        // 5. 验证美食
        if (!cityData.foods || !Array.isArray(cityData.foods) || cityData.foods.length === 0) {
            warnings.push('⚠️ 没有美食推荐');
        } else {
            const invalidFoods = cityData.foods.filter(food =>
                !food.name || typeof food.name !== 'string' || food.name.trim() === ''
            );
            if (invalidFoods.length > 0) {
                issues.push(`❌ 有${invalidFoods.length}个美食项缺少名称`);
            }
        }

        // 6. 验证海报
        if (!cityData.poster) {
            warnings.push('⚠️ 缺少海报信息');
        } else if (!cityData.poster.style || !cityData.poster.subtitle) {
            issues.push('❌ 海报缺少必要字段 (style/subtitle)');
        }

        return {
            valid: issues.length === 0,
            cityName,
            issues,
            warnings,
            score: Math.max(0, 100 - issues.length * 20 - warnings.length * 5)
        };
    },

    // 检查是否是真实的中国城市
    isRealCity(cityName) {
        // 直接匹配
        if (this.realChineseCities.includes(cityName)) {
            return true;
        }

        // 模糊匹配（县级市、区等）
        for (const realCity of this.realChineseCities) {
            if (cityName.includes(realCity) || realCity.includes(cityName)) {
                return true;
            }
        }

        // 特殊情况：一些知名旅游地（非行政级别城市）
        const specialPlaces = ['凤凰古城', '乌镇', '周庄', '西塘', '同里', '宏村', '西递', '婺源'];
        if (specialPlaces.includes(cityName)) {
            return true;
        }

        return false;
    },

    // 验证季节格式
    isValidSeason(season) {
        const validSeasons = [
            '春季最佳', '夏季最佳', '秋季最佳', '冬季最佳',
            '春秋最佳', '夏秋最佳', '春夏最佳', '秋冬最佳',
            '全年适宜', '夏冬两季', '四季皆宜',
            '1-3月', '4-6月', '7-9月', '10-12月',
            '1-2月', '3-5月', '6-8月', '9-11月', '12-2月'
        ];
        return validSeasons.includes(season);
    },

    // 批量验证所有城市
    validateAllCities(citiesData) {
        console.log('\n🔍 开始验证城市数据...\n');

        this.stats = {
            totalCities: Object.keys(citiesData).length,
            validCities: 0,
            invalidCities: 0,
            warnings: [],
            errors: [],
            scoreDistribution: { excellent: 0, good: 0, average: 0, poor: 0 },
            details: {}
        };

        let totalScore = 0;

        for (const [cityName, cityData] of Object.entries(citiesData)) {
            const result = this.validateCity(cityName, cityData);

            this.stats.details[cityName] = result;

            if (result.valid) {
                this.stats.validCities++;
            } else {
                this.stats.invalidCities++;
                this.stats.errors.push(...result.issues);
            }

            if (result.warnings.length > 0) {
                this.stats.warnings.push({ city: cityName, warnings: result.warnings });
            }

            // 统计分数分布
            if (result.score >= 90) this.stats.scoreDistribution.excellent++;
            else if (result.score >= 70) this.stats.scoreDistribution.good++;
            else if (result.score >= 50) this.stats.scoreDistribution.average++;
            else this.stats.scoreDistribution.poor++;

            totalScore += result.score;
        }

        // 计算平均分
        this.stats.averageScore = Math.round(totalScore / this.stats.totalCities);

        // 输出报告
        this.printReport();

        return this.stats;
    },

    // 打印验证报告
    printReport() {
        console.log('═══════════════════════════════════════════');
        console.log('📊 城市数据验证报告');
        console.log('═══════════════════════════════════════════\n');

        console.log(`📈 总体统计:`);
        console.log(`   总计城市数: ${this.stats.totalCities}`);
        console.log(`   ✅ 有效城市: ${this.stats.validCities} (${(this.stats.validCities/this.stats.totalCities*100).toFixed(1)}%)`);
        console.log(`   ❌ 无效城市: ${this.stats.invalidCities} (${(this.stats.invalidCities/this.stats.totalCities*100).toFixed(1)}%)`);
        console.log(`   ⚠️  警告条数: ${this.stats.warnings.length}`);
        console.log(`   📊 平均分数: ${this.stats.averageScore}/100\n`);

        console.log(`📊 分数分布:`);
        console.log(`   ⭐⭐⭐⭐⭐ 优秀 (90-100): ${this.stats.scoreDistribution.excellent}`);
        console.log(`   ⭐⭐⭐⭐   良好 (70-89):  ${this.stats.scoreDistribution.good}`);
        console.log(`   ⭐⭐⭐     一般 (50-69):  ${this.stats.scoreDistribution.average}`);
        console.log(`   ⭐⭐       较差 (<50):    ${this.stats.scoreDistribution.poor}\n`);

        if (this.stats.errors.length > 0) {
            console.log(`❌ 错误列表 (前10个):`);
            this.stats.errors.slice(0, 10).forEach((error, i) => {
                console.log(`   ${i+1}. ${error}`);
            });
            console.log('');
        }

        if (this.stats.warnings.length > 0 && this.stats.warnings.length <= 20) {
            console.log(`⚠️ 警告详情:`);
            this.stats.warnings.forEach(({ city, warnings }) => {
                console.log(`   📍 ${city}:`);
                warnings.forEach(w => console.log(`      - ${w}`));
            });
        }

        console.log('═══════════════════════════════════════════\n');

        // 返回验证结果对象
        return {
            success: this.stats.invalidCities === 0,
            summary: `验证完成: ${this.stats.validCities}/${this.stats.totalCities} 个城市有效`,
            ...this.stats
        };
    },

    // 导出验证结果为JSON
    exportResults() {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            ...this.stats
        }, null, 2);
    }
};

// 导出到全局
window.DataValidator = DataValidator;

// 如果在浏览器环境，自动验证
if (typeof window !== 'undefined' && typeof EXPANDED_CITIES !== 'undefined') {
    console.log('🔍 自动验证城市数据...');
    DataValidator.validateAllCities(EXPANDED_CITIES);
}
