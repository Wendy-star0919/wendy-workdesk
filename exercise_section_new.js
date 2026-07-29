// ========== 运动记录 ==========
// 运动热量库 (每30分钟消耗千卡，基于60kg体重估算)
const EXERCISE_CAL = {
  'running': 300, 'jogging': 200, 'walking': 120, 'stairs': 250,
  'yoga': 100, 'pilates': 120, 'hiit': 350, 'strength': 180,
  'cycling': 250, 'swimming': 320, 'dance': 200, 'jump_rope': 350,
  'stretching': 60, 'badminton': 200, 'basketball': 280,
};

function renderExercise(main, today) {
  // 运动库
  const exercises = [
    { id:'running', name:'跑步', icon:'🏃', cat:'有氧', calPer30:300, desc:'户外或跑步机跑步' },
    { id:'jogging', name:'快走/慢跑', icon:'🚶', cat:'有氧', calPer30:200, desc:'中等强度有氧' },
    { id:'walking', name:'散步', icon:'🚶‍♀️', cat:'有氧', calPer30:120, desc:'轻松散步，放松身心' },
    { id:'stairs', name:'爬楼梯', icon:'🪜', cat:'有氧', calPer30:250, desc:'高效燃脂运动' },
    { id:'cycling', name:'骑行', icon:'🚴', cat:'有氧', calPer30:250, desc:'户外或动感单车' },
    { id:'swimming', name:'游泳', icon:'🏊', cat:'有氧', calPer30:320, desc:'全身运动，消耗大' },
    { id:'jump_rope', name:'跳绳', icon:'🪢', cat:'有氧', calPer30:350, desc:'高效燃脂，10分钟=慢跑30分钟' },
    { id:'dance', name:'跳舞/健身操', icon:'💃', cat:'有氧', calPer30:200, desc:'帕梅拉、尊巴等' },
    { id:'hiit', name:'HIIT高强度间歇', icon:'⚡', cat:'有氧', calPer30:350, desc:'短时高效燃脂' },
    { id:'strength', name:'力量训练', icon:'🏋️', cat:'无氧', calPer30:180, desc:'哑铃、器械、自重训练' },
    { id:'yoga', name:'瑜伽', icon:'🧘', cat:'柔韧', calPer30:100, desc:'拉伸放松，改善体态' },
    { id:'pilates', name:'普拉提', icon:'🤸', cat:'柔韧', calPer30:120, desc:'核心训练，塑形' },
    { id:'stretching', name:'拉伸放松', icon:'🙆', cat:'柔韧', calPer30:60, desc:'运动后拉伸，防止受伤' },
    { id:'badminton', name:'羽毛球', icon:'🏸', cat:'球类', calPer30:200, desc:'趣味性强的全身运动' },
    { id:'basketball', name:'篮球', icon:'🏀', cat:'球类', calPer30:280, desc:'团队竞技运动' },
  ];

  // 今日运动记录
  const todayRecords = (appData.exerciseRecords || []).filter(r => r.date === today);
  const todayTotalMin = todayRecords.reduce((s, r) => s + (r.minutes || 0), 0);
  const todayTotalCal = todayRecords.reduce((s, r) => s + (r.calories || 0), 0);
  const goalMin = 30;

  // 运动评估
  let evalText, evalColor, evalEmoji;
  if (todayTotalMin === 0) {
    evalText = '今天还没运动哦，动起来吧！';
    evalColor = 'var(--text-light)';
    evalEmoji = '😴';
  } else if (todayTotalMin < 20) {
    evalText = '轻度运动，适合恢复日';
    evalColor = 'var(--mint)';
    evalEmoji = '🌱';
  } else if (todayTotalMin < 45) {
    evalText = '适中运动量，很棒！';
    evalColor = '#4CAF50';
    evalEmoji = '👍';
  } else if (todayTotalMin < 90) {
    evalText = '运动量充足，效果显著！';
    evalColor = 'var(--warm-orange)';
    evalEmoji = '🔥';
  } else {
    evalText = '高强度运动，注意休息恢复哦~';
    evalColor = 'var(--coral)';
    evalEmoji = '⚠️';
  }

  const progress = Math.min(100, Math.round((todayTotalMin / goalMin) * 100));

  let html = `
    <div class="page-header">
      <span class="star-icon"><img src="__STAR_B64__" alt=""></span>
      <div>
        <div class="page-title">运动记录</div>
        <div class="page-subtitle">每天动一动，健康又美丽 ✨</div>
      </div>
    </div>
  `;

  // ===== 今日总览卡片 =====
  html += `
    <div class="card" style="background:linear-gradient(135deg,#FFF5F0,#FFE8E0);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:12px;color:var(--text-light);margin-bottom:4px;">今日运动</div>
          <div style="display:flex;align-items:baseline;gap:4px;">
            <span style="font-size:36px;font-weight:800;color:var(--coral);">${todayTotalMin}</span>
            <span style="font-size:14px;color:var(--text-light);">分钟</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px;color:var(--text-light);margin-bottom:4px;">消耗热量</div>
          <div style="display:flex;align-items:baseline;gap:4px;">
            <span style="font-size:36px;font-weight:800;color:var(--warm-orange);">${todayTotalCal}</span>
            <span style="font-size:14px;color:var(--text-light);">千卡</span>
          </div>
        </div>
      </div>
      <div style="margin-top:10px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-light);">
          <span>目标 ${goalMin} 分钟</span><span>${progress}%</span>
        </div>
        <div class="ex-progress-bar">
          <div class="ex-progress-fill" style="width:${progress}%;"></div>
        </div>
      </div>
      <div style="text-align:center;margin-top:8px;font-size:14px;font-weight:600;color:${evalColor};">
        ${evalEmoji} ${evalText}
      </div>
    </div>
  `;

  // ===== 有氧/无氧分类统计 =====
  const catStats = {};
  todayRecords.forEach(r => {
    const ex = exercises.find(e => e.id === r.exerciseId);
    const cat = ex ? ex.cat : '其他';
    catStats[cat] = catStats[cat] || { min: 0, cal: 0 };
    catStats[cat].min += (r.minutes || 0);
    catStats[cat].cal += (r.calories || 0);
  });

  if (Object.keys(catStats).length > 0) {
    html += '<div class="card"><div class="card-title"><span class="emoji">📊</span> 运动分类统计</div>';
    html += '<div style="display:flex;justify-content:space-around;text-align:center;">';
    for (const [cat, stats] of Object.entries(catStats)) {
      html += '<div><div style="font-size:20px;font-weight:700;color:var(--coral);">' + stats.min + '</div><div style="font-size:10px;color:var(--text-light);">' + cat + '(分钟)</div></div>';
    }
    html += '</div></div>';
  }

  // ===== 添加运动记录 =====
  html += `
    <div class="card">
      <div class="card-title"><span class="emoji">➕</span> 记录运动</div>
      <select id="exSelect" style="width:100%;margin-bottom:6px;" onchange="onExSelectChange()">
        <option value="">选择运动项目...</option>
  `;

  // 按类别分组
  const cats = ['有氧', '无氧', '柔韧', '球类'];
  cats.forEach(cat => {
    const items = exercises.filter(e => e.cat === cat);
    html += '<optgroup label="' + cat + '">';
    items.forEach(ex => {
      html += '<option value="' + ex.id + '" data-cal="' + ex.calPer30 + '">' + ex.icon + ' ' + ex.name + ' (' + ex.desc + ')</option>';
    });
    html += '</optgroup>';
  });

  html += `
      </select>
      <div style="display:flex;gap:6px;">
        <input id="exMinutes" placeholder="运动时长(分钟)" type="number" value="30" style="flex:1;">
        <input id="exCalories" placeholder="消耗热量" type="number" style="flex:1;" readonly>
      </div>
      <div style="font-size:11px;color:var(--text-light);margin-top:4px;" id="exCalHint">选择运动项目自动计算热量</div>
      <button class="btn btn-primary" style="margin-top:8px;width:100%;" onclick="addExerciseRecord()">✅ 记录运动</button>
    </div>
  `;

  // ===== 快捷运动按钮 =====
  html += '<div class="card"><div class="card-title"><span class="emoji">⚡</span> 快捷记录</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';

  const quickEx = [
    { id:'walking', label:'🚶 散步30分', min:30 },
    { id:'jogging', label:'🏃 慢跑30分', min:30 },
    { id:'jump_rope', label:'🪢 跳绳10分', min:10 },
    { id:'yoga', label:'🧘 瑜伽20分', min:20 },
    { id:'stairs', label:'🪜 爬楼15分', min:15 },
    { id:'stretching', label:'🙆 拉伸10分', min:10 },
  ];

  quickEx.forEach(q => {
    const exInfo = exercises.find(e => e.id === q.id);
    const cal = Math.round(exInfo.calPer30 * q.min / 30);
    html += '<button class="btn btn-small" style="background:#FFF0E8;border:1px solid #FFD4C0;border-radius:16px;padding:6px 12px;font-size:12px;cursor:pointer;" onclick="quickAddExercise(\'' + q.id + '\',' + q.min + ',' + cal + ')">' + q.label + ' ~' + cal + '千卡</button>';
  });

  html += '</div></div>';

  // ===== 今日运动列表 =====
  if (todayRecords.length > 0) {
    html += '<div class="card"><div class="card-title"><span class="emoji">📋</span> 今日运动记录</div>';
    todayRecords.forEach((r, i) => {
      const ex = exercises.find(e => e.id === r.exerciseId);
      const icon = ex ? ex.icon : '🏃';
      const name = ex ? ex.name : r.exerciseId;
      const cat = ex ? ex.cat : '';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">';
      html += '<div style="display:flex;align-items:center;gap:8px;">';
      html += '<span style="font-size:24px;">' + icon + '</span>';
      html += '<div><div style="font-weight:600;font-size:14px;">' + name + '</div>';
      html += '<div style="font-size:11px;color:var(--text-light);">' + cat + ' · ' + r.minutes + '分钟 · ' + r.calories + '千卡</div></div>';
      html += '</div>';
      html += '<button onclick="deleteExerciseRecord(' + i + ')" style="background:none;border:none;color:var(--text-light);font-size:16px;cursor:pointer;">✖</button>';
      html += '</div>';
    });
    html += '</div>';
  }

  // ===== 本周统计 =====
  const weekStats = getWeekExerciseStatsNew();
  html += `
    <div class="card">
      <div class="card-title"><span class="emoji">📈</span> 本周运动统计</div>
      <div style="display:flex;justify-content:space-around;text-align:center;margin-bottom:10px;">
        <div><div style="font-size:22px;font-weight:800;color:var(--coral);">${weekStats.days}</div><div style="font-size:10px;color:var(--text-light);">运动天数</div></div>
        <div><div style="font-size:22px;font-weight:800;color:var(--warm-orange);">${weekStats.totalMin}</div><div style="font-size:10px;color:var(--text-light);">总分钟</div></div>
        <div><div style="font-size:22px;font-weight:800;color:var(--mint);">${weekStats.avgMin}</div><div style="font-size:10px;color:var(--text-light);">日均分钟</div></div>
        <div><div style="font-size:22px;font-weight:800;color:#FF8C42;">${weekStats.totalCal}</div><div style="font-size:10px;color:var(--text-light);">总消耗千卡</div></div>
      </div>
      <!-- 简易周视图 -->
      <div style="display:flex;justify-content:space-between;gap:4px;">`;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const dayRecords = (appData.exerciseRecords || []).filter(r => r.date === key);
    const dayMin = dayRecords.reduce((s, r) => s + (r.minutes || 0), 0);
    const dayLabel = ['日','一','二','三','四','五','六'][d.getDay()];
    const isToday = i === 0;
    const barH = Math.min(dayMin, 120);
    const barColor = dayMin >= 30 ? 'var(--coral)' : dayMin > 0 ? 'var(--warm-orange)' : '#e0e0e0';

    html += '<div style="flex:1;text-align:center;">';
    html += '<div style="font-size:9px;color:' + (isToday ? 'var(--coral)' : 'var(--text-light)') + ';font-weight:' + (isToday ? '700' : '400') + ';">' + dayLabel + '</div>';
    html += '<div style="height:60px;display:flex;align-items:flex-end;justify-content:center;margin:2px 0;">';
    html += '<div style="width:70%;max-width:24px;height:' + (barH / 120 * 60) + 'px;background:' + barColor + ';border-radius:4px 4px 0 0;min-height:' + (dayMin > 0 ? '4px' : '0') + ';"></div>';
    html += '</div>';
    html += '<div style="font-size:9px;color:var(--text-light);">' + (dayMin > 0 ? dayMin + '\'' : '-') + '</div>';
    html += '</div>';
  }

  html += '</div></div>';

  // 运动建议
  html += `
    <div class="card" style="background:linear-gradient(135deg,#F0FFF0,#E0F8E0);">
      <div class="card-title"><span class="emoji">💡</span> 运动建议</div>
      <p style="font-size:13px;color:var(--text-light);line-height:1.6;">` + getExerciseAdviceNew(todayTotalMin, weekStats) + `</p>
    </div>
  `;

  main.innerHTML = html;
}

