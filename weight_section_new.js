// ========== 体重记录 ==========
// 常见食物热量库 (每100g/每份)
const FOOD_DB = {
  // 主食
  '米饭': { cal: 116, unit: '100g', protein: 2.6 },
  '馒头': { cal: 223, unit: '100g', protein: 7.0 },
  '面条': { cal: 110, unit: '100g', protein: 3.5 },
  '包子': { cal: 227, unit: '100g', protein: 8.0 },
  '饺子': { cal: 240, unit: '100g', protein: 9.0 },
  '全麦面包': { cal: 246, unit: '100g', protein: 9.0 },
  '小米粥': { cal: 46, unit: '100g', protein: 1.4 },
  '红薯': { cal: 86, unit: '100g', protein: 1.6 },
  '玉米': { cal: 112, unit: '100g', protein: 4.0 },
  '燕麦': { cal: 377, unit: '100g', protein: 13.5 },
  // 肉类
  '鸡胸肉': { cal: 133, unit: '100g', protein: 31.0 },
  '鸡腿肉': { cal: 181, unit: '100g', protein: 16.0 },
  '鸡蛋': { cal: 144, unit: '100g(约2个)', protein: 13.3 },
  '猪肉瘦肉': { cal: 143, unit: '100g', protein: 20.3 },
  '牛肉': { cal: 125, unit: '100g', protein: 19.9 },
  '鱼肉': { cal: 104, unit: '100g', protein: 17.0 },
  '虾仁': { cal: 48, unit: '100g', protein: 10.4 },
  '排骨': { cal: 264, unit: '100g', protein: 18.3 },
  '培根': { cal: 541, unit: '100g', protein: 12.0 },
  // 蔬菜
  '西兰花': { cal: 34, unit: '100g', protein: 2.8 },
  '菠菜': { cal: 23, unit: '100g', protein: 2.9 },
  '番茄': { cal: 18, unit: '100g', protein: 0.9 },
  '黄瓜': { cal: 15, unit: '100g', protein: 0.7 },
  '生菜': { cal: 15, unit: '100g', protein: 1.4 },
  '白菜': { cal: 13, unit: '100g', protein: 1.5 },
  '胡萝卜': { cal: 37, unit: '100g', protein: 1.0 },
  '土豆': { cal: 81, unit: '100g', protein: 2.0 },
  '豆腐': { cal: 76, unit: '100g', protein: 8.1 },
  '香菇': { cal: 26, unit: '100g', protein: 2.2 },
  // 水果
  '苹果': { cal: 53, unit: '100g', protein: 0.2 },
  '香蕉': { cal: 93, unit: '100g', protein: 1.4 },
  '橙子': { cal: 48, unit: '100g', protein: 0.8 },
  '葡萄': { cal: 44, unit: '100g', protein: 0.5 },
  '草莓': { cal: 32, unit: '100g', protein: 0.7 },
  '蓝莓': { cal: 57, unit: '100g', protein: 0.7 },
  '西瓜': { cal: 31, unit: '100g', protein: 0.6 },
  '芒果': { cal: 60, unit: '100g', protein: 0.8 },
  // 饮品
  '牛奶': { cal: 54, unit: '100ml', protein: 3.0 },
  '酸奶': { cal: 72, unit: '100ml', protein: 2.5 },
  '豆浆': { cal: 31, unit: '100ml', protein: 3.0 },
  '咖啡': { cal: 2, unit: '100ml', protein: 0.1 },
  '奶茶': { cal: 270, unit: '杯(500ml)', protein: 3.0 },
  // 零食/其他
  '坚果': { cal: 607, unit: '100g', protein: 20.0 },
  '巧克力': { cal: 546, unit: '100g', protein: 4.0 },
  '蛋糕': { cal: 347, unit: '100g', protein: 5.0 },
  '饼干': { cal: 433, unit: '100g', protein: 8.0 },
  '冰淇淋': { cal: 207, unit: '100g', protein: 3.5 },
  // 调料
  '沙拉酱': { cal: 680, unit: '100g', protein: 1.0 },
  '花生油': { cal: 899, unit: '100g', protein: 0 },
};

function calcFoodCalories(foodName, amount) {
  if (FOOD_DB[foodName]) {
    return Math.round(FOOD_DB[foodName].cal * amount / 100);
  }
  for (const key of Object.keys(FOOD_DB)) {
    if (foodName.includes(key) || key.includes(foodName)) {
      return Math.round(FOOD_DB[key].cal * amount / 100);
    }
  }
  return 0;
}

