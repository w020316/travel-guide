/**
 * SocialService 单元测试
 *
 * 覆盖范围（仅内存降级模式，Firestore 路径需集成测试）：
 * - 评论 CRUD：addComment / getComments / deleteComment（含权限校验）
 * - 点赞 toggle：toggleLike（添加/取消）+ getUserLikes
 * - 关注 toggle：followUser（添加/取消/自我关注拒绝）+ getFollowers / getFollowing
 * - 浏览统计：recordView / getViewStats
 * - 用户活动时间线：getUserActivityTimeline
 * - 热门内容：getTrendingContent（内存模式返回空数组）
 * - 统计信息：getStats（内存模式返回 counters）
 *
 * 实现说明：
 * - 测试环境默认未配置 FIREBASE_PROJECT_ID，socialService 走内存降级路径
 * - socialService 是单例，状态在测试间共享。每个 describe 内 beforeEach 显式清空
 * - LRU 存储的 delete/clear 方法已在 lruCache.test.js 验证，这里专注业务逻辑
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import socialService from '../services/socialService';

describe('SocialService', () => {
  beforeEach(async () => {
    // 确保内存模式初始化（即便 socialService.initialize 已在 setup 阶段被调用）
    if (!socialService.comments) {
      socialService._initLRUStorage();
    }
    // 清空所有内存存储，避免测试间状态污染
    socialService.comments.clear();
    socialService.likes.clear();
    socialService.follows.clear();
    socialService.views.clear();
    socialService.counters = { comments: 0, likes: 0, follows: 0, views: 0 };
  });

  describe('getStats 内存模式', () => {
    it('未配置 Firebase 时应返回 mode=memory', () => {
      const stats = socialService.getStats();
      expect(stats.mode).toBe('memory');
      expect(stats.initialized).toBe(false);
      expect(stats.counters).toBeDefined();
      expect(stats.counters.comments).toBe(0);
    });
  });

  describe('评论功能', () => {
    it('addComment 应添加评论并返回完整 comment 对象', async () => {
      const result = await socialService.addComment('city-1', 'user-a', '内容测试', null);

      expect(result.success).toBe(true);
      expect(result.comment).toBeDefined();
      expect(result.comment.id).toMatch(/^comment_\d+_/);
      expect(result.comment.cityId).toBe('city-1');
      expect(result.comment.userId).toBe('user-a');
      expect(result.comment.content).toBe('内容测试');
      expect(result.comment.parentId).toBeNull();
      expect(result.comment.createdAt).toBeDefined();
      expect(result.comment.likes).toBe(0);

      // counters 应递增
      expect(socialService.counters.comments).toBe(1);
    });

    it('addComment 带 parentId 时应正常存储（内存模式不更新父评论 replies）', async () => {
      // 先添加父评论
      await socialService.addComment('city-1', 'user-a', '父评论', null);
      const parentId = Array.from(socialService.comments.keys())[0];

      // 添加子评论
      const result = await socialService.addComment('city-1', 'user-b', '子评论', parentId);
      expect(result.success).toBe(true);
      expect(result.comment.parentId).toBe(parentId);
      expect(socialService.counters.comments).toBe(2);
    });

    it('getComments 应返回指定城市的顶级评论（不含回复）', async () => {
      // 添加 3 条 city-1 + 2 条 city-2 + 1 条 city-1 的回复
      await socialService.addComment('city-1', 'u1', 'c1', null);
      await socialService.addComment('city-1', 'u2', 'c2', null);
      await socialService.addComment('city-2', 'u3', 'c3', null);
      const c1Id = Array.from(socialService.comments.values()).find(c => c.content === 'c1').id;
      await socialService.addComment('city-1', 'u4', 'reply-to-c1', c1Id);
      await socialService.addComment('city-2', 'u5', 'c5', null);

      const result = await socialService.getComments('city-1', 1, 20);

      expect(result.success).toBe(true);
      // 仅 city-1 的顶级评论（不含回复）：c1, c2
      expect(result.data).toHaveLength(2);
      expect(result.data.every(c => c.cityId === 'city-1')).toBe(true);
      expect(result.data.every(c => !c.parentId)).toBe(true);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('getComments 应支持分页', async () => {
      // 添加 5 条评论
      for (let i = 0; i < 5; i++) {
        await socialService.addComment('city-x', 'u', `c${i}`, null);
      }

      const page1 = await socialService.getComments('city-x', 1, 2);
      const page2 = await socialService.getComments('city-x', 2, 2);
      const page3 = await socialService.getComments('city-x', 3, 2);

      expect(page1.data).toHaveLength(2);
      expect(page2.data).toHaveLength(2);
      expect(page3.data).toHaveLength(1);
    });

    it('getComments 空城市应返回空数组', async () => {
      const result = await socialService.getComments('nonexistent', 1, 20);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    it('deleteComment 应删除自己的评论', async () => {
      const added = await socialService.addComment('city-1', 'user-a', '内容', null);
      const commentId = added.comment.id;

      const result = await socialService.deleteComment(commentId, 'user-a');

      expect(result.success).toBe(true);
      expect(result.message).toContain('成功');
      expect(socialService.comments.has(commentId)).toBe(false);
      expect(socialService.counters.comments).toBe(0);
    });

    it('deleteComment 删除他人评论应抛「无权删除此评论」', async () => {
      const added = await socialService.addComment('city-1', 'user-a', '内容', null);

      await expect(socialService.deleteComment(added.comment.id, 'user-b'))
        .rejects.toThrow('无权删除此评论');

      // 评论应仍存在
      expect(socialService.comments.has(added.comment.id)).toBe(true);
      expect(socialService.counters.comments).toBe(1);
    });

    it('deleteComment 不存在的评论应抛「评论不存在」', async () => {
      await expect(socialService.deleteComment('nonexistent-id', 'user-a'))
        .rejects.toThrow('评论不存在');
    });
  });

  describe('点赞功能', () => {
    it('toggleLike 首次点赞应返回 liked=true', async () => {
      const result = await socialService.toggleLike('cities', 'city-1', 'user-a');

      expect(result.success).toBe(true);
      expect(result.liked).toBe(true);
      expect(socialService.counters.likes).toBe(1);

      // 验证存储结构
      const likeId = 'cities_city-1_user-a';
      const stored = socialService.likes.get(likeId);
      expect(stored).toBeDefined();
      expect(stored.targetType).toBe('cities');
      expect(stored.targetId).toBe('city-1');
      expect(stored.userId).toBe('user-a');
    });

    it('toggleLike 再次点赞应取消（liked=false）', async () => {
      await socialService.toggleLike('cities', 'city-1', 'user-a');
      const result = await socialService.toggleLike('cities', 'city-1', 'user-a');

      expect(result.success).toBe(true);
      expect(result.liked).toBe(false);
      expect(socialService.counters.likes).toBe(0);
    });

    it('不同用户对同一目标的点赞应独立', async () => {
      await socialService.toggleLike('cities', 'city-1', 'user-a');
      await socialService.toggleLike('cities', 'city-1', 'user-b');

      expect(socialService.counters.likes).toBe(2);

      // user-a 取消，不影响 user-b
      await socialService.toggleLike('cities', 'city-1', 'user-a');
      expect(socialService.counters.likes).toBe(1);
    });

    it('getUserLikes 应返回指定用户的全部点赞', async () => {
      await socialService.toggleLike('cities', 'c1', 'user-a');
      await socialService.toggleLike('comments', 'cm1', 'user-a');
      await socialService.toggleLike('cities', 'c2', 'user-b');

      const result = await socialService.getUserLikes('user-a');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data.every(l => l.userId === 'user-a')).toBe(true);
    });

    it('getUserLikes 带 type 参数应过滤 targetType', async () => {
      await socialService.toggleLike('cities', 'c1', 'user-a');
      await socialService.toggleLike('comments', 'cm1', 'user-a');

      const result = await socialService.getUserLikes('user-a', 'cities');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].targetType).toBe('cities');
    });
  });

  describe('关注功能', () => {
    it('followUser 首次关注应返回 followed=true', async () => {
      const result = await socialService.followUser('user-a', 'user-b');

      expect(result.success).toBe(true);
      expect(result.followed).toBe(true);
      expect(socialService.counters.follows).toBe(1);
    });

    it('followUser 再次关注应取消（followed=false）', async () => {
      await socialService.followUser('user-a', 'user-b');
      const result = await socialService.followUser('user-a', 'user-b');

      expect(result.followed).toBe(false);
      expect(socialService.counters.follows).toBe(0);
    });

    it('followUser 自我关注应抛「不能关注自己」', async () => {
      await expect(socialService.followUser('user-a', 'user-a'))
        .rejects.toThrow('不能关注自己');

      expect(socialService.counters.follows).toBe(0);
    });

    it('getFollowers 应返回关注指定用户的所有粉丝', async () => {
      await socialService.followUser('user-a', 'user-target');
      await socialService.followUser('user-b', 'user-target');
      await socialService.followUser('user-c', 'user-other');

      const result = await socialService.getFollowers('user-target');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(2);
      expect(result.data.every(f => f.followingId === 'user-target')).toBe(true);
    });

    it('getFollowing 应返回指定用户关注的所有人', async () => {
      await socialService.followUser('user-a', 'user-b');
      await socialService.followUser('user-a', 'user-c');
      await socialService.followUser('user-x', 'user-y');

      const result = await socialService.getFollowing('user-a');

      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(2);
      expect(result.data.every(f => f.followerId === 'user-a')).toBe(true);
    });
  });

  describe('浏览统计', () => {
    it('recordView 应记录浏览并递增 counters.views', async () => {
      const result = await socialService.recordView('cities', 'city-1', 'user-a');

      expect(result.success).toBe(true);
      expect(socialService.counters.views).toBe(1);

      // 验证存储
      const views = Array.from(socialService.views.values());
      expect(views).toHaveLength(1);
      expect(views[0].targetType).toBe('cities');
      expect(views[0].targetId).toBe('city-1');
      expect(views[0].userId).toBe('user-a');
      expect(views[0].timestamp).toBeDefined();
    });

    it('recordView 不传 userId 时应允许匿名浏览', async () => {
      const result = await socialService.recordView('cities', 'city-1', null);

      expect(result.success).toBe(true);
      const view = Array.from(socialService.views.values())[0];
      expect(view.userId).toBeNull();
    });

    it('getViewStats 内存模式应返回 counters.views 总数', async () => {
      await socialService.recordView('cities', 'c1', 'u1');
      await socialService.recordView('cities', 'c1', 'u2');
      await socialService.recordView('cities', 'c2', 'u1');

      const result = await socialService.getViewStats('cities', 'c1', '7d');

      expect(result.success).toBe(true);
      expect(result.stats.totalViews).toBe(3); // 内存模式返回全局总数
      expect(result.stats.timeRange).toBe('7d');
      expect(result.stats.periodStart).toBeDefined();
      expect(result.stats.periodEnd).toBeDefined();
    });

    it('getViewStats 应支持 24h/7d/30d 时间范围', async () => {
      for (const range of ['24h', '7d', '30d', 'all']) {
        const result = await socialService.getViewStats('cities', 'c1', range);
        expect(result.success).toBe(true);
        expect(result.stats.timeRange).toBe(range);
      }
    });
  });

  describe('用户活动时间线', () => {
    it('getUserActivityTimeline 应聚合用户的评论和点赞', async () => {
      await socialService.addComment('city-1', 'user-a', 'c1', null);
      await socialService.addComment('city-2', 'user-a', 'c2', null);
      await socialService.toggleLike('cities', 'city-x', 'user-a');
      await socialService.addComment('city-1', 'user-b', 'c3', null); // 其他用户的不应出现

      const result = await socialService.getUserActivityTimeline('user-a', 20);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3); // 2 评论 + 1 点赞
      expect(result.data.every(a => a.userId === 'user-a')).toBe(true);

      // 类型标记
      const types = result.data.map(a => a.type);
      expect(types.filter(t => t === 'comment')).toHaveLength(2);
      expect(types.filter(t => t === 'like')).toHaveLength(1);
    });

    it('getUserActivityTimeline 应按 createdAt 降序排序', async () => {
      const t1 = await socialService.addComment('c1', 'u', 'first', null);
      // 等待 5ms 确保时间戳不同
      await new Promise(r => setTimeout(r, 5));
      const t2 = await socialService.toggleLike('cities', 'x', 'u');
      await new Promise(r => setTimeout(r, 5));
      const t3 = await socialService.addComment('c2', 'u', 'third', null);

      const result = await socialService.getUserActivityTimeline('u', 20);

      // 最新（third）应排在最前
      expect(result.data[0].content).toBe('third');
      expect(result.data[2].content).toBe('first');
    });

    it('getUserActivityTimeline 应尊重 limit 上限', async () => {
      for (let i = 0; i < 10; i++) {
        await socialService.addComment('city', 'u', `c${i}`, null);
      }

      const result = await socialService.getUserActivityTimeline('u', 5);
      expect(result.data).toHaveLength(5);
    });

    it('getUserActivityTimeline 无活动用户应返回空数组', async () => {
      const result = await socialService.getUserActivityTimeline('inactive-user', 20);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('热门内容排行', () => {
    it('getTrendingContent 内存模式应返回空数组（无 viewCount 索引）', async () => {
      const result = await socialService.getTrendingContent('cities', 10);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.type).toBe('cities');
      expect(result.generatedAt).toBeDefined();
    });

    it('getTrendingContent 应支持不同 type 参数', async () => {
      for (const type of ['cities', 'comments', 'guides']) {
        const result = await socialService.getTrendingContent(type, 5);
        expect(result.type).toBe(type);
      }
    });
  });

  describe('v10.9.3 修复 P1-3：中文城市名支持', () => {
    it('addComment 应支持中文 cityId（如「成都」）', async () => {
      const result = await socialService.addComment('成都', 'user-a', '春熙路攻略很实用', null);

      expect(result.success).toBe(true);
      expect(result.comment.cityId).toBe('成都');
      expect(result.comment.content).toBe('春熙路攻略很实用');
    });

    it('getComments 应支持中文 cityId 查询', async () => {
      await socialService.addComment('北京', 'user-a', '故宫必去', null);
      await socialService.addComment('北京', 'user-b', '长城壮观', null);
      await socialService.addComment('上海', 'user-c', '外滩夜景', null);

      const result = await socialService.getComments('北京', 1, 20);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data.every(c => c.cityId === '北京')).toBe(true);
    });

    it('toggleLike 应支持 cities 类型的中文 targetId', async () => {
      // 模拟点赞成都攻略
      const result = await socialService.toggleLike('cities', '成都', 'user-a');

      expect(result.success).toBe(true);
      expect(result.liked).toBe(true);

      // 验证存储
      const stored = socialService.likes.get('cities_成都_user-a');
      expect(stored).toBeDefined();
      expect(stored.targetId).toBe('成都');
    });

    it('recordView 应支持中文城市名 targetId', async () => {
      const result = await socialService.recordView('cities', '杭州', 'user-a');

      expect(result.success).toBe(true);
      const view = Array.from(socialService.views.values()).find(
        v => v.targetId === '杭州'
      );
      expect(view).toBeDefined();
    });

    it('getViewStats 应支持中文城市名查询', async () => {
      await socialService.recordView('cities', '西安', 'u1');
      await socialService.recordView('cities', '西安', 'u2');

      const result = await socialService.getViewStats('cities', '西安', '7d');

      expect(result.success).toBe(true);
      expect(result.stats.totalViews).toBeGreaterThanOrEqual(2);
    });

    it('中文城市名与其他 targetId 应独立存储，不互相干扰', async () => {
      // 同时操作成都和重庆
      await socialService.addComment('成都', 'u1', 'c1', null);
      await socialService.addComment('重庆', 'u1', 'c2', null);
      await socialService.toggleLike('cities', '成都', 'u1');
      await socialService.toggleLike('cities', '重庆', 'u1');

      const chengduComments = await socialService.getComments('成都', 1, 20);
      const chongqingComments = await socialService.getComments('重庆', 1, 20);
      const userLikes = await socialService.getUserLikes('u1');

      expect(chengduComments.data).toHaveLength(1);
      expect(chengduComments.data[0].content).toBe('c1');
      expect(chongqingComments.data).toHaveLength(1);
      expect(chongqingComments.data[0].content).toBe('c2');
      expect(userLikes.data).toHaveLength(2);
    });
  });

  describe('LRU 上限保护（与 v10.8 修复对齐）', () => {
    it('comments LRU 应在超过上限时淘汰最久未访问的条目', async () => {
      // 默认 max=10000，这里只验证 LRU 实例已配置上限
      // 真实的淘汰行为由 lruCache.test.js 验证
      expect(socialService.comments.max).toBe(10000);
      expect(socialService.likes.max).toBe(10000);
      expect(socialService.follows.max).toBe(5000);
      expect(socialService.views.max).toBe(10000);
      // views 带 TTL=1h
      expect(socialService.views.ttl).toBe(60 * 60 * 1000);
    });
  });

  describe('端到端业务流：评论 → 点赞 → 时间线', () => {
    it('完整业务流：用户评论、他人点赞、查询时间线', async () => {
      // user-a 发布评论
      const commentResult = await socialService.addComment('city-1', 'user-a', '好攻略！', null);
      const commentId = commentResult.comment.id;

      // user-b 点赞该评论
      await socialService.toggleLike('comments', commentId, 'user-b');

      // 查询 user-a 时间线（应有 1 条评论）
      const timelineA = await socialService.getUserActivityTimeline('user-a', 20);
      expect(timelineA.data).toHaveLength(1);
      expect(timelineA.data[0].type).toBe('comment');

      // 查询 user-b 时间线（应有 1 条点赞）
      const timelineB = await socialService.getUserActivityTimeline('user-b', 20);
      expect(timelineB.data).toHaveLength(1);
      expect(timelineB.data[0].type).toBe('like');

      // user-b 取消点赞
      await socialService.toggleLike('comments', commentId, 'user-b');
      const timelineB2 = await socialService.getUserActivityTimeline('user-b', 20);
      expect(timelineB2.data).toHaveLength(0);

      // counters 应正确
      expect(socialService.counters.comments).toBe(1);
      expect(socialService.counters.likes).toBe(0);
    });
  });
});