function onExSelectChange() {
  const sel = document.getElementById('exSelect');
  const minInput = document.getElementById('exMinutes');
  const calInput = document.getElementById('exCalories');
  const hint = document.getElementById('exCalHint');

  const option = sel.selectedOptions[0];
  const calPer30 = option ? parseFloat(option.dataset.cal || 0) : 0;
  const minutes = parseFloat(minInput.value) || 30;

  if (calPer30 > 0) {
    const cal = Math.round(calPer30 * minutes / 30);
    calInput.value = cal;
    hint.textContent = '自动计算：每30分钟约' + calPer30 + '千卡';
  } else {
    calInput.value = '';
    hint.textContent = '选择运动项目自动计算热量';
  }
}

function addExerciseRecord() {
  const sel = document.getElementById('exSelect');
  const minInput = document.getElementById('exMinutes');
  const calInput = document.getElementById('exCalories');

  const exerciseId = sel.value;
  const minutes = parseFloat(minInput.value);
  const calories = parseFloat(calInput.value) || 0;

  if (!exerciseId) { showToast('请选择运动项目'); return; }
  if (!minutes || minutes <= 0) { showToast('请输入运动时长'); return; }

  if (!appData.exerciseRecords) appData.exerciseRecords = [];

  appData.exerciseRecords.push({
    date: getToday(),
    exerciseId,
    minutes,
    calories
  });

  saveData(appData);
  showToast('运动记录成功！💪');
  renderPage('exercise');
}

