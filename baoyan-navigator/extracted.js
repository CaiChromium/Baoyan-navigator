
// ==========================================
// 新增：视觉交互系统（保留原有功能完整）
// ==========================================

// 1.1 粒子星空Canvas
(function initStarfield() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // 100-150个粒子
  const count = Math.min(150, Math.floor((w * h) / 12000));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 0.5,
      color: Math.random() > 0.5 ? '#0F172A' : '#7C3AED'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

      // 绘制粒子
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color==='#0F172A'?'15,23,42':'124,58,237'}, ${Math.random()*0.5+0.3})`;
      ctx.fill();

      // 连线
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(148,163,184, ${1 - dist/100})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// 1.2 打字机效果
document.addEventListener('DOMContentLoaded', function() {
  const el = document.getElementById('typewriterContent');
  if (!el) return;
  const text = '同学，准备好开启你的保研之旅了吗？';
  let i = 0;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 80);
    }
  }
  setTimeout(type, 600);
});

// 1.2 动态统计数字 - Intersection Observer触发


// ==========================================
// 原有JavaScript功能完整保留（下方）
// ==========================================




// ==========================================
// 学校数据库（70所）
// ==========================================
// 默认加载同级目录下的 schools.json
// 如需使用云端数据，可将此URL替换为真实接口地址（如 jsonbin.io、GitHub raw 等）
const DATA_URL = './schools.json';

// 精简版默认数据（降级方案）
const defaultSchoolData = [
  { id:"thu", name:"清华大学", type:"985", tier:1, city:"北京", baseScore:92,
    disciplines:{"计算机":"A+","电子":"A+","机械":"A+","力学":"A+","经管":"A+"},
    thresholds:{gpa:3.8,rank:"前10%",english:"六级550+"},
    suitableMajors:["计算机","电子","机械","力学","经管","自动化"] },
  { id:"pku", name:"北京大学", type:"985", tier:1, city:"北京", baseScore:91,
    disciplines:{"数学":"A+","物理":"A+","计算机":"A+","法学":"A+","经管":"A+","生物":"A+"},
    thresholds:{gpa:3.8,rank:"前10%",english:"六级550+"},
    suitableMajors:["数学","物理","计算机","法学","经管","生物","文史"] },
  { id:"fudan", name:"复旦大学", type:"985", tier:1, city:"上海", baseScore:90,
    disciplines:{"数学":"A+","物理":"A","经管":"A+","生物":"A+","文史":"A+"},
    thresholds:{gpa:3.7,rank:"前10%",english:"六级550+"},
    suitableMajors:["数学","物理","经管","生物","文史"] },
  { id:"sjtu", name:"上海交通大学", type:"985", tier:1, city:"上海", baseScore:90,
    disciplines:{"计算机":"A","电子":"A+","机械":"A+","生物":"A+","经管":"A+"},
    thresholds:{gpa:3.7,rank:"前10%",english:"六级550+"},
    suitableMajors:["计算机","电子","机械","生物","经管"] },
  { id:"zju", name:"浙江大学", type:"985", tier:1, city:"杭州", baseScore:89,
    disciplines:{"计算机":"A+","机械":"A+","控制":"A+","材料":"A+","生物":"A"},
    thresholds:{gpa:3.7,rank:"前10%",english:"六级550+"},
    suitableMajors:["计算机","机械","自动化","材料","生物"] },
  { id:"nju", name:"南京大学", type:"985", tier:1, city:"南京", baseScore:88,
    disciplines:{"数学":"A","物理":"A+","计算机":"A","环境":"A+","文史":"A+"},
    thresholds:{gpa:3.6,rank:"前10%",english:"六级550+"},
    suitableMajors:["数学","物理","计算机","环境","文史"] },
  { id:"ustc", name:"中国科学技术大学", type:"985", tier:1, city:"合肥", baseScore:89,
    disciplines:{"物理":"A+","化学":"A+","数学":"A","计算机":"A"},
    thresholds:{gpa:3.7,rank:"前10%",english:"六级550+"},
    suitableMajors:["物理","化学","数学","计算机"] },
  { id:"buaa", name:"北京航空航天大学", type:"985", tier:2, city:"北京", baseScore:84,
    disciplines:{"计算机":"A","力学":"A+","控制":"A+"},
    thresholds:{gpa:3.5,rank:"前15%",english:"六级500+"},
    suitableMajors:["计算机","自动化","力学"] },
  { id:"hit", name:"哈尔滨工业大学", type:"985", tier:2, city:"哈尔滨", baseScore:84,
    disciplines:{"机械":"A+","控制":"A+","计算机":"A"},
    thresholds:{gpa:3.5,rank:"前15%",english:"六级500+"},
    suitableMajors:["机械","自动化","计算机"] },
  { id:"bupt", name:"北京邮电大学", type:"211", tier:3, city:"北京", baseScore:76,
    disciplines:{"计算机":"A+","电子":"A+"},
    thresholds:{gpa:3.3,rank:"前20%",english:"六级500+"},
    suitableMajors:["计算机","电子"] },
  { id:"xdu", name:"西安电子科技大学", type:"211", tier:3, city:"西安", baseScore:75,
    disciplines:{"电子":"A+","计算机":"A"},
    thresholds:{gpa:3.2,rank:"前25%",english:"六级500+"},
    suitableMajors:["电子","计算机"] }
];

let schoolDatabase = [];
let schoolNameList = [];

async function loadSchoolsData() {
  const loaderEl = document.getElementById('dataLoader');
  const errorEl = document.getElementById('dataError');
  if (loaderEl) loaderEl.style.display = 'flex';
  if (errorEl) errorEl.style.display = 'none';

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // jsonbin.io v3 wraps data in record
    schoolDatabase = data.record || data;
    schoolNameList = schoolDatabase.map(s => s.name);
    if (loaderEl) loaderEl.style.display = 'none';
    showMascotMsg('院校数据加载完成！可以开始测评啦 🎉', 3000);
  } catch (err) {
    console.error('Failed to load schools data:', err);
    if (loaderEl) loaderEl.style.display = 'none';
    // 加载失败时静默降级到本地默认数据，不显示错误UI
    useDefaultData();
  }
}

// 页面可见性变化时自动重试加载（如果之前失败且数据仍为空）
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && schoolDatabase.length === 0) {
    loadSchoolsData();
  }
});

function useDefaultData() {
  schoolDatabase = defaultSchoolData.slice();
  schoolNameList = schoolDatabase.map(s => s.name);
  const errorEl = document.getElementById('dataError');
  if (errorEl) errorEl.style.display = 'none';
  showMascotMsg('已加载本地默认数据，可以开始测评啦 📚', 3000);
}

// ==========================================
// 全局状态
// ==========================================
// ==========================================
let currentStep = 1;
let radarChartInstance = null;
let currentScores = {};  // 存储当前各维度得分
let gpaScale = 5.0;      // 绩点制度满分（Step 2 用户选择的制度）
let currentBaseline = [14,14,14,14,14]; // 当前目标基线
let matchedSchoolInfo = null; // 匹配到的学校信息


// ==========================================
// IP小助理
// ==========================================
let mascotTimer = null;
let lastMascotMsg = '';

function showMascotMsg(msg, duration) {
  duration = duration || 3000;
  const bubble = document.getElementById('mascotBubble');
  bubble.textContent = msg;
  bubble.classList.add('show');
  lastMascotMsg = msg;
  clearTimeout(mascotTimer);
  mascotTimer = setTimeout(() => {
    bubble.classList.remove('show');
  }, duration);
}

function showMascotBubble() {
  if (lastMascotMsg) {
    const bubble = document.getElementById('mascotBubble');
    bubble.classList.add('show');
    clearTimeout(mascotTimer);
    mascotTimer = setTimeout(() => {
      bubble.classList.remove('show');
    }, 3000);
  }
}

// 页面加载时显示欢迎消息
setTimeout(() => {
  showMascotMsg('嘿，准备好一起规划未来了吗？✨', 4000);
}, 800);

// ==========================================
// 分步导航
// ==========================================
function goStep(step) {
  const prevStep = currentStep;
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('step' + step).classList.add('active');
  currentStep = step;
  updateProgress(step);

  // IP小助理：步骤完成提示
  if (step === 2 && prevStep === 1) {
    showMascotMsg('收到！你的基本情况我了解啦 📝');
  } else if (step === 3 && prevStep === 2) {
    const gpa = parseFloat(document.getElementById('inputGpa').value);
    const gpaNorm = gpa / gpaScale * 5;
    if (gpaNorm >= 3.6) {
      showMascotMsg('绩点不错，继续加油！💪');
    } else {
      showMascotMsg('绩点还有提升空间，一起努力 💪');
    }
  } else if (step === 4 && prevStep === 3) {
    showMascotMsg('经历填完啦，马上帮你出报告 🚀');
  }
}

function updateProgress(step) {
  const fill = document.getElementById('progressFill');
  fill.style.width = (step * 25) + '%';
  document.querySelectorAll('.progress-step').forEach(s => {
    const sNum = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (sNum === step) s.classList.add('active');
    else if (sNum < step) s.classList.add('done');
  });
  for (let i = 1; i <= 3; i++) {
    const line = document.getElementById('line' + i);
    line.classList.remove('done', 'active');
    if (i < step) line.classList.add('done');
    else if (i === step) line.classList.add('active');
  }
}

// ==========================================
// 交互绑定
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  // 专业快捷标签
  document.querySelectorAll('#majorTags .quick-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      document.querySelectorAll('#majorTags .quick-tag').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      document.getElementById('inputMajor').value = this.dataset.val;
    });
  });

  // 单选组
  setupRadioGroup('gradeGroup');
  setupRadioGroup('classGroup');
  setupRadioGroup('gpaScaleGroup');

  // 绩点制度切换
  document.querySelectorAll('#gpaScaleGroup .radio-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('#gpaScaleGroup .radio-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      gpaScale = parseFloat(this.dataset.val);
      const slider = document.getElementById('inputGpa');
      slider.max = gpaScale;
      if (parseFloat(slider.value) > gpaScale) slider.value = gpaScale;
      document.getElementById('gpaVal').textContent = parseFloat(slider.value).toFixed(1) + ' / ' + gpaScale.toFixed(1);
    });
  });

  // 学校下拉联想：点击外部关闭
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.school-input-wrap')) {
      document.getElementById('schoolDropdown').classList.remove('show');
    }
  });

  // 多选组
  document.querySelectorAll('#targetGroup .multi-item').forEach(item => {
    item.addEventListener('click', function() {
      if (this.dataset.val === '还没想好') {
        document.querySelectorAll('#targetGroup .multi-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      } else {
        document.querySelectorAll('#targetGroup .multi-item[data-val="还没想好"]').forEach(i => i.classList.remove('active'));
        this.classList.toggle('active');
      }
    });
  });
});

function setupRadioGroup(groupId) {
  document.querySelectorAll('#' + groupId + ' .radio-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('#' + groupId + ' .radio-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function getRadioValue(groupId) {
  const active = document.querySelector('#' + groupId + ' .radio-item.active');
  return active ? active.dataset.val : null;
}

function getMultiValues(groupId) {
  const vals = [];
  document.querySelectorAll('#' + groupId + ' .multi-item.active').forEach(i => {
    vals.push(i.dataset.val);
  });
  return vals;
}


// ==========================================
// 自然语言解析
// ==========================================
function parseNaturalLanguage(text) {
  const result = { school: '', major: '', grade: '', gpa: '', research: '', competition: '', english: '' };
  const t = text;

  // 学校：识别关键词 + 模糊匹配
  if (/清北|清华|北大/.test(t)) { result.school = '清华大学'; }
  else if (/985/.test(t)) {
    const matches = schoolNameList.filter(n => /大学/.test(n) && !/211/.test(n));
    if (matches.length > 0) result.school = matches[0];
  }
  else if (/211/.test(t)) {
    const matches = schoolNameList.filter(n => n.includes('北京邮电') || n.includes('电子科技') || n.includes('南京航空'));
    if (matches.length > 0) result.school = matches[0];
  }
  else if (/双非/.test(t)) { result.school = ''; }
  else {
    // 尝试从schoolNameList中模糊匹配
    for (const name of schoolNameList) {
      if (t.includes(name.replace(/大学|学院|研究所/g, ''))) { result.school = name; break; }
    }
  }

  // 专业
  const majorMap = {
    '计算机': '计算机', '软件': '计算机', 'CS': '计算机',
    '数学': '数学', '物理': '物理', '电子': '电子', '通信': '电子',
    '机械': '机械', '自动化': '自动化', '控制': '自动化',
    '生物': '生物', '化学': '化学', '经管': '经管', '经济': '经管', '管理': '经管',
    '法学': '法学', '法律': '法学', '文史': '文史', '文学': '文史'
  };
  for (const [key, val] of Object.entries(majorMap)) {
    if (t.includes(key)) { result.major = val; break; }
  }

  // 年级
  if (/大一/.test(t)) result.grade = '1';
  else if (/大二/.test(t)) result.grade = '2';
  else if (/大三/.test(t)) result.grade = '3';

  // 绩点
  const gpaMatch = t.match(/(\d+\.?\d*)/);
  if (gpaMatch) {
    const num = parseFloat(gpaMatch[1]);
    if (num >= 1.0 && num <= 5.0) result.gpa = num.toFixed(1);
  }

  // 科研
  if (/论文/.test(t)) result.research = '有论文发表';
  else if (/项目/.test(t)) result.research = '有科研项目经历';
  else if (/实验室/.test(t)) result.research = '进过实验室';

  // 竞赛
  if (/国奖|国家级/.test(t)) result.competition = '国家级奖项';
  else if (/省奖|省级/.test(t)) result.competition = '省级奖项';
  else if (/校奖|校级/.test(t)) result.competition = '校级奖项';

  // 英语
  if (/六级\s*550|六级550/.test(t)) result.english = '六级550+';
  else if (/六级\s*500|六级500/.test(t)) result.english = '六级500-550';
  else if (/六级通过|过了六级|六级/.test(t)) result.english = '六级通过';
  else if (/四级通过|过了四级|四级/.test(t)) result.english = '四级通过';

  return result;
}

function parseAndFill() {
  const text = document.getElementById('nlInput').value.trim();
  const msgEl = document.getElementById('nlMsg');
  if (!text) { msgEl.textContent = '请先输入你的情况哦~'; msgEl.className = 'nl-msg'; return; }

  const parsed = parseNaturalLanguage(text);
  let filledCount = 0;

  function setVal(id, val, type) {
    if (!val) return;
    const el = document.getElementById(id);
    if (!el) return;
    if (type === 'radio') {
      const item = document.querySelector('#' + id + ' .radio-item[data-val="' + val + '"]');
      if (item) item.click();
      else return;
    } else if (type === 'input') {
      el.value = val;
      // 如果是range，同步显示值
      if (el.type === 'range') {
        const displayEl = document.getElementById('gpaVal');
        if (displayEl) displayEl.textContent = val + ' / ' + gpaScale;
      }
    } else if (type === 'select') {
      el.value = val;
    }
    el.classList.add('highlight-fill');
    setTimeout(() => el.classList.remove('highlight-fill'), 2000);
    filledCount++;
  }

  if (schoolNameList.length === 0) {
    msgEl.textContent = '院校数据还在加载中，请稍后再试~';
    msgEl.className = 'nl-msg';
    showMascotMsg('数据还在路上，稍等片刻哦 ⏳', 3000);
    return;
  }

  if (parsed.school) { setVal('inputSchool', parsed.school, 'input'); onSchoolInput(parsed.school); }
  if (parsed.major) { setVal('inputMajor', parsed.major, 'input'); }
  if (parsed.grade) {
    const gradeItem = document.querySelector('#gradeGroup .radio-item[data-val="' + parsed.grade + '"]');
    if (gradeItem) gradeItem.click();
    document.getElementById('gradeGroup').classList.add('highlight-fill');
    setTimeout(() => document.getElementById('gradeGroup').classList.remove('highlight-fill'), 2000);
    filledCount++;
  }
  if (parsed.gpa) { setVal('inputGpa', parsed.gpa, 'input'); }
  if (parsed.research) { setVal('inputResearch', parsed.research, 'select'); }
  if (parsed.competition) { setVal('inputCompetition', parsed.competition, 'select'); }
  if (parsed.english) { setVal('inputEnglish', parsed.english, 'select'); }

  if (filledCount > 0) {
    msgEl.textContent = '✅ 已自动填入 ' + filledCount + ' 项信息，请检查并补充！';
    msgEl.className = 'nl-msg success';
    showMascotMsg('解析成功！已帮你填好 ' + filledCount + ' 项 ✨', 3000);
  } else {
    msgEl.textContent = '没看太懂，可以再描述得具体一点哦～';
    msgEl.className = 'nl-msg';
    showMascotMsg('没看太懂，换个说法试试？🤔', 3000);
  }
}

// ==========================================
// 学校联想下拉
// ==========================================
function onSchoolInput(val) {
  const dropdown = document.getElementById('schoolDropdown');
  if (!val || val.length < 1) {
    dropdown.classList.remove('show');
    return;
  }
  const matches = schoolNameList.filter(name =>
    name.includes(val) || val.includes(name)
  );
  if (matches.length === 0) {
    dropdown.innerHTML = '<div class="school-dropdown-item no-match">未找到匹配的学校，可继续填写</div>';
  } else {
    dropdown.innerHTML = matches.map(name =>
      `<div class="school-dropdown-item" onclick="selectSchool('${name}')">${name}</div>`
    ).join('');
  }
  dropdown.classList.add('show');
}

function selectSchool(name) {
  document.getElementById('inputSchool').value = name;
  document.getElementById('schoolDropdown').classList.remove('show');
  validateSchool();
}

// ==========================================
// 前端校验
// ==========================================
const nameRegex = /^[\u4e00-\u9fa5a-zA-Z\u4e00-\u9fa5]{2,30}$/;

function validateSchool() {
  const input = document.getElementById('inputSchool');
  const error = document.getElementById('schoolError');
  const btn = document.getElementById('step1NextBtn');
  const val = input.value.trim();
  if (!val) {
    input.classList.remove('error');
    error.classList.remove('show');
    btn.disabled = false;
    btn.style.opacity = '1';
    return true;
  }
  if (!nameRegex.test(val)) {
    input.classList.add('error');
    error.classList.add('show');
    // 摇头动画
    input.classList.remove('shake');
    void input.offsetWidth; // 触发reflow
    input.classList.add('shake');
    btn.disabled = true;
    btn.style.opacity = '0.5';
    return false;
  }
  input.classList.remove('error');
  error.classList.remove('show');
  btn.disabled = false;
  btn.style.opacity = '1';
  return true;
}

function validateMajor() {
  const input = document.getElementById('inputMajor');
  const error = document.getElementById('majorError');
  const val = input.value.trim();
  if (!val) {
    input.classList.remove('error');
    error.classList.remove('show');
    return true;
  }
  if (!nameRegex.test(val)) {
    input.classList.add('error');
    error.classList.add('show');
    // 摇头动画
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    return false;
  }
  input.classList.remove('error');
  error.classList.remove('show');
  return true;
}

// ==========================================
// 院校背景系数计算
// ==========================================
function calcSchoolFactor(schoolName) {
  if (!schoolName) return { factor: 0.80, tier: 'D级', label: '其他/未录入', desc: '你的本科院校背景在保研竞争中面临较大挑战，建议在科研/竞赛/英语上重点突破，或关注对双非友好的院校。同时建议尽早明确保研/考研双线策略。' };

  // S级
  if (schoolName.includes('清华') || schoolName.includes('北大')) {
    return { factor: 1.15, tier: 'S级', label: schoolName, desc: '你的本科院校背景为你带来了显著优势，建议重点关注顶尖985院校。' };
  }

  // A+级
  const aPlusList = ['复旦大学','上海交通大学','浙江大学','南京大学','中国科学技术大学','中国人民大学'];
  if (aPlusList.includes(schoolName)) {
    return { factor: 1.10, tier: 'A+级', label: schoolName, desc: '你的本科院校背景较好，建议冲击顶尖985和中坚985院校。' };
  }

  // A级
  const aList = ['北京航空航天大学','同济大学','南开大学','哈尔滨工业大学','西安交通大学','华中科技大学','武汉大学'];
  if (aList.includes(schoolName)) {
    return { factor: 1.05, tier: 'A级', label: schoolName, desc: '你的本科院校背景有一定优势，建议稳妥定位中坚985和强势211。' };
  }

  // 在数据库中查找
  const dbSchool = schoolDatabase.find(s => s.name === schoolName);
  if (dbSchool) {
    // A-级：985不在上述列表
    if (dbSchool.type === '985') {
      return { factor: 1.00, tier: 'A-级', label: schoolName, desc: '你的本科院校属于985行列，保研具有一定竞争力，建议合理定位。' };
    }
    // B+级：特定211
    const bPlusList = ['北京邮电大学','西安电子科技大学','南京航空航天大学','南京理工大学','上海财经大学','中央财经大学','中国政法大学','中国传媒大学'];
    if (dbSchool.type === '211' && bPlusList.includes(schoolName)) {
      return { factor: 0.93, tier: 'B+级', label: schoolName, desc: '你的本科院校属于强势211，在特定领域有较强竞争力，建议关注专业对口院校。' };
    }
    // B级：其他211
    if (dbSchool.type === '211') {
      return { factor: 0.87, tier: 'B级', label: schoolName, desc: '你的本科院校属于211行列，保研需要更多努力，建议在科研和竞赛上重点突破。' };
    }
    // C级：特殊院校
    const cList = ['西湖大学','南方科技大学','上海科技大学'];
    if (cList.includes(schoolName)) {
      return { factor: 1.02, tier: 'C级', label: schoolName, desc: '你的本科院校属于新兴研究型大学，科研氛围浓厚，建议发挥科研优势。' };
    }
    // 中科院/研究院
    if (dbSchool.type === '中科院' || dbSchool.type === '研究院') {
      return { factor: 1.00, tier: 'A-级', label: schoolName, desc: '你的院校属于中科院系统或新型研究院，科研实力强，建议发挥科研优势。' };
    }
  }

  // D级：未录入
  return { factor: 0.80, tier: 'D级', label: schoolName + '（双非有推免资格）', desc: '你的本科院校背景在保研竞争中面临较大挑战，建议在科研/竞赛/英语上重点突破，或关注对双非友好的院校。同时建议尽早明确保研/考研双线策略。' };
}

// ==========================================
// 保研率计算
// ==========================================
function calcBaoyanRate() {
  const quota = parseInt(document.getElementById('inputQuota').value);
  const total = parseInt(document.getElementById('inputTotalStudents').value);
  if (!quota || !total || total <= 0) return null;
  const rate = (quota / total * 100).toFixed(1);
  let level, tip, tipCls;
  if (rate >= 20) {
    level = '竞争缓和';
    tip = '竞争缓和，建议冲击更高层次院校';
    tipCls = 'easy';
  } else if (rate >= 10) {
    level = '竞争中等';
    tip = '竞争中等，建议稳妥定位';
    tipCls = 'medium';
  } else if (rate >= 5) {
    level = '竞争激烈';
    tip = '竞争激烈，建议提前准备考研备选方案';
    tipCls = 'hard';
  } else {
    level = '竞争非常激烈';
    tip = '竞争非常激烈，建议考研/保研双线准备';
    tipCls = 'veryhard';
  }
  return { rate, quota, total, level, tip, tipCls };
}

// ==========================================
// 评分算法
// ==========================================
function calcDimensionScore(value, rules) {
  for (const rule of rules) {
    if (rule.condition(value)) return rule.score;
  }
  return rules[rules.length - 1].score;
}

function calcGpaScore(gpa) {
  return calcDimensionScore(gpa, [
    { condition: v => v >= 4.0, score: 20 },
    { condition: v => v >= 3.6, score: 16 },
    { condition: v => v >= 3.3, score: 12 },
    { condition: v => v >= 3.0, score: 8 },
    { condition: v => true, score: 4 }
  ]);
}

function calcRankScore(rank) {
  return calcDimensionScore(rank, [
    { condition: v => v === '前5%', score: 20 },
    { condition: v => v === '前10%', score: 16 },
    { condition: v => v === '前20%', score: 12 },
    { condition: v => v === '前30%', score: 8 },
    { condition: v => v === '30%以后', score: 4 },
    { condition: v => true, score: 10 }
  ]);
}

function calcResearchScore(research) {
  return calcDimensionScore(research, [
    { condition: v => v === '有论文发表', score: 20 },
    { condition: v => v === '有科研项目经历', score: 16 },
    { condition: v => v === '进过实验室', score: 12 },
    { condition: v => v === '有科研意向但未开始', score: 8 },
    { condition: v => true, score: 4 }
  ]);
}

function calcCompetitionScore(comp) {
  return calcDimensionScore(comp, [
    { condition: v => v === '国家级奖项', score: 20 },
    { condition: v => v === '省级奖项', score: 16 },
    { condition: v => v === '校级奖项', score: 12 },
    { condition: v => v === '参与但未获奖', score: 8 },
    { condition: v => true, score: 4 }
  ]);
}

function calcEnglishScore(eng) {
  return calcDimensionScore(eng, [
    { condition: v => v === '六级550+', score: 20 },
    { condition: v => v === '六级500-550', score: 16 },
    { condition: v => v === '六级通过', score: 12 },
    { condition: v => v === '四级通过', score: 8 },
    { condition: v => true, score: 4 }
  ]);
}

function calcTotalScore(gpa, rank, research, competition, english, classType) {
  const gpaS = calcGpaScore(gpa);
  const rankS = calcRankScore(rank);
  const resS = calcResearchScore(research);
  const compS = calcCompetitionScore(competition);
  const engS = calcEnglishScore(english);
  let total = gpaS + rankS + resS + compS + engS;
  // 特殊班级加成
  if (classType === '强基计划' || classType === '拔尖基地' || classType === '实验班') {
    total = Math.ceil(total * 1.05);
  }
  return { total: Math.min(total, 100), gpaS, rankS, resS, compS, engS };
}

// ==========================================
// 专业匹配
// ==========================================
const majorCategoryMap = {
  '数学': ['数学'],
  '物理': ['物理'],
  '计算机': ['计算机'],
  '电子': ['电子'],
  '自动化': ['自动化', '控制'],
  '机械': ['机械'],
  '生物': ['生物'],
  '化学': ['化学'],
  '经管': ['经管'],
  '法学': ['法学'],
  '文史': ['文史']
};

function matchSchools(major) {
  // 先精确匹配 suitableMajors
  let matched = schoolDatabase.filter(s => s.suitableMajors.some(m => major.includes(m) || m.includes(major)));
  // 如果没有精确匹配，尝试学科大类
  if (matched.length === 0) {
    const broadMap = {
      '理工': ['计算机','电子','机械','自动化','力学','材料','化工','生物','化学','物理','数学','控制'],
      '文商': ['经管','法学','文史'],
      '医学': ['生物','医学']
    };
    for (const [cat, majors] of Object.entries(broadMap)) {
      if (majors.some(m => major.includes(m))) {
        matched = schoolDatabase.filter(s => s.suitableMajors.some(m => majors.includes(m)));
        break;
      }
    }
  }
  // 如果还是没匹配到，返回所有学校
  if (matched.length === 0) matched = schoolDatabase.slice();
  return matched;
}

// ==========================================
// 院校推荐三档
// ==========================================
function recommendSchools(userScore, matchedSchools, targetPrefs) {
  // 按目标偏好过滤
  let filtered = matchedSchools;
  if (targetPrefs && targetPrefs.length > 0 && !targetPrefs.includes('还没想好')) {
    const tierMap = { '顶尖985': 1, '中坚985': 2, '211': 3, '中科院所': '中科院', '新型研究院': '研究院' };
    const targetTiers = targetPrefs.map(t => tierMap[t]).filter(Boolean);
    const typeFiltered = matchedSchools.filter(s => targetTiers.includes(s.tier) || targetTiers.includes(s.type));
    if (typeFiltered.length >= 3) filtered = typeFiltered;
  }

  // 计算差值并按差值从大到小排序（差值越大，用户相对越有竞争力）
  let results = filtered.map(s => {
    const diff = userScore - s.baseScore;
    const matchPct = Math.max(60, Math.min(100, 100 - Math.abs(diff) * 2));
    let stars = 5;
    if (s.baseScore >= 88) stars = 5;
    else if (s.baseScore >= 82) stars = 4;
    else if (s.baseScore >= 76) stars = 3;
    else stars = 2;
    return { ...s, diff, matchPct, stars };
  });

  results.sort((a, b) => b.diff - a.diff);

  const total = results.length;

  // 如果候选院校少于6所，不区分三档
  if (total < 6) {
    return {
      chongci: [],
      wentuo: [],
      baodi: results.slice(0, 5),
      few: true
    };
  }

  // 相对分档法：前30%保底，中间40%稳妥，后30%冲刺
  const baodiEnd = Math.max(2, Math.ceil(total * 0.30));
  const wentuoEnd = Math.max(baodiEnd + 2, Math.ceil(total * 0.70));

  let baodi = results.slice(0, baodiEnd).map(r => ({ ...r, tier: '保底' }));
  let wentuo = results.slice(baodiEnd, wentuoEnd).map(r => ({ ...r, tier: '稳妥' }));
  let chongci = results.slice(wentuoEnd).map(r => ({ ...r, tier: '冲刺' }));

  // 确保每档至少2所，不足则从相邻档调剂
  if (baodi.length < 2 && wentuo.length > 0) {
    const need = 2 - baodi.length;
    baodi = baodi.concat(wentuo.slice(0, need).map(r => ({ ...r, tier: '保底' })));
    wentuo = wentuo.slice(need);
  }
  if (wentuo.length < 2) {
    if (baodi.length > 2) {
      const move = baodi.slice(-1);
      wentuo = move.map(r => ({ ...r, tier: '稳妥' })).concat(wentuo);
      baodi = baodi.slice(0, -1);
    } else if (chongci.length > 0) {
      const need = 2 - wentuo.length;
      wentuo = wentuo.concat(chongci.slice(0, need).map(r => ({ ...r, tier: '稳妥' })));
      chongci = chongci.slice(need);
    }
  }
  if (chongci.length < 2 && wentuo.length > 0) {
    const need = 2 - chongci.length;
    chongci = chongci.concat(wentuo.slice(-need).map(r => ({ ...r, tier: '冲刺' })));
    wentuo = wentuo.slice(0, -need);
  }

  // 每档最多显示3所
  return {
    chongci: chongci.slice(0, 3),
    wentuo: wentuo.slice(0, 3),
    baodi: baodi.slice(0, 3),
    few: false
  };
}

// ==========================================
// 生成推荐理由
// ==========================================
function getReason(school, userMajor) {
  const disc = school.disciplines;
  const matched = Object.entries(disc).filter(([k,v]) => userMajor.includes(k) || k.includes(userMajor));
  if (matched.length > 0) {
    const top = matched.sort((a,b) => {
      const order = {'A+':4,'A':3,'A-':2,'B+':1};
      return (order[b[1]]||0) - (order[a[1]]||0);
    })[0];
    return `该校在${top[0]}领域评估为${top[1]}，与你的${userMajor}专业高度匹配。`;
  }
  return `该校综合实力强劲，值得作为${school.tier === 1 ? '冲刺' : '目标'}选择。`;
}

// ==========================================
// 深度规划系统 - 任务树数据（完整7学期）
// ==========================================
const taskTreeData = {
  '大一上': {
    icon: '🎯',
    title: '核心课攻坚 + 方向验证',
    desc: '打好数学、英语、专业基础课，初步了解保研政策',
    tasks: [
      {
        id: 's1t1', title: '打好基础课程', icon: '📚',
        priority: 'urgent',
        detail: {
          value: '高绩点是保研的第一块敲门砖，大一基础课学分高，对GPA影响极大。',
          data: '期末成绩90+的同学，大二保研准备压力减少40%。',
          links: ['🔗 高数满分笔记', '🔗 线代速成课'],
          tip: '建议每周至少花10小时在数学课上，这是性价比最高的投入。'
        },
        subs: [
          { id: 's1t1s1', text: '制定学期学习计划（第1周）', time: '9月' },
          { id: 's1t1s2', text: '加入学习小组或找学霸同伴', time: '9月' },
          { id: 's1t1s3', text: '期中考试前完成一轮复习', time: '10月' },
          { id: 's1t1s4', text: '期末冲刺，目标单科90+', time: '12月' }
        ]
      },
      {
        id: 's1t2', title: '英语四级备考', icon: '🗣️',
        priority: 'high',
        detail: {
          value: '四级是保研的基本门槛，部分985院校要求英语成绩达标。',
          data: '大一通过四级的同学，大二集中精力攻克六级的时间更充裕。',
          links: ['🔗 四级词汇表', '🔗 四级真题合集'],
          tip: '每天背30个单词+做1篇阅读，坚持2个月基本稳过。'
        },
        subs: [
          { id: 's1t2s1', text: '购买/下载四级备考资料', time: '9月' },
          { id: 's1t2s2', text: '每天背30个单词', time: '9-11月' },
          { id: 's1t2s3', text: '刷完5套历年真题', time: '11月' },
          { id: 's1t2s4', text: '参加12月四级考试，目标500+', time: '12月' }
        ]
      },
      {
        id: 's1t3', title: '了解保研政策', icon: '📋',
        priority: 'medium',
        detail: {
          value: '提前了解本校保研规则，才能有的放矢地规划大学生活。',
          data: '约80%的同学到大三才开始了解保研，你已经领先一步。',
          links: ['🔗 保研政策解读', '🔗 保研vs考研对比'],
          tip: '重点关注：保研率、综合测评加分细则、科研竞赛加分政策。'
        },
        subs: [
          { id: 's1t3s1', text: '查阅学校教务处保研政策文件', time: '10月' },
          { id: 's1t3s2', text: '了解本院保研率和名额分配', time: '10月' },
          { id: 's1t3s3', text: '关注综合测评加分细则', time: '11月' },
          { id: 's1t3s4', text: '与学长学姐交流保研经验', time: '11月' }
        ]
      },
      {
        id: 's1t4', title: '拓展学术视野', icon: '🔭',
        priority: 'low',
        detail: {
          value: '参加学术讲座和社团活动，有助于明确研究方向和兴趣。',
          data: '有明确研究方向的同学，大二进实验室的成功率高3倍。',
          links: ['🔗 学术讲座日历', '🔗 专业社团推荐'],
          tip: '不必急于确定方向，多听多看，慢慢找到自己感兴趣的领域。'
        },
        subs: [
          { id: 's1t4s1', text: '参加3场以上院系学术讲座', time: '9-12月' },
          { id: 's1t4s2', text: '加入1个学术/专业相关社团', time: '9月' },
          { id: 's1t4s3', text: '浏览学校官网导师研究方向', time: '11月' },
          { id: 's1t4s4', text: '阅读1-2篇本专业经典论文', time: '12月' }
        ]
      }
    ]
  },
  '大一下': {
    icon: '📚',
    title: '绩点保持 + 六级出击',
    desc: '保持高绩点，通过英语六级，尝试接触科研',
    tasks: [
      {
        id: 's2t1', title: '巩固核心课程', icon: '📖',
        priority: 'urgent',
        detail: {
          value: '大一到大二的绩点是累积计算的，任何一门课的失误都会影响总体排名。',
          data: '保研排名差距往往在0.01分，一门课85分vs90分可能差出几个名次。',
          links: ['🔗 高数下册笔记', '🔗 专业课思维导图'],
          tip: '大二上的专业课难度提升，建议提前预习、课后复盘。'
        },
        subs: [
          { id: 's2t1s1', text: '复习上学期的薄弱科目', time: '2月' },
          { id: 's2t1s2', text: '制定本学期GPA目标（≥3.8/4.0）', time: '2月' },
          { id: 's2t1s3', text: '每周至少去图书馆自习3次', time: '2-6月' },
          { id: 's2t1s4', text: '期末考试目标全A', time: '6月' }
        ]
      },
      {
        id: 's2t2', title: '英语六级冲刺', icon: '🇬🇧',
        priority: 'high',
        detail: {
          value: '六级成绩直接影响夏令营申请，550+是985院校的基本门槛。',
          data: '保研上岸的同学中，85%六级成绩在500分以上。',
          links: ['🔗 六级550+备考计划', '🔗 六级听力特训'],
          tip: '六级考试在6月，建议从3月开始系统备考。'
        },
        subs: [
          { id: 's2t2s1', text: '评估四级基础，制定六级计划', time: '2月' },
          { id: 's2t2s2', text: '每天听力30min+阅读2篇', time: '3-5月' },
          { id: 's2t2s3', text: '完成10套六级真题', time: '5月' },
          { id: 's2t2s4', text: '参加6月六级考试，目标550+', time: '6月' }
        ]
      },
      {
        id: 's2t3', title: '初步接触科研', icon: '🔬',
        priority: 'high',
        detail: {
          value: '尽早进入实验室，积累科研经历是保研中最有含金量的加分项。',
          data: '有实验室经历的同学在夏令营中录取率高60%。',
          links: ['🔗 联系导师邮件模板', '🔗 文献检索入门'],
          tip: '大一阶段不必追求成果，重在体验科研过程、学习基础方法。'
        },
        subs: [
          { id: 's2t3s1', text: '浏览3-5位导师的主页和研究方向', time: '2月' },
          { id: 's2t3s2', text: '撰写联系邮件，表达科研兴趣', time: '3月' },
          { id: 's2t3s3', text: '成功进入实验室跟组学习', time: '3-4月' },
          { id: 's2t3s4', text: '学习文献检索和阅读方法', time: '4-6月' }
        ]
      },
      {
        id: 's2t4', title: '竞赛初步尝试', icon: '🏆',
        priority: 'medium',
        detail: {
          value: '竞赛经历可以丰富简历，校级以上奖项在保研中均有加分。',
          data: '获得省级以上竞赛奖项的同学，保研综合测评平均加3-5分。',
          links: ['🔗 大学生竞赛大全', '🔗 数模入门指南'],
          tip: '从校级比赛开始积累经验，大二再参加省级、国家级赛事。'
        },
        subs: [
          { id: 's2t4s1', text: '了解本专业认可度高的竞赛列表', time: '2月' },
          { id: 's2t4s2', text: '报名参加1项校级竞赛', time: '3月' },
          { id: 's2t4s3', text: '与同学组建竞赛小组', time: '3月' },
          { id: 's2t4s4', text: '完成比赛并总结经验', time: '5-6月' }
        ]
      }
    ]
  },
  '大二上': {
    icon: '🔬',
    title: '科研深入 + 竞赛冲刺',
    desc: '深度参与科研项目和竞赛，产出初步成果',
    tasks: [
      {
        id: 's3t1', title: '科研项目深化', icon: '🧪',
        priority: 'urgent',
        detail: {
          value: '有科研产出（论文/专利/项目）是保研中最具竞争力的因素。',
          data: '有论文发表经历的保研成功率比无科研经历者高出40%。',
          links: ['🔗 科研项目申请书模板', '🔗 学术论文写作入门'],
          tip: '与导师保持密切沟通，每周至少汇报一次进展。'
        },
        subs: [
          { id: 's3t1s1', text: '与导师确定具体研究方向', time: '9月' },
          { id: 's3t1s2', text: '完成开题报告/研究计划', time: '10月' },
          { id: 's3t1s3', text: '阅读20篇以上相关领域文献', time: '9-12月' },
          { id: 's3t1s4', text: '开始实验/数据收集工作', time: '11月' },
          { id: 's3t1s5', text: '撰写阶段性研究报告', time: '12月' }
        ]
      },
      {
        id: 's3t2', title: '数学建模/专业竞赛', icon: '📊',
        priority: 'high',
        detail: {
          value: '数学建模竞赛含金量高，是理工科保研的重要加分项。',
          data: '数模国一获奖者在985夏令营中基本都能拿到优营。',
          links: ['🔗 数学建模官网', '🔗 历年优秀论文赏析'],
          tip: '建议3人组队，分工明确：建模+编程+写作。'
        },
        subs: [
          { id: 's3t2s1', text: '组队并学习LaTeX/Python等工具', time: '9月' },
          { id: 's3t2s2', text: '研读3篇以上优秀获奖论文', time: '9-10月' },
          { id: 's3t2s3', text: '完成3次以上模拟训练', time: '10-11月' },
          { id: 's3t2s4', text: '参加校赛并争取出线', time: '11月' }
        ]
      },
      {
        id: 's3t3', title: '六级刷分/雅思托福', icon: '✈️',
        priority: 'medium',
        detail: {
          value: '六级600+或雅思7+/托福100+可以显著提升申请竞争力。',
          data: '夏令营英语面试环节，高分英语者表现明显更好。',
          links: ['🔗 六级600+冲刺攻略', '🔗 雅思备考时间表'],
          tip: '如果六级已达550+，建议冲刺600+或考虑雅思托福。'
        },
        subs: [
          { id: 's3t3s1', text: '评估上次六级成绩，决定刷分方案', time: '9月' },
          { id: 's3t3s2', text: '针对薄弱环节专项训练', time: '10-11月' },
          { id: 's3t3s3', text: '刷完10套以上真题', time: '11月' },
          { id: 's3t3s4', text: '参加12月六级/雅思考试', time: '12月' }
        ]
      },
      {
        id: 's3t4', title: '目标院校调研', icon: '🏛️',
        priority: 'medium',
        detail: {
          value: '提前调研目标院校，建立目标清单，后续申请时有的放矢。',
          data: '有明确目标院校的同学，申请材料更有针对性，录取率高20%。',
          links: ['🔗 985高校保研门槛汇总', '🔗 导师评价查询'],
          tip: '按冲刺/稳妥/保底三级分类，每个级别至少选2-3所。'
        },
        subs: [
          { id: 's3t4s1', text: '列出10-15所目标院校清单', time: '9月' },
          { id: 's3t4s2', text: '查看各校往年夏令营通知和要求', time: '10月' },
          { id: 's3t4s3', text: '关注目标导师的论文和项目', time: '10-11月' },
          { id: 's3t4s4', text: '按冲刺/稳妥/保底分类目标院校', time: '12月' }
        ]
      }
    ]
  },
  '大二下': {
    icon: '📝',
    title: '成果产出 + 夏令营准备',
    desc: '整理科研成果，完善申请材料，准备夏令营',
    tasks: [
      {
        id: 's4t1', title: '论文撰写/投稿', icon: '📄',
        priority: 'urgent',
        detail: {
          value: '有论文（哪怕是二作、三作）在投或已录用，是夏令营的巨大优势。',
          data: '有论文在投的同学，夏令营录取率提升35%。',
          links: ['🔗 学术期刊投稿指南', '🔗 论文润色工具'],
          tip: '尽早动手写，初稿比完美稿更重要，可以反复修改。'
        },
        subs: [
          { id: 's4t1s1', text: '整理实验数据和文献', time: '2月' },
          { id: 's4t1s2', text: '完成论文初稿', time: '3月' },
          { id: 's4t1s3', text: '导师审阅并修改', time: '4月' },
          { id: 's4t1s4', text: '投稿至目标期刊/会议', time: '5月' }
        ]
      },
      {
        id: 's4t2', title: '竞赛冲刺国奖', icon: '🥇',
        priority: 'high',
        detail: {
          value: '国家级竞赛奖项是保研的硬通货，含金量极高。',
          data: '国奖获得者几乎100%能拿到至少一所985院校的优营。',
          links: ['🔗 竞赛获奖保研加分对照表', '🔗 答辩技巧'],
          tip: '答辩时注意逻辑清晰、PPT简洁，突出自己的贡献。'
        },
        subs: [
          { id: 's4t2s1', text: '报名参加省级/国家级竞赛', time: '3月' },
          { id: 's4t2s2', text: '团队集中备赛', time: '3-5月' },
          { id: 's4t2s3', text: '参加竞赛答辩/展示', time: '5月' },
          { id: 's4t2s4', text: '获得省级以上奖项', time: '6月' }
        ]
      },
      {
        id: 's4t3', title: '简历与个人陈述', icon: '✍️',
        priority: 'high',
        detail: {
          value: '一份好的简历是夏令营申请的门面，需要反复打磨。',
          data: '导师审阅一份简历平均只用30秒，必须一页纸突出亮点。',
          links: ['🔗 保研简历模板', '🔗 个人陈述范文'],
          tip: '简历按倒序排列，重点突出科研和竞赛，绩点放在显眼位置。'
        },
        subs: [
          { id: 's4t3s1', text: '整理大学所有经历和成果', time: '2月' },
          { id: 's4t3s2', text: '撰写初版简历（一页纸）', time: '3月' },
          { id: 's4t3s3', text: '请学长学姐/导师帮忙修改', time: '4月' },
          { id: 's4t3s4', text: '撰写个人陈述初稿（800-1000字）', time: '5月' }
        ]
      },
      {
        id: 's4t4', title: '联系推荐人', icon: '📩',
        priority: 'medium',
        detail: {
          value: '推荐信是夏令营申请的必需材料，需要提前准备。',
          data: '好的推荐信能弥补GPA或英语的短板，起到画龙点睛的作用。',
          links: ['🔗 推荐信写作指南', '🔗 推荐信模板'],
          tip: '推荐人最好是有科研合作的导师和教过你的专业课教授。'
        },
        subs: [
          { id: 's4t4s1', text: '确定2位推荐人（科研导师+专业课老师）', time: '3月' },
          { id: 's4t4s2', text: '准备推荐信素材清单', time: '4月' },
          { id: 's4t4s3', text: '提前1个月联系推荐人', time: '4月' },
          { id: 's4t4s4', text: '确认推荐信签字完成', time: '5月' }
        ]
      }
    ]
  },
  '大三上': {
    icon: '🚀',
    title: '材料冲刺 + 套磁导师',
    desc: '完善全部申请材料，主动联系目标导师',
    tasks: [
      {
        id: 's5t1', title: '申请材料终审', icon: '📂',
        priority: 'urgent',
        detail: {
          value: '夏令营申请材料包括：简历、个人陈述、成绩单、推荐信、获奖证书等。',
          data: '材料齐全且规范的同学，初审通过率比临时准备者高50%。',
          links: ['🔗 夏令营申请材料清单', '🔗 成绩单办理指南'],
          tip: '准备一个文件夹统一管理所有材料电子版，方便快速投递。'
        },
        subs: [
          { id: 's5t1s1', text: '教务处开具官方成绩单', time: '9月' },
          { id: 's5t1s2', text: '整理所有获奖证书扫描件', time: '9月' },
          { id: 's5t1s3', text: '更新简历（加入最新成果）', time: '10月' },
          { id: 's5t1s4', text: '精修个人陈述至终稿', time: '10月' },
          { id: 's5t1s5', text: '建立材料投递追踪表', time: '11月' }
        ]
      },
      {
        id: 's5t2', title: '套磁目标导师', icon: '📧',
        priority: 'urgent',
        detail: {
          value: '套磁邮件是联系心仪导师的第一步，写得好能直接获得面试机会。',
          data: '成功套磁的同学在夏令营中被录取的概率提高30%。',
          links: ['🔗 套磁邮件模板', '🔗 导师回复话术'],
          tip: '套磁邮件控制在300字以内：你是谁+为什么选这位导师+你的优势。'
        },
        subs: [
          { id: 's5t2s1', text: '确定10位以上目标导师', time: '9月' },
          { id: 's5t2s2', text: '阅读每位导师近3年的论文', time: '9-10月' },
          { id: 's5t2s3', text: '撰写个性化套磁邮件', time: '10月' },
          { id: 's5t2s4', text: '分批发送（每周3-5封）', time: '10-11月' },
          { id: 's5t2s5', text: '跟进回复并记录反馈', time: '11-12月' }
        ]
      },
      {
        id: 's5t3', title: '面试模拟训练', icon: '🎤',
        priority: 'high',
        detail: {
          value: '夏令营面试包括专业面和英语面，充分准备是成功的关键。',
          data: '经过3次以上模拟面试的同学，正式面试表现平均提升20%。',
          links: ['🔗 面试常见问题200问', '🔗 英语面试口语模板'],
          tip: '重点准备：自我介绍、科研经历讲述、专业知识问答、英语自我介绍。'
        },
        subs: [
          { id: 's5t3s1', text: '准备中英文自我介绍（3分钟版）', time: '9月' },
          { id: 's5t3s2', text: '整理可能被问到的专业问题', time: '10月' },
          { id: 's5t3s3', text: '找同学进行至少3次模拟面试', time: '10-11月' },
          { id: 's5t3s4', text: '录像复盘，改进表达和仪态', time: '11月' }
        ]
      },
      {
        id: 's5t4', title: '夏令营信息跟踪', icon: '📢',
        priority: 'high',
        detail: {
          value: '夏令营通知通常在3-5月发布，需要第一时间关注并投递。',
          data: '热门院校夏令营申请截止时间很早，错过就失去机会。',
          links: ['🔗 夏令营通知汇总网站', '🔗 保研信息公众号'],
          tip: '建议设置Google Alert或关注5个以上保研信息源。'
        },
        subs: [
          { id: 's5t4s1', text: '关注各校研究生院官网', time: '9月起' },
          { id: 's5t4s2', text: '加入保研信息群/关注公众号', time: '9月' },
          { id: 's5t4s3', text: '建立申请时间节点日历', time: '10月' },
          { id: 's5t4s4', text: '提前准备好网申系统账号', time: '11月' }
        ]
      }
    ]
  },
  '大三下': {
    icon: '🌟',
    title: '夏令营投递 + 参营冲刺',
    desc: '集中投递夏令营申请，参加面试争取优营',
    tasks: [
      {
        id: 's6t1', title: '夏令营集中投递', icon: '📮',
        priority: 'urgent',
        detail: {
          value: '3-5月是夏令营投递高峰期，需要高效管理多个申请。',
          data: '平均每位保研成功者投递6-10所院校，拿到2-4个offer。',
          links: ['🔗 夏令营投递进度追踪表', '🔗 网申填写注意事项'],
          tip: '投递策略：冲刺2所+稳妥3所+保底2所，分散风险。'
        },
        subs: [
          { id: 's6t1s1', text: '3月前确认投递清单', time: '2月' },
          { id: 's6t1s2', text: '按截止日期排序，逐一投递', time: '3-5月' },
          { id: 's6t1s3', text: '提交材料后确认收到回执', time: '3-5月' },
          { id: 's6t1s4', text: '记录每所院校的申请状态', time: '3-5月' }
        ]
      },
      {
        id: 's6t2', title: '笔试专项复习', icon: '📖',
        priority: 'urgent',
        detail: {
          value: '部分985院校夏令营有笔试环节，考察专业基础课。',
          data: '有笔试的院校淘汰率约30%，提前准备是必要的。',
          links: ['🔗 夏令营笔试真题汇总', '🔗 专业课速成指南'],
          tip: '重点复习目标院校指定教材的核心章节和历年考题。'
        },
        subs: [
          { id: 's6t2s1', text: '收集目标院校笔试往年真题', time: '3月' },
          { id: 's6t2s2', text: '制定专业课复习计划', time: '3月' },
          { id: 's6t2s3', text: '完成核心专业课全面复习', time: '4-5月' },
          { id: 's6t2s4', text: '做5套以上模拟题', time: '5月' }
        ]
      },
      {
        id: 's6t3', title: '参加夏令营面试', icon: '🎓',
        priority: 'urgent',
        detail: {
          value: '面试是夏令营的核心环节，决定能否拿到优营。',
          data: '面试准备充分的同学，优营获取率高达70%以上。',
          links: ['🔗 面试经验帖合集', '🔗 英语面试技巧'],
          tip: '面试当天注意着装得体、提前到场、保持自信微笑。'
        },
        subs: [
          { id: 's6t3s1', text: '收到入营通知后确认参加', time: '6月' },
          { id: 's6t3s2', text: '针对性准备该校面试', time: '6-7月' },
          { id: 's6t3s3', text: '参加夏令营笔试和面试', time: '6-8月' },
          { id: 's6t3s4', text: '面试后记录题目和经验', time: '7-8月' }
        ]
      },
      {
        id: 's6t4', title: '优营决策与复盘', icon: '✅',
        priority: 'high',
        detail: {
          value: '拿到优营后需要在规定时间内决定接受或放弃。',
          data: '优营有效期通常到9月底，部分院校需要及时确认。',
          links: ['🔗 优营接受/放弃决策指南', '🔗 多offer选择策略'],
          tip: '如果拿到多个优营，综合考虑导师、城市、学校排名、研究方向。'
        },
        subs: [
          { id: 's6t4s1', text: '汇总所有获得的优营', time: '8月' },
          { id: 's6t4s2', text: '对比各优营院校的优劣势', time: '8月' },
          { id: 's6t4s3', text: '咨询导师和学长学姐的意见', time: '8月' },
          { id: 's6t4s4', text: '做出初步选择并确认', time: '8月底' }
        ]
      }
    ]
  },
  '大四上': {
    icon: '🎓',
    title: '九推兜底 + 确认录取',
    desc: '完成推免系统填报，确认最终录取',
    tasks: [
      {
        id: 's7t1', title: '教育部推免系统填报', icon: '🖥️',
        priority: 'urgent',
        detail: {
          value: '推免系统是官方录取通道，必须在规定时间内完成填报。',
          data: '每年都有同学因错过填报时间而失去录取资格。',
          links: ['🔗 推免系统操作指南', '🔗 推免系统常见问题FAQ'],
          tip: '系统一般在9月下旬开放，提前准备好学信网账号和材料。'
        },
        subs: [
          { id: 's7t1s1', text: '注册/登录学信网推免系统', time: '9月中' },
          { id: 's7t1s2', text: '填写个人信息并上传材料', time: '9月中' },
          { id: 's7t1s3', text: '填报3个志愿（注意顺序）', time: '9月下旬' },
          { id: 's7t1s4', text: '确认提交并等待审核', time: '9月下旬' }
        ]
      },
      {
        id: 's7t2', title: '九推复试（兜底）', icon: '🔄',
        priority: 'high',
        detail: {
          value: '如果夏令营未拿到满意offer，九推是最后的上岸机会。',
          data: '每年约20%的保研名额通过九推补录。',
          links: ['🔗 九推院校汇总', '🔗 九推复试经验帖'],
          tip: '九推节奏很快，需要提前准备好材料，保持关注。'
        },
        subs: [
          { id: 's7t2s1', text: '关注九推院校补录信息', time: '9月' },
          { id: 's7t2s2', text: '快速投递九推申请', time: '9月' },
          { id: 's7t2s3', text: '参加九推面试', time: '9-10月' },
          { id: 's7t2s4', text: '获得拟录取通知', time: '9-10月' }
        ]
      },
      {
        id: 's7t3', title: '确认最终录取', icon: '🎉',
        priority: 'urgent',
        detail: {
          value: '接受拟录取后不可更改，需要慎重决策。',
          data: '确认录取后即可安心准备研究生阶段的学习计划。',
          links: ['🔗 录取确认注意事项', '🔗 保研后规划建议'],
          tip: '确认前与导师充分沟通研究方向和培养计划。'
        },
        subs: [
          { id: 's7t3s1', text: '在系统内接受拟录取', time: '10月' },
          { id: 's7t3s2', text: '与导师沟通入学前准备', time: '10月' },
          { id: 's7t3s3', text: '完成本科毕业论文/设计', time: '11月-次年5月' },
          { id: 's7t3s4', text: '制定研究生阶段学习计划', time: '12月' }
        ]
      },
      {
        id: 's7t4', title: '经验传承', icon: '🤝',
        priority: 'low',
        detail: {
          value: '将保研经验分享给学弟学妹，既帮助他人也能巩固自己的成长。',
          data: '保研成功的同学中，90%都曾受到学长学姐的帮助。',
          links: ['🔗 如何写保研经验帖', '🔗 保研社群推荐'],
          tip: '你的经验可能就是学弟学妹保研路上的关键指引。'
        },
        subs: [
          { id: 's7t4s1', text: '整理保研全过程经验', time: '10月' },
          { id: 's7t4s2', text: '撰写保研经验帖分享', time: '11月' },
          { id: 's7t4s3', text: '加入保研社群帮助学弟学妹', time: '12月' },
          { id: 's7t4s4', text: '推荐学弟学妹联系自己的导师', time: '12月' }
        ]
      }
    ]
  }
};

// 兼容旧函数：保留timelineData名称映射，供renderRoadmap使用
const timelineData = {};
Object.keys(taskTreeData).forEach(sem => {
  timelineData[sem] = {
    title: taskTreeData[sem].title,
    desc: taskTreeData[sem].desc,
    tags: taskTreeData[sem].tasks.map(t => t.icon + t.title.slice(0,4)),
    detail: {
      suggest: taskTreeData[sem].tasks.map(t => t.detail.tip).join('；'),
      items: taskTreeData[sem].tasks.flatMap(t => t.subs.map(s => s.text)),
      links: taskTreeData[sem].tasks.flatMap(t => (t.detail.links||[]).map(l => ({ text: l, url: '#' })))
    }
  };
});

/* ===== 已完成任务存储（localStorage持久化） ===== */
let checkedTasks = {};
try {
  const saved = localStorage.getItem('by_checkedTasks');
  if (saved) checkedTasks = JSON.parse(saved);
} catch(e) {}

function saveCheckedTasks() {
  try { localStorage.setItem('by_checkedTasks', JSON.stringify(checkedTasks)); } catch(e) {}
}

/* ===== 动态规划引擎 ===== */
function getPersonalizedTaskTree() {
  // 深拷贝任务树数据
  const tree = JSON.parse(JSON.stringify(taskTreeData));
  const grade = getRadioValue('gradeGroup'); // "大一"/"大二"/"大三"
  const gpa = parseFloat(document.getElementById('inputGpa').value) || 0;
  const rank = document.getElementById('inputRank').value;
  const research = document.getElementById('inputResearch').value;
  const competition = document.getElementById('inputCompetition').value;
  const english = document.getElementById('inputEnglish').value;
  const major = document.getElementById('inputMajor').value.trim();
  const classType = getRadioValue('classGroup');
  const targets = getMultiValues('targetGroup');

  // 确定当前学期和过期学期
  const allSems = ['大一上','大一下','大二上','大二下','大三上','大三下','大四上'];
  let currentIdx = grade === '大一' ? 0 : grade === '大二' ? 2 : 4;
  // 根据当前月份微调（假设当前是大三上学期，如果是9-1月则是上学期）
  const month = new Date().getMonth() + 1;
  if (month >= 2 && month <= 7) currentIdx += 1; // 下学期

  // 标记过期任务
  for (let i = 0; i < currentIdx; i++) {
    const sem = allSems[i];
    if (!tree[sem]) continue;
    tree[sem].expired = true;
    tree[sem].tasks.forEach(task => {
      task.subs.forEach(sub => { sub.expired = true; });
    });
  }

  // 根据绩点调整优先级
  if (gpa > 0 && gpa < 3.0) {
    // 低绩点：提高课程类任务优先级
    ['大一上','大一下','大二上','大二下'].forEach(sem => {
      if (!tree[sem]) return;
      tree[sem].tasks.forEach(task => {
        if (task.title.includes('课程') || task.title.includes('绩点') || task.title.includes('巩固')) {
          task.priority = 'urgent';
        }
      });
    });
  }

  // 根据科研经历调整
  if (research === '有论文发表') {
    // 已有论文：降低基础科研任务优先级
    ['大一下','大二上','大二下'].forEach(sem => {
      if (!tree[sem]) return;
      tree[sem].tasks.forEach(task => {
        if (task.title.includes('初步接触') || task.title.includes('科研深化')) {
          task.priority = 'low';
        }
      });
    });
    // 在大二下添加论文传播任务
    if (tree['大二下']) {
      tree['大二下'].tasks.push({
        id: 's4t_extra1', title: '论文推广与影响力', icon: '📢',
        priority: 'medium',
        detail: {
          value: '已有论文发表，可以进一步扩大影响力。',
          data: '在学术会议上做报告可大幅提升导师印象。',
          links: ['🔗 学术会议投稿', '🔗 ResearchGate注册'],
          tip: '可以在实验室组会或校级学术会议上做报告。'
        },
        subs: [
          { id: 's4_ex1', text: '在ResearchGate/Zotero上建立学术主页', time: '2月' },
          { id: 's4_ex2', text: '投稿学术会议做口头报告', time: '3-5月' }
        ]
      });
    }
  } else if (research === '无') {
    // 无科研：在大一下添加科研入门提醒
    if (tree['大一下']) {
      tree['大一下'].tasks.forEach(task => {
        if (task.title.includes('初步接触')) task.priority = 'urgent';
      });
    }
  }

  // 根据竞赛经历调整
  if (competition === '国奖') {
    // 已有国奖：降低基础竞赛任务优先级
    ['大二上','大二下'].forEach(sem => {
      if (!tree[sem]) return;
      tree[sem].tasks.forEach(task => {
        if (task.title.includes('竞赛') && task.title.includes('冲刺')) {
          task.priority = 'medium';
        }
      });
    });
  } else if (competition === '无') {
    // 无竞赛：提高竞赛任务优先级
    if (tree['大一下']) {
      tree['大一下'].tasks.forEach(task => {
        if (task.title.includes('竞赛')) task.priority = 'high';
      });
    }
  }

  // 根据英语成绩调整
  if (english === '四级未过') {
    if (tree['大一上']) {
      tree['大一上'].tasks.forEach(task => {
        if (task.title.includes('四级')) task.priority = 'urgent';
      });
    }
  } else if (english === '六级600+' || english === '雅思7+/托福100+') {
    // 英语已达标：降低英语任务优先级
    ['大一上','大一下','大二上'].forEach(sem => {
      if (!tree[sem]) return;
      tree[sem].tasks.forEach(task => {
        if (task.title.includes('英语') || task.title.includes('六级') || task.title.includes('雅思')) {
          task.priority = 'low';
        }
      });
    });
  }

  // 根据特殊班级添加专属任务
  if (classType === '强基计划') {
    if (tree['大三上']) {
      tree['大三上'].tasks.push({
        id: 's5t_qiangji', title: '强基计划转段考核', icon: '⭐',
        priority: 'urgent',
        detail: {
          value: '强基计划需要在大三完成转段考核，通过后方可进入研究生阶段。',
          data: '强基转段考核通过率通常较高，但仍需认真准备。',
          links: ['🔗 强基计划转段政策', '🔗 转段考核经验'],
          tip: '重点准备：学年论文、学术报告、综合面试。'
        },
        subs: [
          { id: 's5_qj1', text: '了解本校强基转段具体要求', time: '9月' },
          { id: 's5_qj2', text: '准备学年论文或研究报告', time: '10月' },
          { id: 's5_qj3', text: '参加转段面试', time: '11-12月' }
        ]
      });
    }
  } else if (classType === '拔尖基地' || classType === '实验班' || classType === '基地班') {
    // 特殊班级通常有额外的学术要求
    if (tree['大二上']) {
      tree['大二上'].tasks.push({
        id: 's3t_special', title: '特殊班级年度考核', icon: '📋',
        priority: 'high',
        detail: {
          value: '拔尖基地/实验班/基地班通常有年度考核或分流机制。',
          data: '通过考核才能留在特殊班级，享受保研率倾斜。',
          links: ['🔗 考核细则查询', '🔗 学长考核经验'],
          tip: '重点关注考核标准和分流比例，提前准备。'
        },
        subs: [
          { id: 's3_sp1', text: '了解本班年度考核标准', time: '9月' },
          { id: 's3_sp2', text: '准备考核材料（成绩+科研+竞赛）', time: '10月' },
          { id: 's3_sp3', text: '通过考核/面试', time: '12月' }
        ]
      });
    }
  }

  // 根据目标院校类型添加专属建议
  if (targets.includes('顶尖985') || targets.includes('中科院所')) {
    if (tree['大三上']) {
      tree['大三上'].tasks.push({
        id: 's5t_top985', title: '顶尖院校专项准备', icon: '👑',
        priority: 'urgent',
        detail: {
          value: '冲刺顶尖985/中科院所需要更强的学术背景和面试表现。',
          data: '顶尖985夏令营优营率通常在10-20%，竞争极为激烈。',
          links: ['🔗 顶尖985夏令营分析', '🔗 中科院所申请指南'],
          tip: '建议提前发表至少一篇论文，六级600+，并有国家级竞赛奖项。'
        },
        subs: [
          { id: 's5_top1', text: '确保至少一篇论文在投/已录用', time: '9月' },
          { id: 's5_top2', text: '六级冲刺600+或雅思7+', time: '12月' },
          { id: 's5_top3', text: '准备英文面试（部分顶尖院校全英面试）', time: '10月' },
          { id: 's5_top4', text: '联系2位以上目标导师', time: '10-11月' }
        ]
      });
    }
  }

  return tree;
}

/* ===== 覆盖原有generateTimeline ===== */
function generateTimeline(grade) {
  const allSemesters = ['大一上','大一下','大二上','大二下','大三上','大三下','大四上'];
  const gradeVal = typeof grade === 'string' ? grade : (grade === 1 ? '大一' : grade === 2 ? '大二' : '大三');
  const startIdx = gradeVal === '大一' ? 0 : gradeVal === '大二' ? 2 : 4;
  return allSemesters.slice(startIdx);
}

/* ===== 任务树渲染 ===== */
function renderTaskTree(treeData) {
  const container = document.getElementById('taskTreeContainer');
  if (!container) return;
  container.innerHTML = '';

  const grade = getRadioValue('gradeGroup');
  const titles = { '大一': '四年保研深度规划', '大二': '保研冲刺深度规划', '大三': '保研冲刺深度规划' };
  document.getElementById('timelineTitle').textContent = titles[grade] || '深度规划';

  Object.keys(treeData).forEach((semKey, semIdx) => {
    const sem = treeData[semKey];
    // 计算学期进度
    const totalSubs = sem.tasks.reduce((acc, t) => acc + t.subs.length, 0);
    const doneSubs = sem.tasks.reduce((acc, t) => acc + t.subs.filter(s => checkedTasks[s.id]).length, 0);
    const pct = totalSubs > 0 ? Math.round(doneSubs / totalSubs * 100) : 0;

    // 进度环颜色
    const ringColor = pct >= 100 ? '#10B981' : pct >= 70 ? '#F59E0B' : pct >= 30 ? '#3B82F6' : '#EF4444';
    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (pct / 100) * circumference;

    let html = `<div class="task-semester${pct >= 100 ? ' completed' : ''}" id="sem_${semKey}">
      <div class="task-semester-header" onclick="toggleSemester('sem_${semKey}')">
        <div class="task-progress-ring">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle class="ring-bg" cx="22" cy="22" r="18"/>
            <circle class="ring-fill" cx="22" cy="22" r="18" stroke="${ringColor}"
              stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
          </svg>
          <div class="ring-text">${pct}%</div>
        </div>
        <div class="task-semester-icon">${sem.icon}</div>
        <div class="task-semester-info">
          <div class="task-semester-title">${semKey} · ${sem.title}</div>
          <div class="task-semester-desc">${sem.desc}${sem.expired ? '（已过期）' : ''}</div>
        </div>
        <div class="task-semester-toggle">▼</div>
      </div>`;

    // 主任务列表
    sem.tasks.forEach(task => {
      const badgeCls = 'badge-' + task.priority;
      const badgeText = { urgent: '紧急', high: '重要', medium: '一般', low: '可选' }[task.priority] || '';
      // 主任务完成度
      const taskDone = task.subs.filter(s => checkedTasks[s.id]).length;
      const taskTotal = task.subs.length;

      html += `<div class="task-main" id="task_${task.id}">
        <div class="task-main-header" onclick="toggleTask('task_${task.id}')">
          <span class="task-main-icon">${task.icon}</span>
          <span class="task-main-title">${task.title} <span style="font-size:0.75rem;color:#64748B">(${taskDone}/${taskTotal})</span></span>
          <span class="task-main-badge ${badgeCls}">${badgeText}</span>
          <span class="task-main-toggle">▼</span>
        </div>
        <div class="task-sub-list">`;

      task.subs.forEach(sub => {
        const isExpired = sub.expired ? ' expired' : '';
        const isChecked = checkedTasks[sub.id] ? ' checked' : '';
        const checkMark = checkedTasks[sub.id] ? '✓' : '';
        html += `<div class="task-sub-item${isChecked}${isExpired}" onclick="toggleSubTask('${sub.id}','${task.id}')">
          <div class="task-sub-check">${checkMark}</div>
          <span class="task-sub-text">${sub.text}</span>
          <span class="task-sub-time">${sub.time || ''}</span>
        </div>`;
      });

      html += `</div>
        <div class="task-detail">
          <div class="task-detail-item"><span class="task-detail-label">价值：</span><span>${task.detail.value}</span></div>
          <div class="task-detail-item"><span class="task-detail-label">数据：</span><span>${task.detail.data}</span></div>
          <div class="task-detail-item"><span class="task-detail-label">建议：</span><span>${task.detail.tip}</span></div>
          ${(task.detail.links || []).map(l => `<div class="task-detail-item"><span class="task-detail-link">${l}</span></div>`).join('')}
        </div>
      </div>`;
    });

    html += '</div>';
    container.innerHTML += html;
  });

  // 更新进度追踪
  updateProgressTracker(treeData);
  // 渲染成就
  renderAchievements(treeData);
  // 初始化对话模式
  initChat();
}

/* ===== 学期展开/收起 ===== */
function toggleSemester(semId) {
  const el = document.getElementById(semId);
  if (el) el.classList.toggle('open');
}

/* ===== 主任务展开/收起 ===== */
function toggleTask(taskId) {
  const el = document.getElementById(taskId);
  if (el) el.classList.toggle('open');
}

/* ===== 子任务勾选 ===== */
function toggleSubTask(subId, taskId) {
  checkedTasks[subId] = checkedTasks[subId] ? false : true;
  saveCheckedTasks();

  // 刷新整个任务树（简单可靠）
  const tree = getPersonalizedTaskTree();
  renderTaskTree(tree);

  // 检查成就
  checkAchievementUnlock();

  // 滚动到当前任务位置
  const taskEl = document.getElementById('task_' + taskId);
  if (taskEl) {
    const semEl = taskEl.closest('.task-semester');
    if (semEl && !semEl.classList.contains('open')) semEl.classList.add('open');
    if (!taskEl.classList.contains('open')) taskEl.classList.add('open');
    taskEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* ===== 进度追踪更新 ===== */
function updateProgressTracker(treeData) {
  let total = 0, done = 0;
  Object.values(treeData).forEach(sem => {
    sem.tasks.forEach(task => {
      task.subs.forEach(sub => {
        total++;
        if (checkedTasks[sub.id]) done++;
      });
    });
  });

  const pct = total > 0 ? Math.round(done / total * 100) : 0;
  // 同年级平均进度估算（基于年级）
  const grade = getRadioValue('gradeGroup');
  const avgMap = { '大一': 8, '大二': 25, '大三': 55 };
  const avgPct = avgMap[grade] || 15;
  const ahead = Math.max(0, pct - avgPct);

  const fillEl = document.getElementById('trackerFill');
  const doneEl = document.getElementById('trackerDone');
  const totalEl = document.getElementById('trackerTotal');
  const aheadEl = document.getElementById('trackerAhead');
  if (fillEl) fillEl.style.width = pct + '%';
  if (doneEl) doneEl.textContent = done;
  if (totalEl) totalEl.textContent = total;
  if (aheadEl) aheadEl.textContent = ahead;

  // 延迟动画效果
  setTimeout(() => {
    if (fillEl) fillEl.style.width = pct + '%';
  }, 300);
}

/* ===== 成就系统 ===== */
const achievementList = [
  { id: 'ach_1', icon: '🌱', name: '保研萌新', desc: '完成第一个子任务', check: (t, c) => Object.keys(c).filter(k => c[k]).length >= 1 },
  { id: 'ach_2', icon: '📚', name: '学习达人', desc: '完成5个学习相关任务', check: (t, c) => Object.keys(c).filter(k => c[k] && (k.includes('s1t1') || k.includes('s2t1') || k.includes('s3t1'))).length >= 5 },
  { id: 'ach_3', icon: '🇬🇧', name: '英语先锋', desc: '完成所有英语相关任务', check: (t, c) => ['s1t2s1','s1t2s2','s1t2s3','s1t2s4','s2t2s1','s2t2s2','s2t2s3','s2t2s4'].every(k => c[k]) },
  { id: 'ach_4', icon: '🔬', name: '科研新星', desc: '完成3个科研任务', check: (t, c) => Object.keys(c).filter(k => c[k] && (k.includes('s2t3') || k.includes('s3t1') || k.includes('s4t1'))).length >= 3 },
  { id: 'ach_5', icon: '🏆', name: '竞赛王者', desc: '完成所有竞赛相关任务', check: (t, c) => Object.keys(c).filter(k => c[k] && (k.includes('s2t4') || k.includes('s3t2') || k.includes('s4t2'))).length >= 6 },
  { id: 'ach_6', icon: '📊', name: '规划大师', desc: '完成总任务数的50%', check: (t, c) => { let total=0; Object.values(t).forEach(s=>s.tasks.forEach(tk=>tk.subs.forEach(()=>total++))); return Object.keys(c).filter(k=>c[k]).length >= total*0.5; } },
  { id: 'ach_7', icon: '🎯', name: '学期全清', desc: '完成任意一个学期的全部任务', check: (t, c) => { for(const sem of Object.values(t)) { if(sem.tasks.every(tk=>tk.subs.every(s=>c[s.id]))) return true; } return false; } },
  { id: 'ach_8', icon: '🚀', name: '保研就绪', desc: '完成总任务数的80%', check: (t, c) => { let total=0; Object.values(t).forEach(s=>s.tasks.forEach(tk=>tk.subs.forEach(()=>total++))); return Object.keys(c).filter(k=>c[k]).length >= total*0.8; } }
];

let unlockedAchievements = [];
try {
  const saved = localStorage.getItem('by_achievements');
  if (saved) unlockedAchievements = JSON.parse(saved);
} catch(e) {}

function saveAchievements() {
  try { localStorage.setItem('by_achievements', JSON.stringify(unlockedAchievements)); } catch(e) {}
}

function renderAchievements(treeData) {
  const grid = document.getElementById('achievementGrid');
  if (!grid) return;
  grid.innerHTML = '';
  achievementList.forEach(ach => {
    const isUnlocked = unlockedAchievements.includes(ach.id);
    grid.innerHTML += `<div class="achievement-card${isUnlocked ? ' unlocked' : ''}" title="${ach.desc}">
      <div class="achievement-icon">${ach.icon}</div>
      <div class="achievement-name">${ach.name}</div>
    </div>`;
  });
}

function checkAchievementUnlock() {
  const tree = taskTreeData; // 用原始数据检查
  achievementList.forEach(ach => {
    if (unlockedAchievements.includes(ach.id)) return;
    if (ach.check(tree, checkedTasks)) {
      unlockedAchievements.push(ach.id);
      saveAchievements();
      showAchievementPopup(ach);
    }
  });
}

function showAchievementPopup(ach) {
  // 创建弹窗
  let popup = document.getElementById('achievementPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'achievementPopup';
    popup.className = 'achievement-popup';
    document.body.appendChild(popup);
  }
  popup.innerHTML = `<div class="achievement-popup-icon">${ach.icon}</div>
    <div class="achievement-popup-text">成就解锁！</div>
    <div class="achievement-popup-sub">${ach.name} - ${ach.desc}</div>`;
  // 显示动画
  setTimeout(() => popup.classList.add('show'), 50);
  setTimeout(() => popup.classList.remove('show'), 3000);
  // 同时刷新成就展示
  const grid = document.getElementById('achievementGrid');
  if (grid) renderAchievements(taskTreeData);
}

/* ===== 对话模式（规则引擎） ===== */
function initChat() {
  const presetsEl = document.getElementById('chatPresets');
  if (!presetsEl || presetsEl.children.length > 0) return;

  const presets = [
    '我的短板怎么补？', '现在开始还来得及吗？',
    '如何联系导师？', '夏令营怎么准备？',
    '六级怎么刷分？', '竞赛选哪个好？'
  ];
  presets.forEach(q => {
    const btn = document.createElement('span');
    btn.className = 'plan-chat-preset';
    btn.textContent = q;
    btn.onclick = () => {
      document.getElementById('chatInput').value = q;
      sendChat();
    };
    presetsEl.appendChild(btn);
  });

  // 初始欢迎语
  const history = document.getElementById('chatHistory');
  if (history && history.children.length === 0) {
    history.innerHTML += `<div class="plan-chat-msg plan-chat-msg-bot">
      <div class="msg-bubble">你好！我是你的保研规划助手。你可以问我任何关于保研准备的问题，也可以点击上方快捷按钮查看建议。</div>
    </div>`;
  }
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const history = document.getElementById('chatHistory');
  const question = input.value.trim();
  if (!question) return;
  input.value = '';

  // 用户消息
  history.innerHTML += `<div class="plan-chat-msg plan-chat-msg-user">
    <div class="msg-bubble">${escapeHtml(question)}</div>
  </div>`;

  // 打字指示器
  history.innerHTML += `<div class="plan-chat-msg plan-chat-msg-bot" id="typingMsg">
    <div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>
  </div>`;
  history.scrollTop = history.scrollHeight;

  // 模拟延迟回复
  setTimeout(() => {
    const typingEl = document.getElementById('typingMsg');
    if (typingEl) typingEl.remove();

    const answer = generateChatReply(question);
    history.innerHTML += `<div class="plan-chat-msg plan-chat-msg-bot">
      <div class="msg-bubble">${answer}</div>
    </div>`;
    history.scrollTop = history.scrollHeight;
  }, 800 + Math.random() * 700);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function generateChatReply(question) {
  // 获取用户数据
  const grade = getRadioValue('gradeGroup');
  const gpa = parseFloat(document.getElementById('inputGpa').value) || 0;
  const rank = document.getElementById('inputRank').value;
  const research = document.getElementById('inputResearch').value;
  const competition = document.getElementById('inputCompetition').value;
  const english = document.getElementById('inputEnglish').value;
  const targets = getMultiValues('targetGroup');
  const school = document.getElementById('inputSchool').value.trim();

  const q = question.toLowerCase();

  // 短板相关
  if (q.includes('短板') || q.includes('弱项') || q.includes('不足') || q.includes('补')) {
    const tips = [];
    if (gpa > 0 && gpa < 3.5) tips.push('你的绩点偏低，建议把重心放在核心课程上，每门课争取90+，GPA提升对保研排名影响最大。');
    if (rank === '30%以后' || rank === '不清楚') tips.push('排名信息很重要，建议尽快向辅导员/教务处了解自己的专业排名，明确差距。');
    if (research === '无' || research === '有意向') tips.push('科研经历薄弱，建议尽快联系导师进实验室，从文献阅读开始积累，哪怕没有论文也能在面试中谈论科研感悟。');
    if (competition === '无') tips.push('没有竞赛经历的话，推荐从数学建模或挑战杯入手，这些竞赛认可度高且组队门槛低。');
    if (english === '四级未过' || english === '四级通过') tips.push('英语是硬门槛，四级未过/刚过的同学需要加把劲，很多985院校要求六级500+。建议每天背单词+刷阅读。');
    if (tips.length === 0) tips.push('根据你的数据，各维度比较均衡。建议在你的中等偏弱维度上多投入20%的时间，争取补齐短板。');
    return tips.join('<br><br>');
  }

  // 来不来得及
  if (q.includes('来得及') || q.includes('还来得及') || q.includes('晚不晚') || q.includes('太晚') || q.includes('现在开始')) {
    const gradeMap = { '大一': '你现在才大一，完全来得及！保研准备越早越好，你有充足的时间来提升各方面。', '大二': '大二是保研准备的黄金期，完全来得及。关键是大二下之前要有明确的科研方向和成果产出。', '大三': '大三开始冲刺完全来得及，但需要高效规划时间。集中精力在科研/竞赛和夏令营准备上。' };
    const base = gradeMap[grade] || '只要开始行动就不晚，保研准备最重要的是有计划和执行力。';
    const extra = gpa > 0 && gpa < 3.0 ? '<br><br>不过你的绩点偏低，需要把提升绩点放在最高优先级，这是保研的硬指标。' : '';
    return base + extra;
  }

  // 联系导师
  if (q.includes('联系导师') || q.includes('套磁') || q.includes('找导师') || q.includes('导师')) {
    return `联系导师的技巧：<br><br>1. <b>选择时机</b>：大三上学期开始联系最合适，太早导师可能不回复，太晚名额已满。<br><br>2. <b>邮件内容</b>：300字以内，包含：你是谁+年级+学校+为什么选这位导师+你的科研/竞赛经历+附上简历。<br><br>3. <b>如何找导师</b>：去目标院校官网看导师主页，重点看近3年的论文和研究方向。<br><br>4. <b>跟进</b>：如果1周没回复可以再发一封，但不要超过2次。${targets.length > 0 ? '<br><br>你目标院校是' + targets.join('、') + '，建议优先关注这些院校的导师。' : ''}`;
  }

  // 夏令营
  if (q.includes('夏令营') || q.includes('参营') || q.includes('优营')) {
    return `夏令营申请全攻略：<br><br>1. <b>时间线</b>：3-5月发布通知，5-6月截止申请，6-8月举办夏令营。<br><br>2. <b>申请材料</b>：简历+个人陈述+成绩单+推荐信+获奖证书+科研/竞赛成果。<br><br>3. <b>投递策略</b>：冲刺2所+稳妥3所+保底2所。${targets.includes('顶尖985') ? '你的目标包含顶尖985，竞争激烈，建议多投几所。' : ''}<br><br>4. <b>面试准备</b>：专业基础+英语口语+科研经历讲述，至少模拟3次以上。<br><br>5. <b>优营</b>：拿到优秀营员基本等同于预录取，9月推免系统确认即可。`;
  }

  // 六级/英语
  if (q.includes('六级') || q.includes('英语') || q.includes('雅思') || q.includes('托福') || q.includes('刷分')) {
    const engTip = english === '四级未过' ? '你四级还没过，这是当务之急。先集中精力过四级（目标500+），然后立刻开始准备六级。' :
      english === '四级通过' ? '你四级已过，现在需要全力冲刺六级。目标550+，最好600+。' :
      english === '六级通过' ? '你六级已过，但可能分数不够高。建议刷分到550+，这对申请985院校很关键。' :
      english === '六级550+' ? '你六级550+，基础不错！建议冲刺600+，或者考虑雅思/托福。' :
      '你英语成绩已经很优秀，继续保持即可。如果目标是顶尖院校，可以再刷一次争取更高分数。';
    return `英语提升建议：<br><br>${engTip}<br><br><b>备考方法：</b><br>- 每天背50个单词（用墨墨/百词斩）<br>- 每周做2套阅读真题<br>- 每天听30分钟听力（VOA/BBC/真题）<br>- 写作每周练1篇，找同学互改<br>- 考前1个月集中刷真题`;
  }

  // 竞赛
  if (q.includes('竞赛') || q.includes('比赛') || q.includes('数学建模') || q.includes('数模')) {
    return `竞赛选择与准备：<br><br><b>高含金量竞赛推荐：</b><br>- 数学建模国赛/美赛（认可度最高）<br>- 挑战杯/互联网+（创新创业）<br>- ACM程序设计竞赛（计算机专业）<br>- 全国大学生英语竞赛<br>- 各专业学科竞赛（如电子设计、机械设计等）<br><br><b>备赛策略：</b><br>- 从校级比赛开始积累经验<br>- 3人组队最理想：建模+编程+写作<br>- 提前学习工具：LaTeX、Python/MATLAB<br>- 多看历年优秀获奖论文<br><br>${competition === '无' ? '你目前没有竞赛经历，建议从数学建模入手，认可度高且组队门槛低。' : competition === '校奖' ? '你已有校级奖项，建议冲击省级以上赛事。' : '你竞赛经历丰富，继续保持！可以考虑跨学科参赛。'}`;
  }

  // GPA/绩点
  if (q.includes('绩点') || q.includes('gpa') || q.includes('成绩') || q.includes('分数')) {
    const gpaTip = gpa > 0 ? `你当前GPA为${gpa.toFixed(1)}/5.0。` : '';
    const gpaAdvice = gpa > 4.0 ? '你的绩点非常高，保持住！' :
      gpa > 3.5 ? '绩点不错，但还有提升空间。建议在核心专业课上争取更高分。' :
      gpa > 3.0 ? '绩点中等，需要重点提升。每门课多投入2-3小时复习，目标每科90+。' :
      gpa > 0 ? '绩点偏低，这是当前最需要解决的问题。建议：每周学习时间提升到40小时以上，重点攻克数学和专业课。' : '';
    return `${gpaTip}${gpaAdvice}<br><br><b>绩点提升技巧：</b><br>- 课前预习30分钟，课后及时复习<br>- 建立错题本，考前重点复习<br>- 组建学习小组互相督促<br>- 选课时注意学分权重，高学分课优先拿高分<br>- 大一大二基础课学分高，对总体GPA影响大`;
  }

  // 科研
  if (q.includes('科研') || q.includes('论文') || q.includes('实验室') || q.includes('实验')) {
    const resTip = research === '无' ? '你目前没有科研经历，建议尽快开始。' :
      research === '有意向' ? '你有科研意向，迈出第一步很重要。' :
      research === '有经历' ? '你已有科研经历，建议争取产出论文。' :
      '你已有论文发表，这是巨大的优势！保持科研产出的同时，可以开始准备申请材料。';
    return `科研入门与提升：<br><br>${resTip}<br><br><b>科研路线图：</b><br>1. 联系导师 → 表达科研兴趣 → 争取进组学习<br>2. 学习文献检索（知网、Google Scholar）<br>3. 读20篇以上相关领域论文<br>4. 参与导师项目，承担具体任务<br>5. 独立完成一个小课题<br>6. 撰写论文初稿，经导师修改后投稿<br><br><b>注意：</b>科研重在过程，即使没有发表论文，在面试中能讲清楚科研过程也很有价值。`;
  }

  // 目标院校
  if (q.includes('目标') || q.includes('院校') || q.includes('学校') || q.includes('选校')) {
    const targetStr = targets.length > 0 ? targets.join('、') : '还没有明确目标';
    return `选校策略建议：<br><br>你目前的目标类型：${targetStr}<br><br><b>选校原则：</b><br>- 冲刺校（2-3所）：录取门槛略高于你当前水平<br>- 稳妥校（3-4所）：与你水平匹配<br>- 保底校（1-2所）：你有较大把握<br><br><b>考虑因素：</b><br>- 导师研究方向是否匹配<br>- 学校在该学科的排名<br>- 城市和就业前景<br>- 夏令营/九推的通过率<br><br>建议根据生成的报告中的院校推荐来细化你的申请清单。`;
  }

  // 默认回复
  return `关于"${escapeHtml(question)}"，这是一个好问题！<br><br>根据你的情况：${school ? '学校' + school + '，' : ''}${grade}年级${gpa > 0 ? '，GPA ' + gpa.toFixed(1) : ''}${research !== '无' ? '，有' + research : ''}。<br><br>你可以尝试问我更具体的问题，比如：<br>- "我的短板怎么补？"<br>- "六级怎么刷分？"<br>- "如何联系导师？"<br>- "夏令营怎么准备？"`;
}

/* ===== 覆盖原有renderTimeline ===== */
const _origRenderTimeline = typeof renderTimeline !== 'undefined' ? renderTimeline : null;
renderTimeline = function(semesters) {
  // 调用新的任务树系统
  const tree = getPersonalizedTaskTree();
  // 过滤出对应学期的数据
  const filteredTree = {};
  semesters.forEach(sem => {
    if (tree[sem]) filteredTree[sem] = tree[sem];
  });
  renderTaskTree(filteredTree);
};

// ==========================================
// 雷达图
// ==========================================
function renderRadarChart(scores, targetBaseline) {
  const ctx = document.getElementById('radarCanvas').getContext('2d');
  if (radarChartInstance) radarChartInstance.destroy();

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['绩点', '排名', '科研', '竞赛', '英语'],
      datasets: [
        {
          label: '当前水平',
          data: [scores.gpaS, scores.rankS, scores.resS, scores.compS, scores.engS],
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37,99,235,0.15)',
          borderWidth: 2,
          pointBackgroundColor: '#2563EB',
          pointRadius: 4
        },
        {
          label: '目标基线',
          data: targetBaseline,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239,68,68,0.08)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: '#EF4444',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      animation: { duration: 800 },
      scales: {
        r: {
          min: 0, max: 20,
          ticks: { stepSize: 5, color: '#64748B', backdropColor: 'transparent', font: { size: 10 } },
          grid: { color: '#E2E8F0' },
          angleLines: { color: '#E2E8F0' },
          pointLabels: { color: '#1E293B', font: { size: 13, weight: '600' } }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#64748B', font: { size: 12 }, usePointStyle: true, padding: 16 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              let grade = val >= 16 ? 'A级😊' : val >= 10 ? 'B级🙂' : 'C级💪';
              return context.dataset.label + ': ' + val + '分 (' + grade + ')';
            }
          }
        }
      }
    }
  });
}

// ==========================================
// 渲染结果
// ==========================================
function renderResults(scores, total, gpaVal, schoolFactor, classBonus, baseTotal) {
  const schoolName = document.getElementById('inputSchool').value.trim();

  // 置信度提示
  const inDb = schoolDatabase.some(s => s.name === schoolName);
  const warnEl = document.getElementById('confidenceWarn');
  if (schoolName && !inDb) {
    warnEl.classList.add('show');
  } else {
    warnEl.classList.remove('show');
  }

  // 诊断
  const dims = [
    { name: '绩点', score: scores.gpaS },
    { name: '排名', score: scores.rankS },
    { name: '科研', score: scores.resS },
    { name: '竞赛', score: scores.compS },
    { name: '英语', score: scores.engS }
  ];
  const weakest = dims.reduce((a,b) => a.score <= b.score ? a : b);
  const strongest = dims.reduce((a,b) => a.score >= b.score ? a : b);

  document.getElementById('diagnosisTitle').textContent =
    `${schoolName || '同学'}，你的保研竞争力诊断报告`;
  document.getElementById('diagnosisText').textContent =
    `根据你的情况，保研竞争力指数为 ${total} 分。你的优势在${strongest.name}（${strongest.score}/20），短板在${weakest.name}（${weakest.score}/20），建议重点提升${weakest.name}能力。${total >= 90 ? ' 太厉害了！👑' : ''}`;

  // 总分
  document.getElementById('totalScoreNum').textContent = total;
  const ringFill = document.getElementById('energyRingFill');
  if (ringFill) {
    const circumference = 2 * Math.PI * 70; // ~440
    const offset = circumference - (total / 100) * circumference;
    ringFill.style.strokeDashoffset = offset;
  }

  // 院校背景系数卡片
  const bgCard = document.getElementById('bgFactorCard');
  bgCard.style.display = 'block';
  const factorPct = Math.round((schoolFactor.factor - 1) * 100);
  const factorSign = factorPct >= 0 ? '+' : '';
  const factorCls = factorPct >= 0 ? 'up' : 'down';
  document.getElementById('bgBaseScore').textContent = baseTotal + '分';
  document.getElementById('bgSchoolFactor').innerHTML = `${schoolFactor.label}（${schoolFactor.tier}，${factorSign}${factorPct}%${factorPct >= 0 ? '加成' : '折减'}）→ <span class="bg-factor-val ${factorCls}">${Math.round(baseTotal * schoolFactor.factor)}分</span>`;
  const classBonusPct = Math.round((classBonus - 1) * 100);
  document.getElementById('bgClassFactor').textContent = classBonusPct > 0 ? `${getRadioValue('classGroup')}（+${classBonusPct}%加成）` : '普通班（无额外加成）';
  document.getElementById('bgFinalScore').textContent = total + '分';
  document.getElementById('bgFactorTip').textContent = '💡 ' + schoolFactor.desc;

  // 保研率卡片
  const rateInfo = calcBaoyanRate();
  const rateCard = document.getElementById('rateCard');
  if (rateInfo) {
    rateCard.style.display = 'block';
    document.getElementById('rateNum').textContent = rateInfo.rate + '%';
    document.getElementById('rateLabel').textContent = `保研名额${rateInfo.quota}人 / 专业总人数${rateInfo.total}人`;
    const rateTip = document.getElementById('rateTip');
    rateTip.className = 'rate-tip ' + rateInfo.tipCls;
    rateTip.innerHTML = `根据你们专业的保研率，你的保研竞争环境属于：<strong>${rateInfo.level}</strong><br>建议：${rateInfo.tip}`;
  } else {
    rateCard.style.display = 'none';
  }

  // 维度得分
  const grid = document.getElementById('scoreGrid');
  grid.innerHTML = '';
  dims.forEach(d => {
    const cls = d.score >= 16 ? 'high' : d.score >= 10 ? 'mid' : 'low';
    grid.innerHTML += `<div class="score-item"><div class="val ${cls}">${d.score}</div><div class="label">${d.name}（/20）</div></div>`;
  });

  // 雷达图基线
  const targets = getMultiValues('targetGroup');
  let baseline = [14, 14, 14, 14, 14]; // 默认
  if (targets.includes('顶尖985') || targets.includes('中科院所')) baseline = [18, 18, 18, 18, 18];
  else if (targets.includes('中坚985') || targets.includes('新型研究院')) baseline = [16, 16, 16, 16, 16];
  currentBaseline = baseline;
  renderRadarChart(scores, baseline);

  // 院校推荐
  const major = document.getElementById('inputMajor').value || '计算机';
  const matched = matchSchools(major);
  const recs = recommendSchools(total, matched, targets);
  renderSchoolRecs(recs, major);

  // 时间轴
  const grade = parseInt(getRadioValue('gradeGroup')) || 1;
  const semesters = generateTimeline(grade);
  renderTimeline(semesters);

  // 调整滑条（同步绩点制度）
  const adjSlider = document.getElementById('adjustGpa');
  adjSlider.max = gpaScale;
  adjSlider.value = Math.min(gpaVal, gpaScale);
  document.getElementById('adjustGpaVal').textContent = parseFloat(adjSlider.value).toFixed(1) + ' / ' + gpaScale.toFixed(1);

  // 存储原始用户输入（用于详情面板）
  currentScores._rawRank = document.getElementById('inputRank').value;
  currentScores._rawResearch = document.getElementById('inputResearch').value;
  currentScores._rawCompetition = document.getElementById('inputCompetition').value;
  currentScores._rawEnglish = document.getElementById('inputEnglish').value;
  currentScores._rawGpa = gpaVal;
}

function renderSchoolRecs(recs, major) {
  const container = document.getElementById('schoolResults');
  container.innerHTML = '';

  // 如果候选院校较少，统一显示
  if (recs.few) {
    let html = `<div class="school-tier">
      <div class="tier-header">
        <span class="tier-badge wentuo">推荐院校</span>
        <span class="tier-desc">根据你的专业方向，匹配的院校较少</span>
      </div>`;
    recs.baodi.forEach(s => {
      const starsHtml = '&#9733;'.repeat(s.stars) + '&#9734;'.repeat(5 - s.stars);
      const reason = getReason(s, major);
      const disc = s.disciplines;
      const matchedDisc = Object.entries(disc).filter(([k,v]) => major.includes(k) || k.includes(major));
      const topDisc = matchedDisc.length > 0 ? matchedDisc.sort((a,b) => {
        const order = {'A+':4,'A':3,'A-':2,'B+':1};
        return (order[b[1]]||0) - (order[a[1]]||0);
      })[0] : null;
      const rankLabel = topDisc ? '全国前5' : '全国前20';
      html += `<div class="school-card" onclick="toggleSchoolDetail(this)">
        <div class="school-top">
          <span class="school-name">${s.name}${s.name.includes('清华') || s.name.includes('北大') ? '<span class="crown-pop">&#128081;</span>' : ''}</span>
          <span class="school-type-tag">${s.type}</span>
        </div>
        <div class="school-match-bar">
          <div class="school-match-fill mid" style="width:${s.matchPct}%"></div>
        </div>
        <div class="school-meta">
          <span class="school-match-pct mid">匹配度 ${s.matchPct}%</span>
          <span class="school-stars">${starsHtml}</span>
        </div>
        <div class="school-reason">${reason}</div>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="acc-row"><span class="acc-label">往年夏令营门槛</span><span class="acc-val">绩点${s.thresholds.gpa}+ / 排名${s.thresholds.rank} / ${s.thresholds.english}</span></div>
            <div class="acc-row"><span class="acc-label">考核方式</span><span class="acc-val">笔试+面试（专业面+英语面）</span></div>
            <div class="acc-row"><span class="acc-label">推荐理由</span><span class="acc-val">该校在${topDisc ? topDisc[0] : '综合'}领域排名${rankLabel}，与你的专业背景高度匹配</span></div>
            <div class="acc-links">
              <a class="acc-link" href="#">🔗 夏令营官方通知</a>
              <a class="acc-link" href="#">🔗 导师信息查询</a>
            </div>
          </div>
        </div>
      </div>`;
    });
    html += '</div>';
    container.innerHTML += html;
    return;
  }

  const tiers = [
    { key: 'chongci', label: '冲刺', cls: 'chongci', desc: '这些院校门槛略高于你当前水平，建议作为冲刺目标' },
    { key: 'wentuo', label: '稳妥', cls: 'wentuo', desc: '这些院校与你的背景较为匹配，建议重点准备' },
    { key: 'baodi', label: '保底', cls: 'baodi', desc: '这些院校与你匹配度较高，建议作为保底选择' }
  ];

  tiers.forEach(t => {
    const schools = recs[t.key];
    if (schools.length === 0) return;
    const matchCls = t.key === 'baodi' ? 'high' : t.key === 'wentuo' ? 'mid' : 'low';
    let html = `<div class="school-tier">
      <div class="tier-header">
        <span class="tier-badge ${t.cls}">${t.label}</span>
        <span class="tier-desc">${t.desc}</span>
      </div>`;
    schools.forEach(s => {
      const starsHtml = '&#9733;'.repeat(s.stars) + '&#9734;'.repeat(5 - s.stars);
      const reason = getReason(s, major);
      const disc = s.disciplines;
      const matchedDisc = Object.entries(disc).filter(([k,v]) => major.includes(k) || k.includes(major));
      const topDisc = matchedDisc.length > 0 ? matchedDisc.sort((a,b) => {
        const order = {'A+':4,'A':3,'A-':2,'B+':1};
        return (order[b[1]]||0) - (order[a[1]]||0);
      })[0] : null;
      const rankLabel = topDisc ? '全国前5' : '全国前20';
      html += `<div class="school-card" onclick="toggleSchoolDetail(this)">
        <div class="school-top">
          <span class="school-name">${s.name}${s.name.includes('清华') || s.name.includes('北大') ? '<span class="crown-pop">&#128081;</span>' : ''}</span>
          <span class="school-type-tag">${s.type}</span>
        </div>
        <div class="school-match-bar">
          <div class="school-match-fill ${matchCls}" style="width:${s.matchPct}%"></div>
        </div>
        <div class="school-meta">
          <span class="school-match-pct ${matchCls}">匹配度 ${s.matchPct}%</span>
          <span class="school-stars">${starsHtml}</span>
        </div>
        <div class="school-reason">${reason}</div>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="acc-row"><span class="acc-label">往年夏令营门槛</span><span class="acc-val">绩点${s.thresholds.gpa}+ / 排名${s.thresholds.rank} / ${s.thresholds.english}</span></div>
            <div class="acc-row"><span class="acc-label">考核方式</span><span class="acc-val">笔试+面试（专业面+英语面）</span></div>
            <div class="acc-row"><span class="acc-label">推荐理由</span><span class="acc-val">该校在${topDisc ? topDisc[0] : '综合'}领域排名${rankLabel}，与你的专业背景高度匹配</span></div>
            <div class="acc-links">
              <a class="acc-link" href="#">🔗 夏令营官方通知</a>
              <a class="acc-link" href="#">🔗 导师信息查询</a>
            </div>
          </div>
        </div>
      </div>`;
    });
    html += '</div>';
    container.innerHTML += html;
  });
}

// 原有renderTimeline已被上方深度规划系统的renderTimeline覆盖替代

// ==========================================
// 生成报告
// ==========================================
function generateReport() {
  let rawGpa = parseFloat(document.getElementById('inputGpa').value);
  // 统一换算到5分制
  const gpa = rawGpa / gpaScale * 5;
  const rank = document.getElementById('inputRank').value;
  const research = document.getElementById('inputResearch').value;
  const competition = document.getElementById('inputCompetition').value;
  const english = document.getElementById('inputEnglish').value;
  const classType = getRadioValue('classGroup') || '普通班';
  const schoolName = document.getElementById('inputSchool').value.trim();

  // 计算院校背景系数
  const schoolFactor = calcSchoolFactor(schoolName);
  const classBonus = (classType === '强基计划' || classType === '拔尖基地' || classType === '实验班') ? 1.05 : 1.0;

  // 显示加载动画
  document.getElementById('loadingOverlay').classList.add('show');
  showMascotMsg('正在努力生成中，稍等哦 ⏳');

  setTimeout(function() {
    const scores = calcTotalScore(gpa, rank, research, competition, english, classType);
    // 应用院校背景系数
    const baseTotal = scores.total;
    const finalTotal = Math.round(baseTotal * schoolFactor.factor * classBonus);
    currentScores = { ...scores, gpa, rank, research, competition, english, classType, schoolFactor, classBonus, baseTotal, finalTotal };

    // 隐藏步骤，显示结果
    document.getElementById('progressWrap').style.display = 'none';
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('resultsSection').classList.add('show');
    document.getElementById('loadingOverlay').classList.remove('show');

    renderResults(scores, finalTotal, gpa, schoolFactor, classBonus, baseTotal);

    // IP小助理：报告生成+竞争力提示
    showMascotMsg('搞定！下面是你的专属规划 👇', 4000);
    setTimeout(() => {
      if (finalTotal >= 85) {
        showMascotMsg('哇，大佬！你太强了 🌟', 4000);
      } else if (finalTotal < 60) {
        showMascotMsg('没关系，还有时间！我们一起加油 💪✨', 4000);
      }
    }, 5000);

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1500);
}

// ==========================================
// 参数调整
// ==========================================
function onAdjustGpa(val) {
  document.getElementById('adjustGpaVal').textContent = parseFloat(val).toFixed(1) + ' / ' + gpaScale.toFixed(1);
  if (!currentScores.gpa !== undefined) return;

  // 换算到5分制再参与计算
  const rawGpa = parseFloat(val);
  const gpa = rawGpa / gpaScale * 5;
  const { rank, research, competition, english, classType } = currentScores;
  const scores = calcTotalScore(gpa, rank, research, competition, english, classType);

  // 重新应用院校背景系数和特殊班级加成
  const schoolFactor = currentScores.schoolFactor || { factor: 0.80 };
  const classBonus = currentScores.classBonus || 1.0;
  const baseTotal = scores.total;
  const finalTotal = Math.round(baseTotal * schoolFactor.factor * classBonus);

  currentScores = { ...currentScores, ...scores, gpa, baseTotal, finalTotal };

  // 更新总分
  document.getElementById('totalScoreNum').textContent = finalTotal;
  const ringFill2 = document.getElementById('energyRingFill');
  if (ringFill2) {
    const circumference2 = 2 * Math.PI * 70;
    const offset2 = circumference2 - (finalTotal / 100) * circumference2;
    ringFill2.style.strokeDashoffset = offset2;
  }

  // 更新院校背景卡片中的最终分数
  const bgFinalEl = document.getElementById('bgFinalScore');
  if (bgFinalEl) bgFinalEl.textContent = finalTotal + '分';

  // 更新维度得分
  const dims = [
    { name: '绩点', score: scores.gpaS },
    { name: '排名', score: scores.rankS },
    { name: '科研', score: scores.resS },
    { name: '竞赛', score: scores.compS },
    { name: '英语', score: scores.engS }
  ];
  const grid = document.getElementById('scoreGrid');
  const items = grid.querySelectorAll('.score-item');
  dims.forEach((d, i) => {
    if (items[i]) {
      const valEl = items[i].querySelector('.val');
      valEl.textContent = d.score;
      valEl.className = 'val ' + (d.score >= 16 ? 'high' : d.score >= 10 ? 'mid' : 'low');
    }
  });

  // 更新雷达图
  renderRadarChart(scores, currentBaseline);

  // 更新院校推荐
  const major = document.getElementById('inputMajor').value || '计算机';
  const matched = matchSchools(major);
  const targets = getMultiValues('targetGroup');
  const recs = recommendSchools(finalTotal, matched, targets);
  renderSchoolRecs(recs, major);

  // 更新诊断
  const weakest = dims.reduce((a,b) => a.score <= b.score ? a : b);
  const strongest = dims.reduce((a,b) => a.score >= b.score ? a : b);
  document.getElementById('diagnosisText').textContent =
    `根据你的情况，保研竞争力指数为 ${finalTotal} 分。你的优势在${strongest.name}（${strongest.score}/20），短板在${weakest.name}（${weakest.score}/20），建议重点提升${weakest.name}能力。${finalTotal >= 90 ? ' 太厉害了！👑' : ''}`;
}

// ==========================================
// 重新测评
// ==========================================
let resetClickCount = 0;
function resetAll() {
  resetClickCount++;
  if (resetClickCount >= 5) {
    showMascotMsg('彩蛋触发！你已经点了5次重置，是纠结星人吗？😄', 4000);
    resetClickCount = 0;
  }
  document.getElementById('resultsSection').classList.remove('show');
  document.getElementById('progressWrap').style.display = '';
  currentScores = {};
  goStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// Accordion 交互函数
// ==========================================

// 通用：关闭同一容器内其他accordion
function closeOtherAccordions(container, currentPanel) {
  container.querySelectorAll('.accordion-panel.open').forEach(p => {
    if (p !== currentPanel) p.classList.remove('open');
  });
}

// 雷达图维度详情
function toggleRadarDetail(dimIdx) {
  const panel = document.getElementById('radarDetailPanel');
  const content = document.getElementById('radarDetailContent');
  const btns = document.querySelectorAll('#radarDimBtns .radar-dim-btn');

  // 切换按钮状态
  btns.forEach((b, i) => b.classList.toggle('active', i === dimIdx));

  if (panel.classList.contains('open') && panel._activeDim === dimIdx) {
    panel.classList.remove('open');
    btns.forEach(b => b.classList.remove('active'));
    return;
  }

  panel._activeDim = dimIdx;
  const dimNames = ['绩点', '排名', '科研', '竞赛', '英语'];
  const dimKeys = ['gpaS', 'rankS', 'resS', 'compS', 'engS'];
  const rawKeys = ['_rawGpa', '_rawRank', '_rawResearch', '_rawCompetition', '_rawEnglish'];
  const score = currentScores[dimKeys[dimIdx]] || 0;
  const baseline = currentBaseline[dimIdx] || 14;
  const diff = score - baseline;
  const diffCls = diff >= 0 ? 'success' : diff >= -4 ? 'warning' : 'danger';
  const dimName = dimNames[dimIdx];
  const rawVal = currentScores[rawKeys[dimIdx]] || '-';

  // 各维度详情内容
  const details = getRadarDimDetail(dimIdx, score, baseline, diff, diffCls, rawVal);
  content.innerHTML = details;
  panel.classList.add('open');
}

function getRadarDimDetail(dimIdx, score, baseline, diff, diffCls, rawVal) {
  const diffText = diff >= 0 ? `+${diff}分` : `${diff}分`;
  if (dimIdx === 0) { // 绩点
    const targetGpa = (score >= 16) ? '3.6+' : (score >= 12) ? '3.3+' : '3.0+';
    return `
      <div class="acc-row"><span class="acc-label">你的得分</span><span class="acc-val ${diffCls}">${score}/20</span></div>
      <div class="acc-row"><span class="acc-label">目标基线</span><span class="acc-val">${baseline}/20</span></div>
      <div class="acc-row"><span class="acc-label">差距</span><span class="acc-val ${diffCls}">${diffText}</span></div>
      <div class="acc-suggest">建议下学期选修给分较高的专业选修课，或重修低分核心课程，目标将绩点提升至${targetGpa}</div>
      <div class="acc-links"><a class="acc-link" href="#">📚 高绩点备考攻略</a><a class="acc-link" href="#">📋 各专业核心课清单</a></div>`;
  } else if (dimIdx === 1) { // 排名
    const rankLabels = {'前5%':'前5%','前10%':'前10%','前20%':'前20%','前30%':'前30%','30%以后':'30%以后','不清楚':'不清楚'};
    const baselineRank = baseline >= 18 ? '前5%' : baseline >= 16 ? '前10%' : '前20%';
    return `
      <div class="acc-row"><span class="acc-label">你的等级</span><span class="acc-val ${diffCls}">${rawVal}</span></div>
      <div class="acc-row"><span class="acc-label">目标基线</span><span class="acc-val">${baselineRank}</span></div>
      <div class="acc-row"><span class="acc-label">差距</span><span class="acc-val ${diffCls}">${diffText}</span></div>
      <div class="acc-suggest">重点攻克学分高的核心课程（高数/专业课），一门4学分课程拿90分比两门2学分课程拿95分更重要</div>
      <div class="acc-links"><a class="acc-link" href="#">📊 保研排名计算规则</a><a class="acc-link" href="#">🎯 各校排名要求汇总</a></div>`;
  } else if (dimIdx === 2) { // 科研
    const levels = ['无','有科研意向但未开始','进过实验室','有科研项目经历','有论文发表'];
    const baselineLevel = baseline >= 18 ? '有论文发表' : baseline >= 16 ? '有科研项目经历' : '进过实验室';
    const curIdx = levels.indexOf(rawVal);
    const baseIdx = levels.indexOf(baselineLevel);
    const gap = baseIdx - curIdx;
    return `
      <div class="acc-row"><span class="acc-label">你的等级</span><span class="acc-val ${diffCls}">${rawVal}</span></div>
      <div class="acc-row"><span class="acc-label">目标基线</span><span class="acc-val">${baselineLevel}</span></div>
      <div class="acc-row"><span class="acc-label">差距</span><span class="acc-val ${diffCls}">${gap > 0 ? gap + '个等级' : '已达标'}</span></div>
      <div class="acc-suggest">建议联系导师申请独立小课题，或申报大创项目，争取在保研前有完整的科研产出</div>
      <div class="acc-links"><a class="acc-link" href="#">🔬 联系导师邮件模板</a><a class="acc-link" href="#">📝 大创项目申报指南</a><a class="acc-link" href="#">🏫 各校导师推荐</a></div>`;
  } else if (dimIdx === 3) { // 竞赛
    const levels = ['无','参与但未获奖','校级奖项','省级奖项','国家级奖项'];
    const baselineLevel = baseline >= 18 ? '国家级奖项' : baseline >= 16 ? '省级奖项' : '校级奖项';
    const curIdx = levels.indexOf(rawVal);
    const baseIdx = levels.indexOf(baselineLevel);
    const gap = baseIdx - curIdx;
    return `
      <div class="acc-row"><span class="acc-label">你的等级</span><span class="acc-val ${diffCls}">${rawVal}</span></div>
      <div class="acc-row"><span class="acc-label">目标基线</span><span class="acc-val">${baselineLevel}</span></div>
      <div class="acc-row"><span class="acc-label">差距</span><span class="acc-val ${diffCls}">${gap > 0 ? gap + '个等级' : '已达标'}</span></div>
      <div class="acc-suggest">推荐参加全国大学生数学建模竞赛/ACM/挑战杯，冲刺省级以上奖项，对保研有显著加分</div>
      <div class="acc-links"><a class="acc-link" href="#">🏆 保研认可竞赛名单</a><a class="acc-link" href="#">📅 各竞赛报名时间表</a><a class="acc-link" href="#">💡 备赛经验分享</a></div>`;
  } else { // 英语
    const baselineEng = baseline >= 18 ? '六级550+' : baseline >= 16 ? '六级500-550' : '六级通过';
    return `
      <div class="acc-row"><span class="acc-label">你的等级</span><span class="acc-val ${diffCls}">${rawVal}</span></div>
      <div class="acc-row"><span class="acc-label">目标基线</span><span class="acc-val">${baselineEng}</span></div>
      <div class="acc-row"><span class="acc-label">差距</span><span class="acc-val ${diffCls}">${diffText}</span></div>
      <div class="acc-suggest">每天30分钟听力+30分钟阅读，重点刷真题，目标大三上学期刷到550+（部分985要求）</div>
      <div class="acc-links"><a class="acc-link" href="#">📖 六级600+备考计划</a><a class="acc-link" href="#">🌍 各校英语要求汇总</a><a class="acc-link" href="#">🎧 听力/阅读资源推荐</a></div>`;
  }
}

// 院校卡片详情
function toggleSchoolDetail(cardEl) {
  const panel = cardEl.querySelector('.accordion-panel');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  // 关闭所有其他院校卡片
  document.querySelectorAll('.school-card .accordion-panel.open').forEach(p => {
    p.classList.remove('open');
  });
  if (!isOpen) panel.classList.add('open');
}

// 时间轴详情
function toggleTimelineDetail(contentEl) {
  const panel = contentEl.querySelector('.accordion-panel');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  // 关闭所有其他时间轴
  document.querySelectorAll('.timeline-content .accordion-panel.open').forEach(p => {
    p.classList.remove('open');
  });
  if (!isOpen) panel.classList.add('open');
}

// ==========================================
// 视觉改造函数覆盖（在原有函数定义之后）
// ==========================================
// 2.1 背景情绪色彩切换
const stepBgMap = {
  1: 'step-1-bg', 2: 'step-2-bg', 3: 'step-3-bg', 4: 'step-4-bg'
};

// 覆盖原有的goStep函数，添加背景切换
const _origGoStep = goStep;
goStep = function(step) {
  const prevStep = currentStep;
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('step' + step).classList.add('active');
  currentStep = step;
  updateProgress(step);

  // 切换body背景class
  document.body.className = '';
  if (stepBgMap[step]) document.body.classList.add(stepBgMap[step]);

  // IP小助理：步骤完成提示
  if (step === 2 && prevStep === 1) {
    showMascotMsg('收到！你的基本情况我了解啦 📝');
  } else if (step === 3 && prevStep === 2) {
    const gpa = parseFloat(document.getElementById('inputGpa').value);
    const gpaNorm = gpa / gpaScale * 5;
    if (gpaNorm >= 3.6) {
      showMascotMsg('绩点不错，继续加油！💪');
    } else {
      showMascotMsg('绩点还有提升空间，一起努力 💪');
    }
  } else if (step === 4 && prevStep === 3) {
    showMascotMsg('经历填完啦，马上帮你出报告 🚀');
  }
};

// 2.2 覆盖进度条更新
const _origUpdateProgress = updateProgress;
updateProgress = function(step) {
  // 更新成长之路节点
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('dot' + i);
    const label = document.getElementById('label' + i);
    const node = dot.closest('.growth-node');
    dot.classList.remove('done', 'active');
    node.classList.remove('done', 'active');
    if (i < step) { dot.classList.add('done'); node.classList.add('done'); }
    else if (i === step) { dot.classList.add('active'); node.classList.add('active'); }
  }
  // 更新光带
  const fill = document.getElementById('growthLineFill');
  const light = document.getElementById('growthLineLight');
  if (fill) fill.style.width = ((step - 1) / 3 * 100) + '%';
  if (light) light.style.display = step < 4 ? 'block' : 'none';
};

// Step 4 靶心箭头指向
function updateTargetArrow() {
  const arrow = document.getElementById('targetArrow');
  if (!arrow) return;
  const activeVals = getMultiValues('targetGroup');
  if (activeVals.length === 0 || activeVals.includes('还没想好')) {
    arrow.style.transform = 'rotate(0deg)';
    return;
  }
  const angleMap = { '顶尖985': -60, '中坚985': -30, '211': 0, '中科院所': 30, '新型研究院': 60 };
  let angle = angleMap[activeVals[0]] || 0;
  arrow.style.transform = `rotate(${angle}deg)`;
}

// 绑定targetGroup点击事件以更新箭头
document.addEventListener('DOMContentLoaded', function() {
  const targetItems = document.querySelectorAll('#targetGroup .multi-item');
  targetItems.forEach(item => {
    item.addEventListener('click', function() {
      setTimeout(updateTargetArrow, 50);
    });
  });
});

// 3.1 荣耀揭晓动画
function playGloryAnimation(callback) {
  const overlay = document.getElementById('gloryOverlay');
  if (!overlay) { callback(); return; }
  overlay.classList.add('show');

  // 生成纸屑
  const confettiIcons = ['🌟','✨','🎉','🎊','⭐','💫','🏆','🥇'];
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.textContent = confettiIcons[Math.floor(Math.random() * confettiIcons.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-5vh';
    el.style.animationDelay = Math.random() * 0.8 + 's';
    el.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
    overlay.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  setTimeout(() => {
    overlay.classList.remove('show');
    // 清除残留纸屑
    overlay.querySelectorAll('.confetti-piece').forEach(el => el.remove());
    if (callback) callback();
  }, 3000);
}

// 覆盖generateReport添加荣耀动画
const _origGenerateReport = generateReport;
generateReport = function() {
  let rawGpa = parseFloat(document.getElementById('inputGpa').value);
  const gpa = rawGpa / gpaScale * 5;
  const rank = document.getElementById('inputRank').value;
  const research = document.getElementById('inputResearch').value;
  const competition = document.getElementById('inputCompetition').value;
  const english = document.getElementById('inputEnglish').value;
  const classType = getRadioValue('classGroup') || '普通班';
  const schoolName = document.getElementById('inputSchool').value.trim();

  const schoolFactor = calcSchoolFactor(schoolName);
  const classBonus = (classType === '强基计划' || classType === '拔尖基地' || classType === '实验班') ? 1.05 : 1.0;

  document.getElementById('loadingOverlay').classList.add('show');
  showMascotMsg('正在努力生成中，稍等哦 ⏳');

  setTimeout(function() {
    const scores = calcTotalScore(gpa, rank, research, competition, english, classType);
    const baseTotal = scores.total;
    const finalTotal = Math.round(baseTotal * schoolFactor.factor * classBonus);
    currentScores = { ...scores, gpa, rank, research, competition, english, classType, schoolFactor, classBonus, baseTotal, finalTotal };

    document.getElementById('loadingOverlay').classList.remove('show');

    // 播放荣耀动画，动画结束后显示结果
    playGloryAnimation(() => {
      document.getElementById('progressWrap').style.display = 'none';
      document.getElementById('heroSection').style.display = 'none';
      document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('resultsSection').classList.add('show');
      document.body.className = 'result-bg';

      renderResults(scores, finalTotal, gpa, schoolFactor, classBonus, baseTotal);

      showMascotMsg('搞定！下面是你的专属规划 👇', 4000);
      setTimeout(() => {
        if (finalTotal >= 85) {
          showMascotMsg('哇，大佬！你太强了 🌟', 4000);
        } else if (finalTotal < 60) {
          showMascotMsg('没关系，还有时间！我们一起加油 💪✨', 4000);
        }
      }, 5000);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, 1500);
};

// 覆盖renderResults添加荣耀徽章和彩蛋
const _origRenderResults = renderResults;
renderResults = function(scores, total, gpaVal, schoolFactor, classBonus, baseTotal) {
  const schoolName = document.getElementById('inputSchool').value.trim();

  // 置信度提示
  const inDb = schoolDatabase.some(s => s.name === schoolName);
  const warnEl = document.getElementById('confidenceWarn');
  if (schoolName && !inDb) { warnEl.classList.add('show'); } else { warnEl.classList.remove('show'); }

  // 诊断
  const dims = [
    { name: '绩点', score: scores.gpaS },
    { name: '排名', score: scores.rankS },
    { name: '科研', score: scores.resS },
    { name: '竞赛', score: scores.compS },
    { name: '英语', score: scores.engS }
  ];
  const weakest = dims.reduce((a,b) => a.score <= b.score ? a : b);
  const strongest = dims.reduce((a,b) => a.score >= b.score ? a : b);

  document.getElementById('diagnosisTitle').textContent =
    `${schoolName || '同学'}，你的保研竞争力诊断报告`;
  document.getElementById('diagnosisText').textContent =
    `根据你的情况，保研竞争力指数为 ${total} 分。你的优势在${strongest.name}（${strongest.score}/20），短板在${weakest.name}（${weakest.score}/20），建议重点提升${weakest.name}能力。${total >= 90 ? ' 太厉害了！👑' : ''}`;

  // 荣耀徽章
  document.getElementById('totalScoreNum').textContent = total;
  const honorTitle = document.getElementById('honorTitle');
  const honorEncourage = document.getElementById('honorEncourage');
  if (total >= 90) { honorTitle.textContent = '保研王者'; honorEncourage.textContent = '王者归来，顶尖院校在向你招手！'; }
  else if (total >= 75) { honorTitle.textContent = '六边形战士'; honorEncourage.textContent = '全面发展，继续保持这个势头！'; }
  else if (total >= 60) { honorTitle.textContent = '潜力股'; honorEncourage.textContent = '潜力无限，针对性提升就能突破！'; }
  else { honorTitle.textContent = '保研新星'; honorEncourage.textContent = '新星冉冉升起，现在开始努力还不晚！'; }

  // 隐藏的能量环同步
  const ringFill = document.getElementById('energyRingFill');
  if (ringFill) {
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (total / 100) * circumference;
    ringFill.style.strokeDashoffset = offset;
  }
  const ringNumDisplay = document.getElementById('ringNumDisplay');
  if (ringNumDisplay) ringNumDisplay.textContent = total;

  // 院校背景系数卡片
  const bgCard = document.getElementById('bgFactorCard');
  bgCard.style.display = 'block';
  const factorPct = Math.round((schoolFactor.factor - 1) * 100);
  const factorSign = factorPct >= 0 ? '+' : '';
  const factorCls = factorPct >= 0 ? 'up' : 'down';
  document.getElementById('bgBaseScore').textContent = baseTotal + '分';
  document.getElementById('bgSchoolFactor').innerHTML = `${schoolFactor.label}（${schoolFactor.tier}，${factorSign}${factorPct}%${factorPct >= 0 ? '加成' : '折减'}）→ <span class="bg-factor-val ${factorCls}">${Math.round(baseTotal * schoolFactor.factor)}分</span>`;
  const classBonusPct = Math.round((classBonus - 1) * 100);
  document.getElementById('bgClassFactor').textContent = classBonusPct > 0 ? `${getRadioValue('classGroup')}（+${classBonusPct}%加成）` : '普通班（无额外加成）';
  document.getElementById('bgFinalScore').textContent = total + '分';
  document.getElementById('bgFactorTip').textContent = '💡 ' + schoolFactor.desc;

  // 保研率卡片
  const rateInfo = calcBaoyanRate();
  const rateCard = document.getElementById('rateCard');
  if (rateInfo) {
    rateCard.style.display = 'block';
    document.getElementById('rateNum').textContent = rateInfo.rate + '%';
    document.getElementById('rateLabel').textContent = `保研名额${rateInfo.quota}人 / 专业总人数${rateInfo.total}人`;
    const rateTip = document.getElementById('rateTip');
    rateTip.className = 'rate-tip ' + rateInfo.tipCls;
    rateTip.innerHTML = `根据你们专业的保研率，你的保研竞争环境属于：<strong>${rateInfo.level}</strong><br>建议：${rateInfo.tip}`;
  } else {
    rateCard.style.display = 'none';
  }

  // 维度得分
  const grid = document.getElementById('scoreGrid');
  grid.innerHTML = '';
  dims.forEach(d => {
    const cls = d.score >= 16 ? 'high' : d.score >= 10 ? 'mid' : 'low';
    grid.innerHTML += `<div class="score-item"><div class="val ${cls}">${d.score}</div><div class="label">${d.name}（/20）</div></div>`;
  });

  // 雷达图基线
  const targets = getMultiValues('targetGroup');
  let baseline = [14, 14, 14, 14, 14];
  if (targets.includes('顶尖985') || targets.includes('中科院所')) baseline = [18, 18, 18, 18, 18];
  else if (targets.includes('中坚985') || targets.includes('新型研究院')) baseline = [16, 16, 16, 16, 16];
  currentBaseline = baseline;
  renderRadarChart(scores, baseline);

  // 院校推荐
  const major = document.getElementById('inputMajor').value || '计算机';
  const matched = matchSchools(major);
  const recs = recommendSchools(total, matched, targets);
  renderSchoolRecs(recs, major);

  // 时间轴 -> 成长地图
  const grade = parseInt(getRadioValue('gradeGroup')) || 1;
  const semesters = generateTimeline(grade);
  renderTimeline(semesters);
  renderRoadmap(semesters, grade);

  // 调整滑条同步
  const adjSlider = document.getElementById('adjustGpa');
  adjSlider.max = gpaScale;
  adjSlider.value = Math.min(gpaVal, gpaScale);
  document.getElementById('adjustGpaVal').textContent = parseFloat(adjSlider.value).toFixed(1) + ' / ' + gpaScale.toFixed(1);

  // 存储原始输入
  currentScores._rawRank = document.getElementById('inputRank').value;
  currentScores._rawResearch = document.getElementById('inputResearch').value;
  currentScores._rawCompetition = document.getElementById('inputCompetition').value;
  currentScores._rawEnglish = document.getElementById('inputEnglish').value;
  currentScores._rawGpa = gpaVal;

  // 彩蛋1：全部A级
  const allA = dims.every(d => d.score >= 16);
  if (allA) {
    const egg = document.createElement('div');
    egg.className = 'easter-egg';
    egg.innerHTML = '🎉 保研六边形战士！所有维度全部A级，太强了！';
    document.getElementById('resultsSection').insertBefore(egg, document.getElementById('resultsSection').firstChild);
    setTimeout(() => egg.remove(), 6000);
  }

  // 彩蛋2：推荐清北
  const hasQingbei = recs.chongci && recs.chongci.some(s => s.name.includes('清华') || s.name.includes('北大'));
  if (hasQingbei) {
    const egg = document.createElement('div');
    egg.className = 'easter-egg';
    egg.innerHTML = '<span style="animation:crownPop 0.8s ease both;display:inline-block">👑</span> 清北在向你招手！';
    document.getElementById('resultsSection').insertBefore(egg, document.getElementById('resultsSection').firstChild);
    setTimeout(() => egg.remove(), 6000);
  }
};

// 覆盖院校推荐渲染，使用圆形进度环
const _origRenderSchoolRecs = renderSchoolRecs;
renderSchoolRecs = function(recs, major) {
  const container = document.getElementById('schoolResults');
  container.innerHTML = '';

  if (recs.few) {
    let html = `<div class="school-tier">
      <div class="tier-header">
        <span class="tier-badge wentuo">推荐院校</span>
        <span class="tier-desc">根据你的专业方向，匹配的院校较少</span>
      </div>`;
    recs.baodi.forEach(s => {
      html += buildSchoolCard(s, major, 'mid');
    });
    html += '</div>';
    container.innerHTML += html;
    return;
  }

  const tiers = [
    { key: 'chongci', label: '冲刺', cls: 'chongci', desc: '这些院校门槛略高于你当前水平，建议作为冲刺目标' },
    { key: 'wentuo', label: '稳妥', cls: 'wentuo', desc: '这些院校与你的背景较为匹配，建议重点准备' },
    { key: 'baodi', label: '保底', cls: 'baodi', desc: '这些院校与你匹配度较高，建议作为保底选择' }
  ];

  tiers.forEach(t => {
    const schools = recs[t.key];
    if (schools.length === 0) return;
    const matchCls = t.key === 'baodi' ? 'high' : t.key === 'wentuo' ? 'mid' : 'low';
    const strokeColor = t.key === 'baodi' ? '#10B981' : t.key === 'wentuo' ? '#F59E0B' : '#EF4444';
    let html = `<div class="school-tier">
      <div class="tier-header">
        <span class="tier-badge ${t.cls}">${t.label}</span>
        <span class="tier-desc">${t.desc}</span>
      </div>`;
    schools.forEach(s => {
      html += buildSchoolCard(s, major, matchCls, strokeColor);
    });
    html += '</div>';
    container.innerHTML += html;
  });
};

function buildSchoolCard(s, major, matchCls, strokeColor) {
  const starsHtml = '★'.repeat(s.stars) + '☆'.repeat(5 - s.stars);
  const reason = getReason(s, major);
  const disc = s.disciplines;
  const matchedDisc = Object.entries(disc).filter(([k,v]) => major.includes(k) || k.includes(major));
  const topDisc = matchedDisc.length > 0 ? matchedDisc.sort((a,b) => {
    const order = {'A+':4,'A':3,'A-':2,'B+':1};
    return (order[b[1]]||0) - (order[a[1]]||0);
  })[0] : null;
  const rankLabel = topDisc ? '全国前5' : '全国前20';
  const circumference = 2 * Math.PI * 22;
  const dashoffset = circumference - (s.matchPct / 100) * circumference;
  const sc = strokeColor || (matchCls === 'high' ? '#10B981' : matchCls === 'mid' ? '#F59E0B' : '#EF4444');
  return `<div class="school-card" onclick="toggleSchoolDetail(this)">
    <div class="school-top">
      <span class="school-name">${s.name}${s.name.includes('清华') || s.name.includes('北大') ? '<span class="crown-pop">👑</span>' : ''}</span>
      <span class="school-type-tag">${s.type}</span>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin:10px 0;">
      <div class="match-ring-wrap">
        <svg class="match-ring-svg" width="56" height="56" viewBox="0 0 56 56">
          <circle class="match-ring-track" cx="28" cy="28" r="22"></circle>
          <circle class="match-ring-fill" cx="28" cy="28" r="22" stroke="${sc}" stroke-dashoffset="${dashoffset}"></circle>
        </svg>
        <div class="match-ring-text">${s.matchPct}%</div>
      </div>
      <div style="flex:1;">
        <div class="school-meta" style="margin-bottom:4px;">
          <span class="school-match-pct ${matchCls}">匹配度 ${s.matchPct}%</span>
          <span class="school-stars">${starsHtml}</span>
        </div>
        <div class="school-reason">${reason}</div>
      </div>
    </div>
    <div class="accordion-panel">
      <div class="accordion-inner">
        <div class="acc-row"><span class="acc-label">往年夏令营门槛</span><span class="acc-val">绩点${s.thresholds.gpa}+ / 排名${s.thresholds.rank} / ${s.thresholds.english}</span></div>
        <div class="acc-row"><span class="acc-label">考核方式</span><span class="acc-val">笔试+面试（专业面+英语面）</span></div>
        <div class="acc-row"><span class="acc-label">推荐理由</span><span class="acc-val">该校在${topDisc ? topDisc[0] : '综合'}领域排名${rankLabel}，与你的专业背景高度匹配</span></div>
        <div class="acc-links">
          <a class="acc-link" href="#">🔗 夏令营官方通知</a>
          <a class="acc-link" href="#">🔗 导师信息查询</a>
        </div>
      </div>
    </div>
  </div>`;
}

// S形成长地图
function renderRoadmap(semesters, grade) {
  const wrap = document.getElementById('roadmapWrap');
  if (!wrap) return;
  const iconMap = {
    '大一上': '🎯', '大一下': '📚', '大二上': '🏆', '大二下': '🔬',
    '大三上': '📝', '大三下': '🌟', '大四上': '🎓'
  };
  const titles = { 1: '四年保研成长地图', 2: '保研冲刺成长地图', 3: '保研冲刺成长地图' };
  document.getElementById('timelineTitle').textContent = titles[grade] || '成长地图';

  let html = '<div class="roadmap-items">';
  semesters.forEach((sem, idx) => {
    const data = timelineData[sem];
    if (!data) return;
    const isNow = idx === 0;
    html += `
      <div class="roadmap-item">
        ${isNow ? '<div class="roadmap-now"></div>' : ''}
        <div class="roadmap-icon">${iconMap[sem] || '📍'}</div>
        <div class="roadmap-label">${sem}${isNow ? ' <span style="color:#EF4444">(当前)</span>' : ''}</div>
        <div class="roadmap-title">${data.title}</div>
        <div class="roadmap-desc">${data.desc}</div>
      </div>
    `;
  });
  html += '</div>';
  wrap.innerHTML = html;
}

// 4.3 按钮Ripple效果
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
});

// 分享报告占位
function shareReport() {
  showMascotMsg('分享功能开发中，先截图分享吧 📸', 3000);
}

// 覆盖resetAll恢复背景
const _origResetAll = resetAll;
resetAll = function() {
  resetClickCount++;
  if (resetClickCount >= 5) {
    showMascotMsg('彩蛋触发！你已经点了5次重置，是纠结星人吗？😄', 4000);
    resetClickCount = 0;
  }
  document.getElementById('resultsSection').classList.remove('show');
  document.getElementById('progressWrap').style.display = '';
  document.getElementById('heroSection').style.display = '';
  currentScores = {};
  goStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// IP小助理表情变化
document.addEventListener('DOMContentLoaded', function() {
  const avatar = document.getElementById('mascotAvatar');
  const expressions = ['🦉','🤔','😊','😮','💪','🎉'];
  let exprIdx = 0;
  setInterval(() => {
    exprIdx = (exprIdx + 1) % expressions.length;
    if (avatar) avatar.textContent = expressions[exprIdx];
  }, 4000);
});