function renderWeight(main, today) {
  const todayMeals = appData.meals.filter(m => m.date === today);
  const todayWater = appData.water.filter(w => w.date === today).reduce((s, w) => s + (w.cups || 0), 0);

  const mealCal = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
  todayMeals.forEach(m => {
    (m.items || []).forEach(item => {
      const cal = parseFloat(item.calories) || calcFoodCalories(item.food, item.amount || 100);
      mealCal[m.mealType] = (mealCal[m.mealType] || 0) + cal;
    });
  });
  const todayCals = Object.values(mealCal).reduce((s, c) => s + c, 0);

  let html = `
    <div class="page-header">
      <span class="star-icon"><img src="__STAR_B64__" alt=""></span>
      <div>
        <div class="page-title">体重 & 饮食</div>
        <div class="page-subtitle">管住嘴，迈开腿 💪</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">📝</span> 今日体重</div>
      <div class="weight-input-row">
        <input id="weightInput" placeholder="输入体重 (斤)" type="number" step="0.1">
        <button class="btn btn-primary" onclick="addWeight()">记录</button>
      </div>
    </div>
  `;

  if (appData.weight.length > 0) {
    const latest = appData.weight[appData.weight.length - 1];
    const first = appData.weight[0];
    const diff = latest.weight - first.weight;
    const trend = diff < 0 ? '\u{1F4C9}' : diff > 0 ? '\u{1F4C8}' : '\u{27A1}\u{FE0F}';
    const trendText = diff < 0 ? `已减 ${Math.abs(diff).toFixed(1)} 斤` : diff > 0 ? `增加 ${diff.toFixed(1)} 斤` : '体重稳定';

    html += `
      <div class="card">
        <div style="display:flex;justify-content:space-around;text-align:center;">
          <div>
            <div style="font-size:28px;font-weight:800;color:var(--coral);">${latest.weight}</div>
            <div style="font-size:10px;color:var(--text-light);">当前体重 (斤)</div>
          </div>
          <div>
            <div style="font-size:22px;font-weight:700;color:var(--warm-orange);">${trend} ${trendText}</div>
            <div style="font-size:10px;color:var(--text-light);">变化趋势</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="emoji">📊</span> 体重趋势</div>
        <div class="weight-chart" id="weightChart"></div>
      </div>
    `;
  } else {
    html += '<div class="card"><p style="text-align:center;color:var(--text-light);padding:16px;">还没有体重记录，开始记录吧~</p></div>';
  }

  // ===== 饮食总览 =====
  const calGoal = 1500;
  const calPct = Math.min(todayCals / calGoal * 100, 100);
  const calColor = todayCals > calGoal ? 'var(--coral)' : 'var(--mint)';

  html += `
    <div class="card">
      <div class="card-title"><span class="emoji">🍎</span> 今日饮食总览</div>
      <div style="text-align:center;margin:8px 0;">
        <div style="font-size:32px;font-weight:800;color:${calColor};">${todayCals}</div>
        <div style="font-size:10px;color:var(--text-light);">已摄入 / 目标 ${calGoal} 千卡</div>
        <div style="height:10px;background:#eee;border-radius:5px;margin:8px 16px;overflow:hidden;">
          <div style="width:${calPct}%;height:100%;background:linear-gradient(90deg,var(--mint),${calColor});border-radius:5px;transition:width 0.5s;"></div>
        </div>
      </div>
  `;

  // 各餐热量
  const mealNames = { breakfast: '早餐 🌞', lunch: '午餐 ☀️', dinner: '晚餐 🌙', snack: '加餐 🍪' };
  html += '<div style="display:flex;justify-content:space-around;text-align:center;padding:4px 0;">';
  for (const [type, name] of Object.entries(mealNames)) {
    html += '<div><div style="font-size:18px;font-weight:700;color:var(--text);">' + (mealCal[type] || 0) + '</div><div style="font-size:9px;color:var(--text-light);">' + name + '</div></div>';
  }
  html += '</div>';

  // 喝水量
  html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-top:1px solid var(--border);margin-top:8px;">';
  html += '<span style="font-size:13px;">💧 今日饮水</span>';
  html += '<div style="display:flex;align-items:center;gap:4px;">';
  for (let i = 1; i <= 8; i++) {
    html += '<span style="font-size:16px;opacity:' + (i <= todayWater ? '1' : '0.25') + ';">💧</span>';
  }
  html += '<span style="font-size:14px;font-weight:700;color:var(--text);margin-left:4px;">' + todayWater + '杯</span></div></div>';
  html += '<button class="btn btn-primary" style="margin-top:6px;width:100%;" onclick="addWater()">+ 💧 喝一杯水 (200ml)</button>';
  html += '</div>';

  // ===== 记录饮食 =====
  html += `
    <div class="card">
      <div class="card-title"><span class="emoji">🍲</span> 记录饮食</div>
      <select id="mealType" style="width:100%;margin-bottom:6px;">
        <option value="breakfast">🌞 早餐</option>
        <option value="lunch">☀️ 午餐</option>
        <option value="dinner">🌙 晚餐</option>
        <option value="snack">🍪 加餐</option>
      </select>
      <div style="display:flex;gap:4px;margin-bottom:6px;">
        <input id="foodName" placeholder="食物名称（如：米饭、鸡胸肉）" style="flex:2;">
        <input id="foodAmount" placeholder="克数" type="number" value="100" style="flex:1;">
        <button class="btn btn-small btn-primary" onclick="addFoodItem()" style="white-space:nowrap;">+ 添加</button>
      </div>
      <div id="foodItemList" style="min-height:10px;margin-bottom:6px;"></div>
      <button class="btn btn-mint" style="width:100%;" onclick="saveMeal()">💾 保存这餐</button>
    </div>
  `;

  // ===== 今日饮食记录列表 =====
  if (todayMeals.length > 0) {
    html += '<div class="card"><div class="card-title"><span class="emoji">📋</span> 今日饮食记录</div>';
    for (const meal of todayMeals) {
      const mealCal = (meal.items || []).reduce((s, item) => s + (parseFloat(item.calories) || calcFoodCalories(item.food, item.amount || 100)), 0);
      html += '<div style="padding:8px 0;border-bottom:1px solid var(--border);">';
      html += '<div style="display:flex;justify-content:space-between;">';
      html += '<span style="font-weight:600;">' + (mealNames[meal.mealType] || meal.mealType) + '</span>';
      html += '<span style="color:var(--coral);font-weight:600;">' + mealCal + ' 千卡</span></div>';
      html += '<div style="font-size:12px;color:var(--text-light);margin-top:4px;">';
      for (const item of (meal.items || [])) {
        html += '<span style="display:inline-block;background:#FFF0E8;border-radius:10px;padding:2px 8px;margin:2px 4px 2px 0;">' + escHtml(item.food) + ' ' + (item.amount || 100) + 'g</span>';
      }
      html += '</div></div>';
    }
    html += '</div>';
  }

  // 减脂建议
  html += `
    <div class="card" style="background:linear-gradient(135deg,#F0F8FF,#E0F0FF);">
      <div class="card-title"><span class="emoji">💡</span> 减脂小贴士</div>
      <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
        🥗 每餐先吃蔬菜再吃蛋白质最后碳水<br>
        💧 每天喝够2L水，提高代谢<br>
        😴 保证7-8小时睡眠，睡眠不足会更容易饿<br>
        🏃 结合你的运动计划，坚持就是胜利！<br>
        🌟 Wendy，每一天都在变更好！
      </p>
    </div>
  `;

  main.innerHTML = html;

  if (appData.weight.length >= 2) {
    setTimeout(() => renderWeightChart(), 100);
  }
}

