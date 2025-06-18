// 数据可视化页面JavaScript

let csvData = [];

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
  initEventListeners();
  loadSampleData();
});

// 初始化事件监听器
function initEventListeners() {
  // 加载示例数据按钮
  document.getElementById('loadSampleData').addEventListener('click', loadSampleData);
  
  // 文件上传处理
  document.getElementById('uploadCsv').addEventListener('click', () => {
    document.getElementById('csvFileInput').click();
  });
  
  document.getElementById('csvFileInput').addEventListener('change', handleCsvUpload);
  
  // 图表切换功能
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', handleTabSwitch);
  });
  
  // 监听localStorage变化，实时同步数据
  window.addEventListener('storage', function(e) {
    if (e.key === 'userData') {
      loadSampleData();
    }
  });
  
  // 监听页面可见性变化，当页面重新可见时检查数据更新
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      loadSampleData();
    }
  });
}

// 加载示例数据
function loadSampleData() {
  // 优先从localStorage获取用户数据管理系统的数据
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  if (userData && userData.length > 0) {
    // 如果有用户数据，直接使用
    csvData = userData;
    updateCharts();
    updateStats();
  } else {
    // 如果没有用户数据，加载示例CSV文件
    loadCsvFromFile();
  }
}

// 从CSV文件加载数据（备用方案）
function loadCsvFromFile() {
  fetch('../data/sample.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error('无法加载CSV文件');
      }
      return response.text();
    })
    .then(csvText => {
      csvData = parseCSV(csvText);
      updateCharts();
      updateStats();
    })
    .catch(error => {
      console.error('加载CSV文件失败:', error);
      // 使用备用示例数据
      csvData = [
        {id: 1, name: 'Alice', age: 22, gender: 'F', category: '产品设计', score1: 78, score2: 85, score3: 92, timestamp: '2024-06-01'},
        {id: 2, name: 'Bob', age: 24, gender: 'M', category: '前端开发', score1: 88, score2: 76, score3: 81, timestamp: '2024-06-01'},
        {id: 3, name: 'Charlie', age: 23, gender: 'M', category: '数据分析', score1: 90, score2: 89, score3: 87, timestamp: '2024-06-02'},
        {id: 4, name: 'Diana', age: 25, gender: 'F', category: '前端开发', score1: 82, score2: 91, score3: 84, timestamp: '2024-06-02'},
        {id: 5, name: 'Eric', age: 21, gender: 'M', category: '产品设计', score1: 76, score2: 80, score3: 79, timestamp: '2024-06-03'}
      ];
      updateCharts();
      updateStats();
    });
}

// 解析CSV数据
function parseCSV(csvText) {
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

// 处理CSV文件上传
function handleCsvUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target.result;
      csvData = parseCSV(csvText);
      updateCharts();
      updateStats();
    };
    reader.readAsText(file);
  }
}

// 处理图表切换
function handleTabSwitch(e) {
  const btn = e.target;
  
  // 移除所有活跃状态
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.chart-panel').forEach(p => p.classList.remove('active'));
  
  // 添加当前活跃状态
  btn.classList.add('active');
  const chartType = btn.dataset.chart;
  
  if (chartType === 'line') {
    document.getElementById('lineChart').classList.add('active');
  } else if (chartType === 'pie') {
    document.getElementById('pieChart').classList.add('active');
  } else if (chartType === 'scatter3d') {
    document.getElementById('scatter3dChart').classList.add('active');
  }
}

// 更新所有图表
function updateCharts() {
  if (csvData.length === 0) return;
  
  updateLineChart();
  updatePieChart();
  updateScatter3DChart();
}

// 更新折线图
function updateLineChart() {
  const lineTrace = {
    x: csvData.map(d => d.id),
    y: csvData.map(d => d.score1 || 0),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Score1',
    line: { color: '#3498db', width: 3 },
    marker: { size: 8, color: '#e74c3c' }
  };
  
  const lineLayout = {
    title: 'Score1随ID变化趋势',
    xaxis: { title: 'ID' },
    yaxis: { title: 'Score1' },
    margin: { t: 50, r: 50, b: 50, l: 50 }
  };
  
  Plotly.newPlot('lineChartDiv', [lineTrace], lineLayout);
}

// 更新饼图
function updatePieChart() {
  const categoryCount = {};
  csvData.forEach(d => {
    const category = d.category || '未分类';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  const pieTrace = {
    labels: Object.keys(categoryCount),
    values: Object.values(categoryCount),
    type: 'pie',
    textinfo: 'label+percent',
    textposition: 'outside',
    marker: {
      colors: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6']
    }
  };
  
  const pieLayout = {
    title: '专业领域分布',
    margin: { t: 50, r: 50, b: 50, l: 50 }
  };
  
  Plotly.newPlot('pieChartDiv', [pieTrace], pieLayout);
}

// 更新3D散点图
function updateScatter3DChart() {
  const scatter3dTrace = {
    x: csvData.map(d => d.score1 || 0),
    y: csvData.map(d => d.score2 || 0),
    z: csvData.map(d => d.score3 || 0),
    mode: 'markers',
    type: 'scatter3d',
    text: csvData.map(d => `${d.name}<br>类别: ${d.category || '未分类'}`),
    marker: {
      size: 8,
      color: csvData.map(d => (d.score1 || 0) + (d.score2 || 0) + (d.score3 || 0)),
      colorscale: 'Viridis',
      showscale: true,
      colorbar: { title: '总分' }
    }
  };
  
  const scatter3dLayout = {
    title: '三维能力坐标分布',
    scene: {
      xaxis: { title: 'Score1' },
      yaxis: { title: 'Score2' },
      zaxis: { title: 'Score3' }
    },
    margin: { t: 50, r: 50, b: 50, l: 50 }
  };
  
  Plotly.newPlot('scatter3dChartDiv', [scatter3dTrace], scatter3dLayout);
}

// 更新统计信息
function updateStats() {
  if (csvData.length === 0) {
    document.getElementById('totalRecords').textContent = '0';
    document.getElementById('avgAge').textContent = '0';
    document.getElementById('maxScore').textContent = '0';
    return;
  }
  
  const totalRecords = csvData.length;
  const avgAge = (csvData.reduce((sum, d) => sum + (d.age || 0), 0) / totalRecords).toFixed(1);
  const maxScore = Math.max(...csvData.map(d => Math.max(d.score1 || 0, d.score2 || 0, d.score3 || 0)));
  
  document.getElementById('totalRecords').textContent = totalRecords;
  document.getElementById('avgAge').textContent = avgAge;
  document.getElementById('maxScore').textContent = maxScore;
}