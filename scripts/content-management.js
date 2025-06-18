// 用户数据管理系统 JavaScript

// 全局变量
let userData = JSON.parse(localStorage.getItem('userData')) || [];
let nextId = userData.length > 0 ? Math.max(...userData.map(u => u.id)) + 1 : 1;
let currentEditId = null;
let filteredData = [];

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
  //加载默认CSV数据
  if (userData.length === 0) {
    loadSampleCsvData();
  } else {
    displayDataTable();
    updateStats();
  }
  initEventListeners();
});

// 加载默认CSV数据
function loadSampleCsvData() {
  fetch('https://raw.githubusercontent.com/miliu2cc/webkechengsheji/refs/heads/main/data/sample.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error('无法加载示例数据');
      }
      return response.text();
    })
    .then(csvText => {
      const parsedData = parseCsvToUserData(csvText);
      userData = parsedData;
      nextId = userData.length > 0 ? Math.max(...userData.map(u => u.id)) + 1 : 1;
      saveData();
      displayDataTable();
      updateStats();
      showNotification('已加载示例数据！', 'success');
    })
    .catch(error => {
      console.error('加载示例数据失败:', error);
      displayDataTable();
      updateStats();
    });
}

// 将CSV数据转换为用户数据格式
function parseCsvToUserData(csvText) {
  const lines = csvText.trim().split('\n');
  const data = [];
  
  // CSV格式：id,name,age,gender,category,score1,score2,score3,timestamp
  for (let i = 0; i < lines.length; i++) {
    const values = lines[i].split(',');
    
    // 确保有足够的字段
    if (values.length >= 9) {
      const userData = {
        id: parseInt(values[0]) || 0,
        name: values[1] || '',
        age: parseInt(values[2]) || 0,
        gender: values[3] || '',
        category: values[4] || '',
        score1: parseInt(values[5]) || 0,
        score2: parseInt(values[6]) || 0,
        score3: parseInt(values[7]) || 0,
        timestamp: values[8] || ''
      };
      
      data.push(userData);
    }
  }
  
  return data;
}

// 初始化事件监听器
function initEventListeners() {
  // 表单提交
  document.getElementById('userInfoForm').addEventListener('submit', handleFormSubmit);
  
  // 重置表单
  document.getElementById('resetBtn').addEventListener('click', resetForm);
  
  // 加载CSV文件
  document.getElementById('loadCsvBtn').addEventListener('click', () => {
    document.getElementById('csvFileInput').click();
  });
  
  document.getElementById('csvFileInput').addEventListener('change', handleCsvLoad);
  
  // 导出CSV
  document.getElementById('exportCsvBtn').addEventListener('click', exportToCsv);
  
  // 排序功能
  document.getElementById('sortByName').addEventListener('click', () => sortData('name'));
  document.getElementById('sortByAge').addEventListener('click', () => sortData('age'));
  document.getElementById('sortByCategory').addEventListener('click', () => sortData('category'));
  
  // 搜索功能
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  
  // 清空所有数据
  document.getElementById('clearAllBtn').addEventListener('click', clearAllData);
  
  // 编辑模态框
  document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
  document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);
  document.querySelector('.close').addEventListener('click', closeEditModal);
  
  // 点击模态框外部关闭
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
      closeEditModal();
    }
  });
}

// 表单提交处理
function handleFormSubmit(e) {
  e.preventDefault();
  
  // 清除之前的错误信息
  clearErrors();
  
  const formData = {
    id: nextId++,
    name: document.getElementById('userName').value.trim(),
    age: parseInt(document.getElementById('userAge').value),
    gender: document.getElementById('userGender').value,
    category: document.getElementById('userCategory').value,
    score1: parseInt(document.getElementById('userScore1').value) || 0,
    score2: parseInt(document.getElementById('userScore2').value) || 0,
    score3: parseInt(document.getElementById('userScore3').value) || 0,
    timestamp: new Date().toISOString().split('T')[0]
  };
  
  // 数据验证
  if (!validateFormData(formData)) {
    return;
  }
  
  // 检查姓名是否已存在
  if (userData.some(user => user.name === formData.name)) {
    showError('nameError', '该姓名已存在！');
    return;
  }
  
  // 保存数据
  userData.push(formData);
  saveData();
  
  // 显示成功消息
  showNotification('用户信息添加成功！', 'success');
  
  // 重置表单
  resetForm();
  
  // 更新显示
  displayDataTable();
  updateStats();
}

