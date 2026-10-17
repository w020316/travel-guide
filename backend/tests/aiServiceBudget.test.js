/**
 * LOG-1：adjustLocalGuide 预算筛选回归测试（v11.4 新增）
 *
 * 背景：原筛选用 parseInt(acc.priceRange)，但真实/模拟数据的 priceRange 多为对象
 * （{lowSeason,peakSeason}）或缺失（{area,pros,cons}）→ NaN → 比较恒 false →
 * 选择 budgetRange=low|high 且走本地降级时 accommodations 被清空、住宿推荐整块消失。
 *
 * 覆盖：{字符串 / 对象 / 缺失} × {low / high / 未选} 三形态兼容 + 空结果兜底。
 * 关键对照：priceRange 缺失选 low/high 时，修复前长度必为 0，修复后应保留全部。
 */
import { describe, it, expect } from 'vitest';
import aiService from '../services/aiService';

function baseGuide(accommodations) {
  return {
    city: '测试城',
    title: '测试城之旅',
    routes: [{ day: 1, theme: 'Day 1', spots: [{ name: '景点A' }] }],
    foods: [],
    accommodations,
    tags: ['测试']
  };
}

const SHAPES = {
  string: [
    { name: '廉价客栈', priceRange: '250元' },
    { name: '豪华酒店', priceRange: '800元' }
  ],
  object: [
    { name: '廉价客栈', priceRange: { lowSeason: '200元', peakSeason: '400元' } },
    { name: '豪华酒店', priceRange: { lowSeason: '600元', peakSeason: '900元' } }
  ],
  // 真实数据形态：无 priceRange 字段
  missing: [
    { name: '市中心住宿', area: '市中心', pros: ['交通便利'], cons: ['较吵'] },
    { name: '景区住宿', area: '景区', pros: ['风景好'], cons: ['偏远'] }
  ]
};

describe('LOG-1：adjustLocalGuide 预算筛选不再恒空', () => {
  for (const [shape, accs] of Object.entries(SHAPES)) {
    for (const budget of ['low', 'high', 'medium']) {
      it(`${shape} × budget=${budget}：accommodations 已定义且非空`, () => {
        const guide = aiService.adjustLocalGuide(
          baseGuide(JSON.parse(JSON.stringify(accs))),
          { budgetRange: budget, days: 1 }
        );
        expect(Array.isArray(guide.accommodations)).toBe(true);
        expect(guide.accommodations.length).toBeGreaterThan(0);
      });
    }
  }

  it('缺失价格 × low/high：修复前长度为 0，修复后保留全部（核心对照）', () => {
    for (const budget of ['low', 'high']) {
      const guide = aiService.adjustLocalGuide(
        baseGuide([{ name: 'A', area: 'x' }, { name: 'B', area: 'y' }]),
        { budgetRange: budget, days: 1 }
      );
      expect(guide.accommodations.length).toBe(2);
    }
  });

  it('对象价格 × low：有价格数据时按预算精确过滤（lowSeason<300）', () => {
    const guide = aiService.adjustLocalGuide(
      baseGuide([
        { name: 'cheap', priceRange: { lowSeason: '200元', peakSeason: '400元' } },
        { name: 'pricey', priceRange: { lowSeason: '600元', peakSeason: '900元' } }
      ]),
      { budgetRange: 'low', days: 1 }
    );
    expect(guide.accommodations.map(a => a.name)).toEqual(['cheap']);
  });

  it('字符串价格 × high：有价格数据时按预算精确过滤（数字前缀>500）', () => {
    const guide = aiService.adjustLocalGuide(
      baseGuide([
        { name: 'cheap', priceRange: '250元' },
        { name: 'pricey', priceRange: '800元' }
      ]),
      { budgetRange: 'high', days: 1 }
    );
    expect(guide.accommodations.map(a => a.name)).toEqual(['pricey']);
  });

  it('未选预算（medium）：不过滤，保留全部', () => {
    const guide = aiService.adjustLocalGuide(
      baseGuide([{ name: 'A', priceRange: '999元' }, { name: 'B' }]),
      { budgetRange: 'medium', days: 1 }
    );
    expect(guide.accommodations.length).toBe(2);
  });
});
