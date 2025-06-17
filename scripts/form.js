// 表单数据管理
class FormDataManager {
    constructor() {
        this.storageKey = 'formData';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
        this.updateStats();
    }

    bindEvents() {
        const form = document.getElementById('dataForm');
        const clearBtn = document.getElementById('clearBtn');
        const refreshBtn = document.getElementById('refreshBtn');
        const exportBtn = document.getElementById('exportBtn');
        const clearDataBtn = document.getElementById('clearDataBtn');

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearForm());
        }
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadData());
        }
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportCSV());
        }
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearAllData());
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            const formData = this.getFormData();
            this.saveData(formData);
            this.showMessage('数据提交成功！', 'success');
            this.clearForm();
            this.loadData();
            this.updateStats();
        }
    }

    validateForm() {
        let isValid = true;
        const fields = ['name', 'age', 'email', 'gender', 'category', 'score1', 'score2', 'score3'];
        
        // 清除之前的错误信息
        fields.forEach(field => {
            const errorElement = document.getElementById(field + 'Error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        });

        // 验证姓名
        const name = document.getElementById('name').value.trim();
        if (!name) {
            this.showFieldError('nameError', '请输入姓名');
            isValid = false;
        } else if (name.length < 2) {
            this.showFieldError('nameError', '姓名至少需要2个字符');
            isValid = false;
        }

        // 验证年龄
        const age = parseInt(document.getElementById('age').value);
        if (!age || age < 1 || age > 120) {
            this.showFieldError('ageError', '请输入有效的年龄(1-120)');
            isValid = false;
        }

        // 验证邮箱
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            this.showFieldError('emailError', '请输入邮箱');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            this.showFieldError('emailError', '请输入有效的邮箱格式');
            isValid = false;
        }

        // 验证性别
        const gender = document.getElementById('gender').value;
        if (!gender) {
            this.showFieldError('genderError', '请选择性别');
            isValid = false;
        }

        // 验证兴趣领域
        const category = document.getElementById('category').value;
        if (!category) {
            this.showFieldError('categoryError', '请选择兴趣领域');
            isValid = false;
        }

        // 验证评分
        const scores = ['score1', 'score2', 'score3'];
        scores.forEach(scoreField => {
            const score = parseInt(document.getElementById(scoreField).value);
            if (isNaN(score) || score < 0 || score > 100) {
                this.showFieldError(scoreField + 'Error', '请输入0-100之间的评分');
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    getFormData() {
        return {
            id: this.getNextId(),
            name: document.getElementById('name').value.trim(),
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            category: document.getElementById('category').value,
            score1: parseInt(document.getElementById('score1').value),
            score2: parseInt(document.getElementById('score2').value),
            score3: parseInt(document.getElementById('score3').value),
            timestamp: new Date().toISOString().split('T')[0]
        };
    }

    getNextId() {
        const data = this.getData();
        return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    }

    saveData(formData) {
        const data = this.getData();
        data.push(formData);
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    loadData() {
        const data = this.getData();
        const tableBody = document.getElementById('dataTableBody');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10" class="no-data">暂无数据</td></tr>';
            return;
        }
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>${item.gender === 'M' ? '男' : '女'}</td>
                <td>${item.category}</td>
                <td>${item.score1}</td>
                <td>${item.score2}</td>
                <td>${item.score3}</td>
                <td>${item.timestamp}</td>
                <td>
                    <button onclick="formManager.deleteRecord(${item.id})" class="delete-btn">删除</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    deleteRecord(id) {
        if (confirm('确定要删除这条记录吗？')) {
            const data = this.getData();
            const filteredData = data.filter(item => item.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(filteredData));
            this.loadData();
            this.updateStats();
            this.showMessage('记录删除成功！', 'success');
        }
    }

    clearForm() {
        const form = document.getElementById('dataForm');
        if (form) {
            form.reset();
        }
        
        // 清除错误信息
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    clearAllData() {
        if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
            localStorage.removeItem(this.storageKey);
            this.loadData();
            this.updateStats();
            this.showMessage('所有数据已清空！', 'success');
        }
    }

    updateStats() {
        const data = this.getData();
        const totalRecords = document.getElementById('totalRecords');
        const latestSubmission = document.getElementById('latestSubmission');
        
        if (totalRecords) {
            totalRecords.textContent = data.length;
        }
        
        if (latestSubmission) {
            if (data.length > 0) {
                const latest = data[data.length - 1];
                latestSubmission.textContent = `${latest.name} (${latest.timestamp})`;
            } else {
                latestSubmission.textContent = '无';
            }
        }
    }

    exportCSV() {
        const data = this.getData();
        if (data.length === 0) {
            this.showMessage('没有数据可导出！', 'error');
            return;
        }
        
        // CSV 头部
        const headers = ['id', 'name', 'age', 'gender', 'category', 'score1', 'score2', 'score3', 'timestamp'];
        let csvContent = headers.join(',') + '\n';
        
        // CSV 数据
        data.forEach(item => {
            const row = headers.map(header => {
                let value = item[header];
                // 如果值包含逗号或引号，需要用引号包围并转义
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    value = '"' + value.replace(/"/g, '""') + '"';
                }
                return value;
            });
            csvContent += row.join(',') + '\n';
        });
        
        // 下载文件
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `form_data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('CSV文件导出成功！', 'success');
    }

    showMessage(message, type = 'info') {
        const messageElement = document.getElementById('statusMessage');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `status-message ${type}`;
            
            // 3秒后清除消息
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'status-message';
            }, 3000);
        }
    }
}

// 表格排序功能
function sortTable(columnIndex) {
    const table = document.getElementById('dataTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // 如果没有数据行，直接返回
    if (rows.length === 0 || (rows.length === 1 && rows[0].querySelector('.no-data'))) {
        return;
    }
    
    // 获取当前排序状态
    const currentSort = table.dataset.sortColumn;
    const currentDirection = table.dataset.sortDirection || 'asc';
    
    let newDirection = 'asc';
    if (currentSort == columnIndex && currentDirection === 'asc') {
        newDirection = 'desc';
    }
    
    // 排序
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // 数字列排序
        if (columnIndex === 0 || columnIndex === 2 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
            const aNum = parseInt(aValue);
            const bNum = parseInt(bValue);
            return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // 字符串列排序
        if (newDirection === 'asc') {
            return aValue.localeCompare(bValue, 'zh-CN');
        } else {
            return bValue.localeCompare(aValue, 'zh-CN');
        }
    });
    
    // 重新插入排序后的行
    rows.forEach(row => tbody.appendChild(row));
    
    // 保存排序状态
    table.dataset.sortColumn = columnIndex;
    table.dataset.sortDirection = newDirection;
}

// 初始化
let formManager;
document.addEventListener('DOMContentLoaded', () => {
    formManager = new FormDataManager();
});