function quickAddExercise(exId, minutes, calories) {
  if (!appData.exerciseRecords) appData.exerciseRecords = [];

  appData.exerciseRecords.push({
    date: getToday(),
    exerciseId: exId,
    minutes,
    calories
  });

  saveData(appData);
  showToast('快捷记录成功！⚡');
  renderPage('exercise');
}

function deleteExerciseRecord(index) {
  const today = getToday();
  const todayRecords = (appData.exerciseRecords || []).filter(r => r.date === today);
  if (index >= 0 && index < todayRecords.length) {
    const globalIndex = appData.exerciseRecords.indexOf(todayRecords[index]);
    if (globalIndex >= 0) {
      appData.exerciseRecords.splice(globalIndex, 1);
      saveData(appData);
      showToast('已删除');
      renderPage('exercise');
    }
  }
}

function getWeekExerciseStatsNew() {
  const today = new Date();
  let days = 0, totalMin = 0, totalCal = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const dayRecords = (appData.exerciseRecords || []).filter(r => r.date === key);
    if (dayRecords.length > 0) days++;
    totalMin += dayRecords.reduce((s, r) => s + (r.minutes || 0), 0);
    totalCal += dayRecords.reduce((s, r) => s + (r.calories || 0), 0);
  }
  return { days, totalMin, totalCal, avgMin: Math.round(totalMin / 7), avgCal: Math.round(totalCal / 7) };
}

