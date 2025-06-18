// 登录验证脚本
// 用于检查用户登录状态，如果未登录则重定向到登录页面

(function() {
    'use strict';
    
    // 检查用户登录状态
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const currentUser = localStorage.getItem('currentUser');
        
        // 如果没有登录状态或用户信息，重定向到登录页面
        if (!isLoggedIn || isLoggedIn !== 'true' || !currentUser) {    
            window.location.href = '../index.html';
            return false;
        }
        return true;
    }
    
    // 页面加载时立即检查登录状态
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkLoginStatus);
    } else {
        checkLoginStatus();
    }    
})();