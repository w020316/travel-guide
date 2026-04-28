const { Firestore } = require('@google-cloud/firestore');

class SocialService {
  constructor() {
    // 使用Firebase Admin SDK初始化Firestore
    this.db = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      if (process.env.FIREBASE_PROJECT_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const admin = require('firebase-admin');
        
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.FIREBASE_PROJECT_ID
          });
        }
        
        this.db = admin.firestore();
        this.initialized = true;
        console.log('Firestore数据库连接成功');
      } else {
        console.warn('Firebase配置不完整，使用内存存储模式');
        this.initializeInMemoryStorage();
      }
    } catch (error) {
      console.error('Firestore初始化失败:', error);
      this.initializeInMemoryStorage();
    }
  }

  initializeInMemoryStorage() {
    // 内存存储回退方案
    this.comments = new Map();
    this.likes = new Map();
    this.follows = new Map();
    this.views = new Map();
    this.counters = { comments: 0, likes: 0, follows: 0, views: 0 };
    this.initialized = false;
  }

  // ==================== 评论功能 ====================

  async addComment(cityId, userId, content, parentId = null) {
    try {
      const commentData = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        cityId,
        userId,
        content,
        parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        replies: []
      };

      if (this.db) {
        // 使用Firestore
        await this.db.collection('comments').doc(commentData.id).set(commentData);
        
        if (parentId) {
          // 添加到父评论的回复列表
          await this.db.collection('comments').doc(parentId).update({
            replies: admin.firestore.FieldValue.arrayUnion(commentData.id)
          });
        }
      } else {
        // 使用内存存储
        this.comments.set(commentData.id, commentData);
        this.counters.comments++;
      }

      return { success: true, comment: commentData };

    } catch (error) {
      console.error('添加评论失败:', error);
      throw error;
    }
  }

  async getComments(cityId, page = 1, limit = 20) {
    try {
      let comments;

      if (this.db) {
        const snapshot = await this.db.collection('comments')
          .where('cityId', '==', cityId)
          .orderBy('createdAt', 'desc')
          .offset((page - 1) * limit)
          .limit(limit)
          .get();

        comments = snapshot.docs.map(doc => doc.data());
      } else {
        comments = Array.from(this.comments.values())
          .filter(c => c.cityId === cityId && !c.parentId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice((page - 1) * limit, page * limit);
      }

      return {
        success: true,
        data: comments,
        page,
        limit,
        total: comments.length
      };

    } catch (error) {
      console.error('获取评论失败:', error);
      throw error;
    }
  }

  async deleteComment(commentId, userId) {
    try {
      if (this.db) {
        const commentRef = this.db.collection('comments').doc(commentId);
        const comment = await commentRef.get();
        
        if (!comment.exists) {
          throw new Error('评论不存在');
        }
        
        if (comment.data().userId !== userId) {
          throw new Error('无权删除此评论');
        }
        
        await commentRef.delete();
      } else {
        const comment = this.comments.get(commentId);
        if (!comment) {
          throw new Error('评论不存在');
        }
        if (comment.userId !== userId) {
          throw new Error('无权删除此评论');
        }
        this.comments.delete(commentId);
        this.counters.comments--;
      }

      return { success: true, message: '评论删除成功' };

    } catch (error) {
      console.error('删除评论失败:', error);
      throw error;
    }
  }

  // ==================== 点赞功能 ====================

  async toggleLike(targetType, targetId, userId) {
    try {
      const likeId = `${targetType}_${targetId}_${userId}`;
      
      if (this.db) {
        const likeRef = this.db.collection('likes').doc(likeId);
        const likeDoc = await likeRef.get();
        
        if (likeDoc.exists) {
          // 取消点赞
          await likeRef.delete();
          
          // 更新目标点赞数
          const targetRef = this.db.collection(targetType).doc(targetId);
          await targetRef.update({
            likes: admin.firestore.FieldValue.increment(-1)
          });
          
          return { success: true, liked: false };
        } else {
          // 添加点赞
          await likeRef.set({
            id: likeId,
            targetType,
            targetId,
            userId,
            createdAt: new Date().toISOString()
          });
          
          // 更新目标点赞数
          const targetRef = this.db.collection(targetType).doc(targetId);
          await targetRef.update({
            likes: admin.firestore.FieldValue.increment(1)
          });
          
          return { success: true, liked: true };
        }
      } else {
        // 内存存储
        if (this.likes.has(likeId)) {
          this.likes.delete(likeId);
          this.counters.likes--;
          return { success: true, liked: false };
        } else {
          this.likes.set(likeId, {
            id: likeId,
            targetType,
            targetId,
            userId,
            createdAt: new Date().toISOString()
          });
          this.counters.likes++;
          return { success: true, liked: true };
        }
      }

    } catch (error) {
      console.error('切换点赞状态失败:', error);
      throw error;
    }
  }

  async getUserLikes(userId, type = null) {
    try {
      let likes;

      if (this.db) {
        let query = this.db.collection('likes').where('userId', '==', userId);
        
        if (type) {
          query = query.where('targetType', '==', type);
        }
        
        const snapshot = await query.get();
        likes = snapshot.docs.map(doc => doc.data());
      } else {
        likes = Array.from(this.likes.values())
          .filter(l => l.userId === userId && (!type || l.targetType === type));
      }

      return { success: true, data: likes };

    } catch (error) {
      console.error('获取用户点赞失败:', error);
      throw error;
    }
  }

  // ==================== 关注功能 ====================

  async followUser(followerId, followingId) {
    try {
      if (followerId === followingId) {
        throw new Error('不能关注自己');
      }

      const followId = `${followerId}_${followingId}`;

      if (this.db) {
        const followRef = this.db.collection('follows').doc(followId);
        const followDoc = await followRef.get();
        
        if (followDoc.exists) {
          // 取消关注
          await followRef.delete();
          return { success: true, followed: false };
        } else {
          // 关注
          await followRef.set({
            id: followId,
            followerId,
            followingId,
            createdAt: new Date().toISOString()
          });
          return { success: true, followed: true };
        }
      } else {
        if (this.follows.has(followId)) {
          this.follows.delete(followId);
          this.counters.follows--;
          return { success: true, followed: false };
        } else {
          this.follows.set(followId, {
            id: followId,
            followerId,
            followingId,
            createdAt: new Date().toISOString()
          });
          this.counters.follows++;
          return { success: true, followed: true };
        }
      }

    } catch (error) {
      console.error('关注操作失败:', error);
      throw error;
    }
  }

  async getFollowers(userId) {
    try {
      let followers;

      if (this.db) {
        const snapshot = await this.db.collection('follows')
          .where('followingId', '==', userId)
          .get();
        followers = snapshot.docs.map(doc => doc.data());
      } else {
        followers = Array.from(this.follows.values())
          .filter(f => f.followingId === userId);
      }

      return { success: true, data: followers, count: followers.length };

    } catch (error) {
      console.error('获取粉丝列表失败:', error);
      throw error;
    }
  }

  async getFollowing(userId) {
    try {
      let following;

      if (this.db) {
        const snapshot = await this.db.collection('follows')
          .where('followerId', '==', userId)
          .get();
        following = snapshot.docs.map(doc => doc.data());
      } else {
        following = Array.from(this.follows.values())
          .filter(f => f.followerId === userId);
      }

      return { success: true, data: following, count: following.length };

    } catch (error) {
      console.error('获取关注列表失败:', error);
      throw error;
    }
  }

  // ==================== 浏览统计 ====================

  async recordView(targetType, targetId, userId = null) {
    try {
      const viewData = {
        id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        targetType,
        targetId,
        userId,
        timestamp: new Date().toISOString(),
        userAgent: '',
        ip: ''
      };

      if (this.db) {
        await this.db.collection('views').add(viewData);
        
        // 更新浏览计数
        const targetRef = this.db.collection(targetType).doc(targetId);
        await targetRef.update({
          viewCount: admin.firestore.FieldValue.increment(1),
          lastViewedAt: new Date().toISOString()
        });
      } else {
        this.views.set(viewData.id, viewData);
        this.counters.views++;
      }

      return { success: true };

    } catch (error) {
      console.error('记录浏览失败:', error);
      throw error;
    }
  }

  async getViewStats(targetType, targetId, timeRange = '7d') {
    try {
      let stats;

      if (this.db) {
        const now = new Date();
        let startTime;
        
        switch (timeRange) {
          case '24h':
            startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startTime = new Date(0);
        }

        const snapshot = await this.db.collection('views')
          .where('targetType', '==', targetType)
          .where('targetId', '==', targetId)
          .where('timestamp', '>=', startTime.toISOString())
          .get();

        stats = {
          totalViews: snapshot.size,
          timeRange,
          periodStart: startTime.toISOString(),
          periodEnd: now.toISOString()
        };
      } else {
        stats = {
          totalViews: this.counters.views,
          timeRange,
          periodStart: new Date(0).toISOString(),
          periodEnd: new Date().toISOString()
        };
      }

      return { success: true, stats };

    } catch (error) {
      console.error('获取浏览统计失败:', error);
      throw error;
    }
  }

  // ==================== 用户活动时间线 ====================

  async getUserActivityTimeline(userId, limit = 20) {
    try {
      let activities = [];

      if (this.db) {
        // 获取用户的评论
        const commentsSnapshot = await this.db.collection('comments')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(limit)
          .get();
        
        commentsSnapshot.forEach(doc => {
          activities.push({ ...doc.data(), type: 'comment' });
        });

        // 获取用户的点赞
        const likesSnapshot = await this.db.collection('likes')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(limit)
          .get();
        
        likesSnapshot.forEach(doc => {
          activities.push({ ...doc.data(), type: 'like' });
        });

        // 按时间排序
        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        activities = activities.slice(0, limit);

      } else {
        // 内存存储
        const userComments = Array.from(this.comments.values())
          .filter(c => c.userId === userId)
          .map(c => ({ ...c, type: 'comment' }));
        
        const userLikes = Array.from(this.likes.values())
          .filter(l => l.userId === userId)
          .map(l => ({ ...l, type: 'like' }));

        activities = [...userComments, ...userLikes]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit);
      }

      return { success: true, data: activities };

    } catch (error) {
      console.error('获取用户活动失败:', error);
      throw error;
    }
  }

  // ==================== 热门内容排行 ====================

  async getTrendingContent(type = 'cities', limit = 10) {
    try {
      let trending;

      if (this.db) {
        const snapshot = await this.db.collection(type)
          .orderBy('viewCount', 'desc')
          .limit(limit)
          .get();
        
        trending = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } else {
        trending = [];
      }

      return { 
        success: true, 
        data: trending,
        type,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('获取热门内容失败:', error);
      throw error;
    }
  }

  // ==================== 统计信息 ====================

  getStats() {
    if (this.initialized) {
      return { mode: 'firebase', initialized: true };
    } else {
      return {
        mode: 'memory',
        initialized: false,
        counters: this.counters
      };
    }
  }
}

module.exports = new SocialService();