// 临时食物列表
let tempFoodItems = [];

function addFoodItem() {
  const foodName = document.getElementById('foodName').value.trim();
  const foodAmount = parseFloat(document.getElementById('foodAmount').value) || 100;
  if (!foodName) { showToast('请输入食物名称'); return; }

  const calories = calcFoodCalories(foodName, foodAmount);
  tempFoodItems.push({ food: foodName, amount: foodAmount, calories: calories });

  const listEl = document.getElementById('foodItemList');
  let listHtml = '';
  tempFoodItems.forEach((item, i) => {
    listHtml += '<div style="display:flex;justify-content:space-between;align-items:center;background:#FFF8F0;border-radius:8px;padding:6px 10px;margin-bottom:4px;">';
    listHtml += '<span style="font-size:13px;">' + escHtml(item.food) + ' <span style="color:var(--text-light);font-size:11px;">' + item.amount + 'g</span></span>';
    listHtml += '<span style="display:flex;align-items:center;gap:8px;">';
    listHtml += '<span style="font-size:12px;font-weight:600;color:var(--coral);">~' + item.calories + '千卡</span>';
    listHtml += '<button onclick="removeFoodItem(' + i + ')" style="background:none;border:none;color:var(--text-light);cursor:pointer;font-size:16px;">✖</button>';
    listHtml += '</span></div>';
  });
  listEl.innerHTML = listHtml;

  document.getElementById('foodName').value = '';
  document.getElementById('foodAmount').value = '100';
  document.getElementById('foodName').focus();
}