function getExerciseAdviceNew(todayMin, weekStats) {
  const tips = [];

  if (todayMin === 0) {
    tips.push('🏃 今天还没运动呢！哪怕散步20分钟也是好的开始~');
    tips.push('💡 建议从低强度开始：散步、拉伸、瑜伽都是不错的选择');
  } else if (todayMin < 20) {
    tips.push('🌱 轻度运动适合恢复日，明天可以适当加量');
    tips.push('💧 运动后记得补充水分哦！');
  } else if (todayMin < 45) {
    tips.push('👍 运动量适中，保持这个节奏很棒！');
    tips.push('🧘 运动后做5-10分钟拉伸，缓解肌肉酸痛');
  } else if (todayMin < 90) {
    tips.push('🔥 今天运动量很足！注意补充蛋白质帮助肌肉恢复');
    tips.push('😴 保证充足睡眠，让身体好好恢复');
  } else {
    tips.push('⚠️ 今天运动强度较高，明天建议做轻度活动或休息');
    tips.push('🥩 记得补充优质蛋白和碳水，防止肌肉流失');
  }

  if (weekStats.days < 3) {
    tips.push('📅 本周运动天数偏少，建议每周至少运动3-5天');
  } else if (weekStats.days >= 5) {
    tips.push('🌟 本周运动频率很棒，坚持就是胜利！');
  }

  tips.push('💪 Wendy，每一次运动都是在投资健康！');
  return tips.join('<br>');
}
