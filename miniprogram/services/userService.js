const cloud = require('./cloudService.js');
const { COLLECTIONS } = require('../config/database.js');
const { isMember } = require('../utils/member.js');

function localUser() {
  return wx.getStorageSync('currentUser') || null;
}

function saveLocalUser(user) {
  wx.setStorageSync('currentUser', user);
  return user;
}

async function login() {
  try {
    const result = await cloud.callFunction('login');
    const openid = result && result.openid;
    if (!openid) throw new Error('openid missing');
    let users = [];
    try {
      users = await cloud.list(COLLECTIONS.users, { where: { openid }, limit: 1 });
    } catch (err) {
      users = [];
    }
    const user = users[0] || {
      openid,
      nickname: '',
      avatarUrl: '',
      phone: '',
      balance: 0,
      points: 0,
      status: 'normal',
      registerTime: new Date()
    };
    user.isMember = isMember(user);
    return saveLocalUser(user);
  } catch (err) {
    const user = localUser() || {
      _id: 'local-user',
      openid: 'local-openid',
      nickname: '',
      avatarUrl: '',
      phone: '',
      balance: 0,
      points: 0,
      isMember: false,
      status: 'normal',
      registerTime: new Date().toISOString()
    };
    return saveLocalUser(user);
  }
}

async function updateProfile(profile) {
  const current = localUser() || await login();
  const user = {
    ...current,
    nickname: profile.nickName || profile.nickname || current.nickname,
    avatarUrl: profile.avatarUrl || current.avatarUrl,
    isMember: isMember(current)
  };
  saveLocalUser(user);

  if (user._id && user._id !== 'local-user') {
    try {
      await cloud.update(COLLECTIONS.users, user._id, {
        nickname: user.nickname,
        avatarUrl: user.avatarUrl
      });
    } catch (err) {
      console.warn('用户资料云端更新失败', err);
    }
  }
  return user;
}

function syncToGlobal(app, user) {
  if (!app || !user) return;
  app.globalData.userInfo = {
    nickName: user.nickname,
    avatarUrl: user.avatarUrl
  };
  app.globalData.balance = Number(user.balance || 0);
  app.globalData.points = Number(user.points || 0);
  app.globalData.isMember = isMember(user);
}

module.exports = {
  login,
  updateProfile,
  localUser,
  saveLocalUser,
  syncToGlobal
};