function removeFoodItem(index) {
  tempFoodItems.splice(index, 1);
  const listEl = document.getElementById('foodItemList');
  if (listEl) {
    let listHtml = '';
    tempFoodItems.forEach((item, i) => {
      listHtml += '<div style="display:flex;justify-content:space-between;align-items:center;background:#FFF8F0;border-radius:8px;padding:6px 10px;margin-bottom:4px;">';
      listHtml += '<span style="font-size:13px;">' + escHtml(item.food) + ' <span style="color:var(--text-light);font-size:11px;">' + item.amount + 'g</span></span>';
      listHtml += '<span style="display:flex;align-items:center;gap:8px;">';
      listHtml += '<span style="font-size:12px;font-weight:600;color:var(--coral);">~' + item.calories + '千卡</span>';
      listHtml += '<button onclick="removeFoodItem(' + i + ')" style="background:none;border:none;color:var(--text-light);cursor:pointer;font-size:16px;">✖</button>';
      listHtml += '</span></div>';
    });
    listEl.innerHTML = listHtml;
  }
}

function saveMeal() {
  const mealType = document.getElementById('mealType').value;
  if (tempFoodItems.length === 0) { showToast('请先添加食物'); return; }

  appData.meals.push({
    date: getToday(),
    mealType: mealType,
    items: [...tempFoodItems],
    note: ''
  });

  tempFoodItems = [];
  saveData(appData);
  showToast('饮食记录成功！🍲');
  renderPage('weight');
}

function addWater() {
  const today = getToday();
  const existing = appData.water.find(w => w.date === today);
  if (existing) {
    existing.cups = (existing.cups || 0) + 1;
  } else {
    appData.water.push({ date: today, cups: 1 });
  }
  saveData(appData);
  showToast('喝水记录成功！💧');
  renderPage('weight');
}

function addWeight() {
  const w = document.getElementById('weightInput').value;
  if (!w || parseFloat(w) <= 0) { showToast('请输入有效体重'); return; }
  appData.weight.push({ date: getToday(), weight: parseFloat(w) });
  saveData(appData);
  showToast('体重记录成功！⚖️');
  renderPage('weight');
}

function renderWeightChart() {
  const container = document.getElementById('weightChart');
  if (!container) return;

  const data = appData.weight.slice(-14);
  if (data.length < 2) return;

  const w = container.offsetWidth;
  const h = 200;
  const pad = { top: 20, right: 16, bottom: 30, left: 16 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const weights = data.map(d => d.weight);
  const minW = Math.floor(Math.min(...weights) - 1);
  const maxW = Math.ceil(Math.max(...weights) + 1);
  const range = maxW - minW || 1;

  let svg = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">';

  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    const val = maxW - (range / 4) * i;
    svg += '<line x1="' + pad.left + '" y1="' + y + '" x2="' + (w - pad.right) + '" y2="' + y + '" stroke="#f0e0d0" stroke-dasharray="4,4"/>';
    svg += '<text x="' + (pad.left - 4) + '" y="' + (y + 4) + '" text-anchor="end" font-size="9" fill="#8B7355">' + val.toFixed(1) + '</text>';
  }

  let pathD = '';
  data.forEach((d, i) => {
    const x = pad.left + (chartW / (data.length - 1 || 1)) * i;
    const y = pad.top + chartH - ((d.weight - minW) / range) * chartH;
    pathD += (i === 0 ? 'M' : 'L') + ' ' + x + ' ' + y + ' ';
  });

  svg += '<path d="' + pathD + '" fill="none" stroke="#FF8C42" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
  svg += '<path d="' + pathD + ' L ' + (pad.left + chartW) + ' ' + (pad.top + chartH) + ' L ' + pad.left + ' ' + (pad.top + chartH) + ' Z" fill="url(#weightGrad)" opacity="0.2"/>';
  svg += '<defs><linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF8C42"/><stop offset="100%" stop-color="#FFB5A7" stop-opacity="0"/></linearGradient></defs>';

  data.forEach((d, i) => {
    const x = pad.left + (chartW / (data.length - 1 || 1)) * i;
    const y = pad.top + chartH - ((d.weight - minW) / range) * chartH;
    svg += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="#fff" stroke="#FF8C42" stroke-width="2.5"/>';
    if (i % Math.ceil(data.length / 7) === 0 || i === data.length - 1) {
      const dateLabel = d.date.slice(5);
      svg += '<text x="' + x + '" y="' + (pad.top + chartH + 16) + '" text-anchor="middle" font-size="9" fill="#8B7355">' + dateLabel + '</text>';
    }
    svg += '<text x="' + x + '" y="' + (y - 10) + '" text-anchor="middle" font-size="10" fill="#4A3728" font-weight="600">' + d.weight + '</text>';
  });

  svg += '</svg>';
  container.innerHTML = svg;
}
