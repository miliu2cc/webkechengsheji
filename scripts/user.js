// 加载当前用户信息
function loadCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const currentUserEmail = document.getElementById('currentUserEmail');
    const userInitial = document.getElementById('userInitial');
    
    if (currentUser && currentUser.email) {
      const username = currentUser.username || currentUser.email.split('@')[0];
      welcomeMessage.textContent = `欢迎回来，${username}！`;
    }
  }

  // 退出登录按钮事件
  document.getElementById('logoutBtn').addEventListener('click',function() {
    if (confirm('确定要退出登录吗？')) {
      // 清除当前用户信息
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loggedInUser');
      
      // 显示退出成功消息
      alert('已成功退出登录！');
      
      // 跳转到登录页面
      window.top.location.href = '../index.html';
    }
  });
  
  // 页面加载时执行
  document.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
  });
  