// 数据验证
function validateFormData(data) {
  let isValid = true;
  
  // 姓名验证
  if (!data.name || data.name.length < 2) {
    showError('nameError', '姓名至少需要2个字符');
    isValid = false;
  }
  
  // 年龄验证
  if (!data.age || data.age < 1 || data.age > 120) {
    showError('ageError', '年龄必须在1-120之间');
    isValid = false;
  }
  
  // 性别验证
  if (!data.gender) {
    showError('genderError', '请选择性别');
    isValid = false;
  }
  
  // 专业领域验证
  if (!data.category) {
    showError('categoryError', '请选择专业领域');
    isValid = false;
  }
  
  // 分数验证（可选）
  if (data.score1 && (data.score1 < 0 || data.score1 > 100)) {
    showError('score1Error', '分数必须在0-100之间');
    isValid = false;
  }
  if (data.score2 && (data.score2 < 0 || data.score2 > 100)) {
    showError('score2Error', '分数必须在0-100之间');
    isValid = false;
  }
  if (data.score3 && (data.score3 < 0 || data.score3 > 100)) {
    showError('score3Error', '分数必须在0-100之间');
    isValid = false;
  }
  
  return isValid;
}

// 显示错误信息
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  const inputElement = errorElement.previousElementSibling;
  
  errorElement.textContent = message;
  inputElement.parentElement.classList.add('error');
}

// 清除错误信息
function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  const formGroups = document.querySelectorAll('.form-group');
  
  errorElements.forEach(el => el.textContent = '');
  formGroups.forEach(group => group.classList.remove('error'));
}

// 重置表单
function resetForm() {
  document.getElementById('userInfoForm').reset();
  clearErrors();
}

// 显示数据表格
function displayDataTable() {
  const tableBody = document.getElementById('tableBody');
  const noDataMessage = document.getElementById('noDataMessage');
  
  // 使用过滤后的数据或全部数据
  const dataToShow = userData;
  
  if (dataToShow.length === 0) {
    tableBody.innerHTML = '';
    noDataMessage.style.display = 'block';
    return;
  }
  
  noDataMessage.style.display = 'none';
  tableBody.innerHTML = '';
  
  dataToShow.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.age}</td>
      <td>${user.gender === 'M' ? '男' : user.gender === 'F' ? '女' : user.gender}</td>
      <td>${user.category}</td>
      <td>${user.score1 || 0}</td>
      <td>${user.score2 || 0}</td>
      <td>${user.score3 || 0}</td>
      <td>${user.timestamp}</td>
      <td class="action-buttons">
        <button class="btn btn-warning" onclick="editUser(${user.id})">编辑</button>
        <button class="btn btn-danger" onclick="deleteUser(${user.id})">删除</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// 编辑用户
function editUser(id) {
  const user = userData.find(u => u.id === id);
  if (!user) return;
  
  currentEditId = id;
  
  // 填充编辑表单
  document.getElementById('editName').value = user.name;
  document.getElementById('editAge').value = user.age;
  document.getElementById('editGender').value = user.gender;
  document.getElementById('editCategory').value = user.category;
  document.getElementById('editScore1').value = user.score1 || 0;
  document.getElementById('editScore2').value = user.score2 || 0;
  document.getElementById('editScore3').value = user.score3 || 0;
  
  // 显示模态框
  document.getElementById('editModal').style.display = 'block';
}

// 处理编辑提交
function handleEditSubmit(e) {
  e.preventDefault();
  
  const updatedData = {
    name: document.getElementById('editName').value.trim(),
    age: parseInt(document.getElementById('editAge').value),
    gender: document.getElementById('editGender').value,
    category: document.getElementById('editCategory').value,
    score1: parseInt(document.getElementById('editScore1').value) || 0,
    score2: parseInt(document.getElementById('editScore2').value) || 0,
    score3: parseInt(document.getElementById('editScore3').value) || 0
  };
  
  // 验证数据
  if (!validateEditData(updatedData)) {
    return;
  }
  
  // 检查姓名是否被其他用户使用
  const existingUser = userData.find(user => user.name === updatedData.name && user.id !== currentEditId);
  if (existingUser) {
    alert('该姓名已被其他用户使用！');
    return;
  }
  
  // 更新用户数据
  const userIndex = userData.findIndex(u => u.id === currentEditId);
  if (userIndex !== -1) {
    userData[userIndex] = { ...userData[userIndex], ...updatedData };
    saveData();
    
    showNotification('用户信息更新成功！', 'success');
    closeEditModal();
    displayDataTable();
    updateStats();
  }
}

// 验证编辑数据
function validateEditData(data) {
  if (!data.name || data.name.length < 2) {
    alert('姓名至少需要2个字符');
    return false;
  }
  
  if (!data.age || data.age < 1 || data.age > 120) {
    alert('年龄必须在1-120之间');
    return false;
  }
  
  if (!data.gender) {
    alert('请选择性别');
    return false;
  }
  
  if (!data.category) {
    alert('请选择专业领域');
    return false;
  }
  
  if (data.score1 && (data.score1 < 0 || data.score1 > 100)) {
    alert('课程1分数必须在0-100之间');
    return false;
  }
  
  if (data.score2 && (data.score2 < 0 || data.score2 > 100)) {
    alert('课程2分数必须在0-100之间');
    return false;
  }
  
  if (data.score3 && (data.score3 < 0 || data.score3 > 100)) {
    alert('课程3分数必须在0-100之间');
    return false;
  }
  
  return true;
}

