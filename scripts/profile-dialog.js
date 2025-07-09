// 个人信息编辑对话框功能

// 显示编辑对话框
function showEditDialog() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    // 创建对话框HTML
    const dialogHTML = `
        <div class="dialog-overlay" id="editDialog">
            <div class="dialog-content">
                <button class="dialog-close" onclick="closeEditDialog()">&times;</button>
                <div class="dialog-header">
                    <h2 class="dialog-title">修改个人信息</h2>
                    <p class="dialog-subtitle">更新您的用户名和邮箱地址</p>
                </div>
                <form class="dialog-form" id="editForm">
                    <div class="dialog-form-group">
                        <label for="editUsername">用户名</label>
                        <input type="text" id="editUsername" name="username" value="${currentUser.username || ''}" required>
                        <div class="dialog-error-message" id="editUsernameError"></div>
                        <div class="dialog-success-message" id="editUsernameSuccess"></div>
                    </div>
                    <div class="dialog-form-group">
                        <label for="editEmail">邮箱地址</label>
                        <input type="email" id="editEmail" name="email" value="${currentUser.email || ''}" required>
                        <div class="dialog-error-message" id="editEmailError"></div>
                        <div class="dialog-success-message" id="editEmailSuccess"></div>
                    </div>
                    <div class="dialog-actions">
                        <button type="button" class="dialog-btn dialog-btn-cancel" onclick="closeEditDialog()">取消</button>
                        <button type="submit" class="dialog-btn dialog-btn-save" id="saveEditBtn">保存修改</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // 添加对话框到页面
    document.body.insertAdjacentHTML('beforeend', dialogHTML);
    
    // 显示对话框
    const dialog = document.getElementById('editDialog');
    setTimeout(() => {
        dialog.classList.add('show');
    }, 10);
    
    // 绑定表单事件
    bindEditFormEvents();
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

// 关闭编辑对话框
function closeEditDialog() {
    const dialog = document.getElementById('editDialog');
    if (dialog) {
        dialog.classList.remove('show');
        setTimeout(() => {
            dialog.remove();
        }, 300);
    }
    
    // 恢复背景滚动
    document.body.style.overflow = '';
}

// 绑定编辑表单事件
function bindEditFormEvents() {
    const editForm = document.getElementById('editForm');
    const usernameInput = document.getElementById('editUsername');
    const emailInput = document.getElementById('editEmail');
    
    // 表单提交事件
    editForm.addEventListener('submit', handleEditFormSubmit);
    
    // 输入验证事件
    usernameInput.addEventListener('input', validateEditUsername);
    emailInput.addEventListener('input', validateEditEmail);
    
    // 点击背景关闭对话框
    document.getElementById('editDialog').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditDialog();
        }
    });
    
    // ESC键关闭对话框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEditDialog();
        }
    });
}

// 处理编辑表单提交
function handleEditFormSubmit(e) {
    e.preventDefault();
    
    // 验证所有字段
    const usernameValid = validateEditUsername();
    const emailValid = validateEditEmail();
    
    if (!usernameValid || !emailValid) {
        return;
    }
    
    const newUsername = document.getElementById('editUsername').value.trim();
    const newEmail = document.getElementById('editEmail').value.trim();
    
    // 更新用户信息
    updateUserInfo(newUsername, newEmail);
}

// 验证用户名
function validateEditUsername() {
    const username = document.getElementById('editUsername').value.trim();
    const errorElement = document.getElementById('editUsernameError');
    const successElement = document.getElementById('editUsernameSuccess');
    const inputElement = document.getElementById('editUsername');
    
    if (!username) {
        showDialogError(inputElement, errorElement, '请输入用户名');
        hideDialogSuccess(successElement);
        return false;
    }
    
    if (username.length < 3 || username.length > 20) {
        showDialogError(inputElement, errorElement, '用户名长度应为3-20个字符');
        hideDialogSuccess(successElement);
        return false;
    }
    
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
        showDialogError(inputElement, errorElement, '用户名只能包含字母、数字、下划线和中文');
        hideDialogSuccess(successElement);
        return false;
    }
    
    hideDialogError(inputElement, errorElement);
    showDialogSuccess(inputElement, successElement, '用户名格式正确');
    return true;
}

// 验证邮箱
function validateEditEmail() {
    const email = document.getElementById('editEmail').value.trim();
    const errorElement = document.getElementById('editEmailError');
    const successElement = document.getElementById('editEmailSuccess');
    const inputElement = document.getElementById('editEmail');
    
    if (!email) {
        showDialogError(inputElement, errorElement, '请输入邮箱地址');
        hideDialogSuccess(successElement);
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showDialogError(inputElement, errorElement, '请输入有效的邮箱地址');
        hideDialogSuccess(successElement);
        return false;
    }
    
    hideDialogError(inputElement, errorElement);
    showDialogSuccess(inputElement, successElement, '邮箱格式正确');
    return true;
}

// 更新用户信息
function updateUserInfo(newUsername, newEmail) {
    const saveBtn = document.getElementById('saveEditBtn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        showDialogErrorMessage('用户信息不存在');
        return;
    }
    
    // 禁用按钮，显示加载状态
    saveBtn.disabled = true;
    saveBtn.textContent = '保存中...';
    
    // 模拟API调用延迟
    setTimeout(() => {
        try {
            const oldEmail = currentUser.email;
            
            // 更新currentUser
            currentUser.username = newUsername;
            currentUser.email = newEmail;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // 如果邮箱发生变化，需要更新以邮箱为key的存储
            if (oldEmail !== newEmail) {
                // 删除旧的邮箱key存储
                if (oldEmail) {
                    localStorage.removeItem(oldEmail);
                }
                
                // 以新邮箱为key存储用户信息
                localStorage.setItem(newEmail, JSON.stringify(currentUser));
            } else {
                // 邮箱未变化，更新现有存储
                localStorage.setItem(newEmail, JSON.stringify(currentUser));
            }
            
            // 更新页面显示
            updateProfileDisplay(currentUser);
            
            // 显示成功消息
            showDialogSuccessMessage('个人信息更新成功！');
            
            // 延迟关闭对话框
            setTimeout(() => {
                closeEditDialog();
            }, 1500);
            
        } catch (error) {
            showDialogErrorMessage('个人信息更新失败，请重试');
        } finally {
            // 恢复按钮状态
            saveBtn.disabled = false;
            saveBtn.textContent = '保存修改';
        }
    }, 1000);
}

// 显示对话框错误
function showDialogError(inputElement, errorElement, message) {
    inputElement.parentElement.classList.add('error');
    inputElement.parentElement.classList.remove('success');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// 隐藏对话框错误
function hideDialogError(inputElement, errorElement) {
    inputElement.parentElement.classList.remove('error');
    errorElement.style.display = 'none';
}

// 显示对话框成功
function showDialogSuccess(inputElement, successElement, message) {
    inputElement.parentElement.classList.add('success');
    inputElement.parentElement.classList.remove('error');
    successElement.textContent = message;
    successElement.style.display = 'block';
}

// 隐藏对话框成功
function hideDialogSuccess(successElement) {
    successElement.style.display = 'none';
}

// 显示对话框成功消息
function showDialogSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// 显示对话框错误消息
function showDialogErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 300);
    }, 3000);
}