// 密码修改对话框功能

// 显示密码修改对话框
function showPasswordDialog() {
    const overlay = document.getElementById('passwordDialogOverlay');
    overlay.classList.add('show');
    
    // 清空表单
    document.getElementById('dialogCurrentPassword').value = '';
    document.getElementById('dialogNewPassword').value = '';
    document.getElementById('dialogConfirmPassword').value = '';
    
    // 清空错误信息
    clearPasswordDialogMessages();
    
    // 重置密码强度显示
    resetPasswordStrength();
}

// 关闭密码修改对话框
function closePasswordDialog() {
    const overlay = document.getElementById('passwordDialogOverlay');
    overlay.classList.remove('show');
}

// 清空对话框中的所有消息
function clearPasswordDialogMessages() {
    const errorMessages = document.querySelectorAll('.password-dialog-error-message');
    const successMessages = document.querySelectorAll('.password-dialog-success-message');
    const formGroups = document.querySelectorAll('.password-dialog-form-group');
    
    errorMessages.forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });
    
    successMessages.forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });
    
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
    });
}

// 重置密码强度显示
function resetPasswordStrength() {
    const strengthBar = document.getElementById('dialogStrengthBar');
    const strengthText = document.getElementById('dialogStrengthText');
    
    strengthBar.style.width = '0%';
    strengthBar.className = 'strength-bar';
    strengthText.textContent = '请输入新密码';
    strengthText.style.color = '#7f8c8d';
}

// 显示错误信息
function showPasswordDialogError(inputElement, errorElement, message) {
    const formGroup = inputElement.closest('.password-dialog-form-group');
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// 显示成功信息
function showPasswordDialogSuccess(inputElement, successElement, message) {
    const formGroup = inputElement.closest('.password-dialog-form-group');
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    successElement.textContent = message;
    successElement.style.display = 'block';
}

// 隐藏消息
function hidePasswordDialogMessage(inputElement, messageElement) {
    const formGroup = inputElement.closest('.password-dialog-form-group');
    formGroup.classList.remove('error', 'success');
    messageElement.style.display = 'none';
    messageElement.textContent = '';
}

// 验证当前密码
function validateDialogCurrentPassword() {
    const currentPassword = document.getElementById('dialogCurrentPassword').value;
    const errorElement = document.getElementById('dialogCurrentPasswordError');
    const inputElement = document.getElementById('dialogCurrentPassword');
    
    if (!currentPassword) {
        showPasswordDialogError(inputElement, errorElement, '请输入当前密码');
        return false;
    }
    
    // 验证当前密码是否正确
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showPasswordDialogError(inputElement, errorElement, '用户信息不存在');
        return false;
    }
    
    const userKey = currentUser.email;
    const userData = JSON.parse(localStorage.getItem(userKey));
    
    if (!userData || userData.password !== currentPassword) {
        showPasswordDialogError(inputElement, errorElement, '当前密码不正确');
        return false;
    }
    
    hidePasswordDialogMessage(inputElement, errorElement);
    return true;
}

// 验证新密码
function validateDialogNewPassword() {
    const newPassword = document.getElementById('dialogNewPassword').value;
    const errorElement = document.getElementById('dialogNewPasswordError');
    const inputElement = document.getElementById('dialogNewPassword');
    
    if (!newPassword) {
        showPasswordDialogError(inputElement, errorElement, '请输入新密码');
        return false;
    }
    
    if (newPassword.length < 6) {
        showPasswordDialogError(inputElement, errorElement, '密码长度至少6位');
        return false;
    }
    
    // 检查密码复杂度
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    if (!hasLetter || !hasNumber) {
        showPasswordDialogError(inputElement, errorElement, '密码必须包含字母和数字');
        return false;
    }
    
    hidePasswordDialogMessage(inputElement, errorElement);
    return true;
}

// 验证确认密码
function validateDialogConfirmPassword() {
    const newPassword = document.getElementById('dialogNewPassword').value;
    const confirmPassword = document.getElementById('dialogConfirmPassword').value;
    const errorElement = document.getElementById('dialogConfirmPasswordError');
    const successElement = document.getElementById('dialogConfirmPasswordSuccess');
    const inputElement = document.getElementById('dialogConfirmPassword');
    
    if (!confirmPassword) {
        showPasswordDialogError(inputElement, errorElement, '请确认新密码');
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        showPasswordDialogError(inputElement, errorElement, '两次输入的密码不一致');
        return false;
    }
    
    hidePasswordDialogMessage(inputElement, errorElement);
    showPasswordDialogSuccess(inputElement, successElement, '密码确认正确');
    return true;
}

