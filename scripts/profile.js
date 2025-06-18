

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
});

// 加载用户资料
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        // 更新页面显示
        updateProfileDisplay(currentUser);
    } else {
        // 如果没有用户信息，重定向到登录页面
        window.location.href = '../index.html';
    }
}

// 更新资料显示
function updateProfileDisplay(user) {
    
    // 更新用户名显示
    const displayUsername = document.getElementById('displayUsername');
    if (displayUsername && user.username) {
        displayUsername.textContent = user.username;
    }
    
    // 更新邮箱显示
    const displayEmail = document.getElementById('displayEmail');
    if (displayEmail && user.email) {
        displayEmail.textContent = user.email;
    }
}


// 编辑资料功能（暂时显示提示）
function editProfile() {
    alert('编辑资料功能正在开发中...');
    // 这里可以后续添加编辑资料的模态框或跳转到编辑页面
}

// 监听localStorage变化，实时更新用户信息
window.addEventListener('storage', function(e) {
    if (e.key === 'currentUser') {
        if (e.newValue) {
            const newUser = JSON.parse(e.newValue);
            updateProfileDisplay(newUser);
        } else {
            // 用户信息被清除，重定向到登录页面
            window.location.href = '../index.html';
        }
    }
});