// 关闭编辑模态框
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  currentEditId = null;
}

// 删除用户
function deleteUser(id) {
  if (confirm('确定要删除这个用户吗？')) {
    userData = userData.filter(u => u.id !== id);
    saveData();
    
    showNotification('用户删除成功！', 'success');
    displayDataTable();
    updateStats();
  }
}

// 排序数据
function sortData(field) {
  const dataToSort = filteredData.length > 0 ? filteredData : userData;
  
  dataToSort.sort((a, b) => {
    if (field === 'age') {
      return a[field] - b[field];
    } else {
      return a[field].localeCompare(b[field]);
    }
  });
  
  displayDataTable();
}

// 搜索功能
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    filteredData = [];
  } else {
    filteredData = userData.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.category.toLowerCase().includes(searchTerm) ||
      user.age.toString().includes(searchTerm)
    );
  }
  
  displayDataTable();
}

// 清空所有数据
function clearAllData() {
  if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
    userData = [];
    filteredData = [];
    nextId = 1;
    saveData();
    
    showNotification('所有数据已清空！', 'warning');
    displayDataTable();
    updateStats();
  }
}

// 处理CSV文件加载
function handleCsvLoad(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const csv = event.target.result;
      const lines = csv.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        showNotification('CSV文件格式不正确！', 'error');
        return;
      }
      
      // 解析CSV数据
      const headers = lines[0].split(',').map(h => h.trim());
      const expectedHeaders = ['姓名', '年龄', '邮箱', '兴趣领域'];
      
      // 检查表头
      const hasValidHeaders = expectedHeaders.every(header => 
        headers.some(h => h.includes(header))
      );
      
      if (!hasValidHeaders) {
        showNotification('CSV文件表头不正确！应包含：姓名、年龄、邮箱、兴趣领域', 'error');
        return;
      }
      
      // 解析数据行
      const newUsers = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 4) {
          const user = {
            id: nextId++,
            name: values[0],
            age: parseInt(values[1]),
            email: values[2],
            category: values[3],
            timestamp: new Date().toISOString().split('T')[0]
          };
          
          // 验证数据
          if (user.name && user.age && user.email && user.category) {
            // 检查邮箱是否已存在
            if (!userData.some(u => u.email === user.email) && 
                !newUsers.some(u => u.email === user.email)) {
              newUsers.push(user);
            }
          }
        }
      }
      
      if (newUsers.length > 0) {
        userData.push(...newUsers);
        saveData();
        
        showNotification(`成功导入 ${newUsers.length} 条用户数据！`, 'success');
        displayDataTable();
        updateStats();
      } else {
        showNotification('没有有效的数据可以导入！', 'warning');
      }
      
    } catch (error) {
      showNotification('CSV文件解析失败！', 'error');
    }
  };
  
  reader.readAsText(file, 'UTF-8');
  e.target.value = ''; // 清空文件输入
}

// 导出为CSV
function exportToCsv() {
  if (userData.length === 0) {
    showNotification('没有数据可以导出！', 'warning');
    return;
  }
  
  // 创建CSV内容
  const headers = ['ID', '姓名', '年龄', '邮箱', '兴趣领域', '提交时间'];
  const csvContent = [headers.join(',')];
  
  userData.forEach(user => {
    const row = [
      user.id,
      user.name,
      user.age,
      user.email,
      user.category,
      user.timestamp
    ];
    csvContent.push(row.join(','));
  });
  
  // 下载文件
  const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `用户数据_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('CSV文件导出成功！', 'success');
}

// 更新统计信息
function updateStats() {
  const totalUsers = userData.length;
  const avgAge = totalUsers > 0 ? Math.round(userData.reduce((sum, user) => sum + user.age, 0) / totalUsers) : 0;
  
  // 计算最热门领域
  const categoryCount = {};
  userData.forEach(user => {
    categoryCount[user.category] = (categoryCount[user.category] || 0) + 1;
  });
  
  const mostPopular = Object.keys(categoryCount).reduce((a, b) => 
    categoryCount[a] > categoryCount[b] ? a : b, '-'
  );
  
  document.getElementById('totalUsers').textContent = totalUsers;
  document.getElementById('avgAge').textContent = avgAge;
  document.getElementById('mostPopularField').textContent = totalUsers > 0 ? mostPopular : '-';
}

// 保存数据到localStorage
function saveData() {
  localStorage.setItem('userData', JSON.stringify(userData));
}

// 显示通知消息
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}