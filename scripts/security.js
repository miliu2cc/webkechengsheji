// 安全设置页面JavaScript

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSecurity();
});

// 初始化安全设置页面
function initializeSecurity() {
    // 检查用户登录状态
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    // 绑定表单事件
    bindFormEvents();
}

// 绑定表单事件
function bindFormEvents() {
    const passwordForm = document.getElementById('passwordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // 表单提交事件
    passwordForm.addEventListener('submit', handlePasswordUpdate);
    
    // 新密码输入事件 - 检查密码强度
    newPasswordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        validateNewPassword();
    });
    
    // 确认密码输入事件
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    
    // 当前密码输入事件
    document.getElementById('currentPassword').addEventListener('input', validateCurrentPassword);
}

// 处理密码更新
function handlePasswordUpdate(e) {
    e.preventDefault();
    
    // 验证所有字段
    const isValid = validateAllFields();
    if (!isValid) {
        return;
    }
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    
    // 模拟密码更新过程
    updatePassword(currentPassword, newPassword);
}

// 验证所有字段
function validateAllFields() {
    const currentValid = validateCurrentPassword();
    const newValid = validateNewPassword();
    const confirmValid = validateConfirmPassword();
    
    return currentValid && newValid && confirmValid;
}

// 验证当前密码
function validateCurrentPassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const errorElement = document.getElementById('currentPasswordError');
    const inputElement = document.getElementById('currentPassword');
    
    if (!currentPassword) {
        showError(inputElement, errorElement, '请输入当前密码');
        return false;
    }
    
    // 验证当前密码是否正确
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.password !== currentPassword) {
        showError(inputElement, errorElement, '当前密码不正确');
        return false;
    }
    
    hideError(inputElement, errorElement);
    return true;
}

// 验证新密码
function validateNewPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const errorElement = document.getElementById('newPasswordError');
    const inputElement = document.getElementById('newPassword');
    
    if (!newPassword) {
        showError(inputElement, errorElement, '请输入新密码');
        return false;
    }
    
    if (newPassword.length < 8) {
        showError(inputElement, errorElement, '密码长度至少8位字符');
        return false;
    }
    
    // 检查密码复杂度
    const hasLower = /[a-z]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    const complexityCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (complexityCount < 3) {
        showError(inputElement, errorElement, '密码应包含大小写字母、数字和特殊字符中的至少3种');
        return false;
    }
    
    // 检查是否与当前密码相同
    const currentPassword = document.getElementById('currentPassword').value;
    if (newPassword === currentPassword) {
        showError(inputElement, errorElement, '新密码不能与当前密码相同');
        return false;
    }
    
    hideError(inputElement, errorElement);
    return true;
}

// 验证确认密码
function validateConfirmPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('confirmPasswordError');
    const successElement = document.getElementById('confirmPasswordSuccess');
    const inputElement = document.getElementById('confirmPassword');
    
    if (!confirmPassword) {
        showError(inputElement, errorElement, '请确认新密码');
        hideSuccess(successElement);
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        showError(inputElement, errorElement, '两次输入的密码不一致');
        hideSuccess(successElement);
        return false;
    }
    
    hideError(inputElement, errorElement);
    showSuccess(inputElement, successElement, '密码确认正确');
    return true;
}

// 检查密码强度
function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'strength-bar';
        strengthText.textContent = '请输入新密码';
        return;
    }
    
    let score = 0;
    let feedback = [];
    
    // 长度检查
    if (password.length >= 8) score += 1;
    else feedback.push('至少8位字符');
    
    // 复杂度检查
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('包含小写字母');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('包含大写字母');
    
    if (/\d/.test(password)) score += 1;
    else feedback.push('包含数字');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('包含特殊字符');
    
    // 更新强度显示
    let strength, width, className;
    
    if (score <= 2) {
        strength = '弱';
        width = '33%';
        className = 'strength-bar strength-weak';
    } else if (score <= 3) {
        strength = '中等';
        width = '66%';
        className = 'strength-bar strength-medium';
    } else {
        strength = '强';
        width = '100%';
        className = 'strength-bar strength-strong';
    }
    
    strengthBar.style.width = width;
    strengthBar.className = className;
    
    if (feedback.length > 0) {
        strengthText.textContent = `密码强度: ${strength} (建议: ${feedback.join('、')})`;
    } else {
        strengthText.textContent = `密码强度: ${strength}`;
    }
}

// 更新密码
function updatePassword(currentPassword, newPassword) {
    const updateBtn = document.getElementById('updateBtn');
    
    // 禁用按钮，显示加载状态
    updateBtn.disabled = true;
    updateBtn.textContent = '更新中...';
    
    // 模拟API调用延迟
    setTimeout(() => {
        try {
            // 获取当前用户信息
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (currentUser) {
                // 更新用户密码
                currentUser.password = newPassword;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // 显示成功消息
                showSuccessMessage('密码更新成功！');
                
                // 清空表单
                document.getElementById('passwordForm').reset();
                
                // 重置密码强度显示
                const strengthBar = document.getElementById('strengthBar');
                const strengthText = document.getElementById('strengthText');
                strengthBar.style.width = '0%';
                strengthBar.className = 'strength-bar';
                strengthText.textContent = '请输入新密码';
                
                // 清除所有错误和成功状态
                clearAllValidationStates();
                
            } else {
                throw new Error('用户信息不存在');
            }
        } catch (error) {
            showErrorMessage('密码更新失败，请重试');
        } finally {
            // 恢复按钮状态
            updateBtn.disabled = false;
            updateBtn.textContent = '更新密码';
        }
    }, 1000);
}

// 显示错误
function showError(inputElement, errorElement, message) {
    inputElement.parentElement.classList.add('error');
    inputElement.parentElement.classList.remove('success');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// 隐藏错误
function hideError(inputElement, errorElement) {
    inputElement.parentElement.classList.remove('error');
    errorElement.style.display = 'none';
}

// 显示成功
function showSuccess(inputElement, successElement, message) {
    inputElement.parentElement.classList.add('success');
    inputElement.parentElement.classList.remove('error');
    successElement.textContent = message;
    successElement.style.display = 'block';
}

// 隐藏成功
function hideSuccess(successElement) {
    successElement.style.display = 'none';
}

// 清除所有验证状态
function clearAllValidationStates() {
    const formGroups = document.querySelectorAll('.form-group');
    const errorMessages = document.querySelectorAll('.error-message');
    const successMessages = document.querySelectorAll('.success-message');
    
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
    });
    
    errorMessages.forEach(msg => {
        msg.style.display = 'none';
    });
    
    successMessages.forEach(msg => {
        msg.style.display = 'none';
    });
}

// 显示成功消息
function showSuccessMessage(message) {
    // 创建成功提示
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
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// 显示错误消息
function showErrorMessage(message) {
    // 创建错误提示
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
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);