// 更新密码强度显示
function updatePasswordStrength() {
    const password = document.getElementById('dialogNewPassword').value;
    const strengthBar = document.getElementById('dialogStrengthBar');
    const strengthText = document.getElementById('dialogStrengthText');
    
    if (!password) {
        resetPasswordStrength();
        return;
    }
    
    let score = 0;
    let feedback = [];
    
    // 长度检查
    if (password.length >= 8) score += 2;
    else if (password.length >= 6) score += 1;
    else feedback.push('至少6位');
    
    // 字符类型检查
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('小写字母');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('大写字母');
    
    if (/\d/.test(password)) score += 1;
    else feedback.push('数字');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('特殊字符');
    
    // 更新强度条
    let width, className, text, color;
    
    if (score <= 2) {
        width = '33%';
        className = 'strength-weak';
        text = '弱';
        color = '#e74c3c';
    } else if (score <= 4) {
        width = '66%';
        className = 'strength-medium';
        text = '中等';
        color = '#f39c12';
    } else {
        width = '100%';
        className = 'strength-strong';
        text = '强';
        color = '#27ae60';
    }
    
    strengthBar.style.width = width;
    strengthBar.className = `strength-bar ${className}`;
    strengthText.textContent = `密码强度: ${text}`;
    strengthText.style.color = color;
    
    if (feedback.length > 0 && score < 3) {
        strengthText.textContent += ` (建议添加: ${feedback.join('、')})`;
    }
}

// 更新密码
function updateUserPassword(newPassword) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            throw new Error('用户信息不存在');
        }
        
        const userKey = currentUser.email;
        const userData = JSON.parse(localStorage.getItem(userKey));
        
        if (!userData) {
            throw new Error('用户数据不存在');
        }
        
        // 更新密码
        userData.password = newPassword;
        userData.lastPasswordChange = new Date().toISOString();
        
        // 保存到localStorage
        localStorage.setItem(userKey, JSON.stringify(userData));
        
        return true;
    } catch (error) {
        console.error('更新密码失败:', error);
        return false;
    }
}

// 处理密码修改表单提交
function handlePasswordDialogSubmit(e) {
    e.preventDefault();
    
    // 验证所有字段
    const currentValid = validateDialogCurrentPassword();
    const newValid = validateDialogNewPassword();
    const confirmValid = validateDialogConfirmPassword();
    
    if (!currentValid || !newValid || !confirmValid) {
        return;
    }
    
    const newPassword = document.getElementById('dialogNewPassword').value;
    
    // 更新密码
    const success = updateUserPassword(newPassword);
    
    if (success) {
        // 显示成功消息
        alert('密码修改成功！');
        closePasswordDialog();
    } else {
        alert('密码修改失败，请重试');
    }
}

// 初始化密码对话框事件
function initPasswordDialog() {
    // 绑定表单提交事件
    const form = document.getElementById('passwordDialogForm');
    if (form) {
        form.addEventListener('submit', handlePasswordDialogSubmit);
    }
    
    // 绑定关闭按钮事件
    const closeBtn = document.getElementById('passwordDialogClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePasswordDialog);
    }
    
    // 绑定取消按钮事件
    const cancelBtn = document.getElementById('passwordDialogCancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePasswordDialog);
    }
    
    // 绑定点击遮罩关闭事件
    const overlay = document.getElementById('passwordDialogOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closePasswordDialog();
            }
        });
    }
    
    // 绑定实时验证事件
    const currentPasswordInput = document.getElementById('dialogCurrentPassword');
    if (currentPasswordInput) {
        currentPasswordInput.addEventListener('blur', validateDialogCurrentPassword);
    }
    
    const newPasswordInput = document.getElementById('dialogNewPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', updatePasswordStrength);
        newPasswordInput.addEventListener('blur', validateDialogNewPassword);
    }
    
    const confirmPasswordInput = document.getElementById('dialogConfirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', validateDialogConfirmPassword);
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordDialog);
} else {
    initPasswordDialog();
}