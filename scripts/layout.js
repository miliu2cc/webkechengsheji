// 检查用户登录状态
const username = localStorage.getItem("loggedInUser");
if (!username) {
    window.location.href = "../index.html";
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";
}

// 侧边导航栏切换功能
function initSidebarNavigation() {
    console.log('初始化侧边导航栏...');
    
    const iframe = document.querySelector('#iframe');
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    
    console.log('找到iframe:', iframe);
    console.log('找到菜单项数量:', menuItems.length);
    
    if (!iframe) {
        console.error('未找到iframe元素');
        return;
    }
    
    if (menuItems.length === 0) {
        console.error('未找到菜单项');
        return;
    }
    
    menuItems.forEach((item, index) => {
        console.log(`菜单项 ${index}:`, item.getAttribute('data-src'));
        
        item.addEventListener('click', function() {
            console.log('点击菜单项:', this.getAttribute('data-src'));
            
            // 移除所有菜单项的active类
            menuItems.forEach(menu => menu.classList.remove('active'));
            
            // 为当前点击的菜单项添加active类
            this.classList.add('active');
            
            // 获取目标页面
            const targetPage = this.getAttribute('data-src');
            
            if (targetPage && iframe) {
                console.log('切换到页面:', targetPage);
                iframe.src = targetPage;
            } else {
                console.error('无法获取目标页面或iframe不存在');
            }
        });
    });
    
    // 设置默认页面
    const activeItem = document.querySelector('.sidebar-menu li.active');
    if (activeItem && iframe) {
        const defaultPage = activeItem.getAttribute('data-src');
        if (defaultPage) {
            console.log('设置默认页面:', defaultPage);
            iframe.src = defaultPage;
        }
    }
}

// 确保DOM加载完成后再初始化
function waitForDOM() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initSidebarNavigation, 100);
        });
    } else {
        setTimeout(initSidebarNavigation, 100);
    }
}

waitForDOM();
  