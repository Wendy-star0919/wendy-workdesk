// ========== 护肤记录 ==========
function renderSkincare(main, today) {
  const todaySC = appData.skincare[today] || { am: [], pm: [] };

  // 兼容旧数据格式
  let amDone = [], pmDone = [];
  if (Array.isArray(todaySC)) {
    // 旧格式兼容
    todaySC.forEach(s => { amDone.push(s); pmDone.push(s); });
  } else {
    amDone = todaySC.am || [];
    pmDone = todaySC.pm || [];
  }

  // 护肤步骤
  const amSteps = [
    { id:'am_water', name:'水', icon:'💧' },
    { id:'am_lotion', name:'乳', icon:'🧴' },
    { id:'am_serum', name:'精华', icon:'✨' },
    { id:'am_sunscreen', name:'防晒', icon:'☀️' },
    { id:'am_cream', name:'面霜', icon:'🫙' },
    { id:'am_eye', name:'眼霜', icon:'👁️' },
  ];

  const pmSteps = [
    { id:'pm_water', name:'水', icon:'💧' },
    { id:'pm_lotion', name:'乳', icon:'🧴' },
    { id:'pm_serum', name:'精华', icon:'✨' },
    { id:'pm_cream', name:'面霜', icon:'🫙' },
    { id:'pm_eye', name:'眼霜', icon:'👁️' },
    { id:'pm_clean_mask', name:'清洁面膜', icon:'🧹' },
    { id:'pm_hydra_mask', name:'补水面膜', icon:'💦' },
  ];

  const amTotal = amSteps.length;
  const pmTotal = pmSteps.length;
  const amCount = amDone.length;
  const pmCount = pmDone.length;
  const amPct = Math.round(amCount / amTotal * 100);
  const pmPct = Math.round(pmCount / pmTotal * 100);

  let html = `
    <div class="page-header">
      <span class="star-icon"><img src="__STAR_B64__" alt=""></span>
      <div>
        <div class="page-title">护肤记录</div>
        <div class="page-subtitle">每一天都要精致 💫</div>
      </div>
    </div>
  `;

  // ===== 今日总览 =====
  html += `
    <div class="card" style="background:linear-gradient(135deg,#FFF5F8,#FFE8F0);">
      <div style="display:flex;justify-content:space-around;text-align:center;">
        <div>
          <div style="font-size:28px;font-weight:800;color:var(--coral);">${amCount}/${amTotal}</div>
          <div style="font-size:10px;color:var(--text-light);">☀️ 晨间护肤</div>
          <div style="height:6px;background:#eee;border-radius:3px;margin-top:4px;overflow:hidden;width:80px;margin-left:auto;margin-right:auto;">
            <div style="width:${amPct}%;height:100%;background:linear-gradient(90deg,#FFD93D,var(--coral));border-radius:3px;"></div>
          </div>
        </div>
        <div>
          <div style="font-size:28px;font-weight:800;color:var(--soft-pink);">${pmCount}/${pmTotal}</div>
          <div style="font-size:10px;color:var(--text-light);">🌙 夜间护肤</div>
          <div style="height:6px;background:#eee;border-radius:3px;margin-top:4px;overflow:hidden;width:80px;margin-left:auto;margin-right:auto;">
            <div style="width:${pmPct}%;height:100%;background:linear-gradient(90deg,#C5B9E8,var(--soft-pink));border-radius:3px;"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // ===== 晨间护肤 =====
  html += `
    <div class="card">
      <div class="card-title"><span class="emoji">☀️</span> 晨间护肤</div>
      <div class="skincare-log">
  `;

  amSteps.forEach(s => {
    const done = amDone.includes(s.id);
    html += `
      <div class="skincare-step ${done ? 'done' : ''}" onclick="toggleSkincare('${s.id}','am')">
        <div class="step-icon">${done ? '✅' : s.icon}</div>
        <div class="step-name">${s.name}</div>
      </div>
    `;
  });

  html += `</div></div>`;

  // ===== 夜间护肤 =====
  html += `
    <div class="card">
      <div class="card-title"><span class="emoji">🌙</span> 夜间护肤</div>
      <div class="skincare-log">
  `;

  pmSteps.forEach(s => {
    const done = pmDone.includes(s.id);
    html += `
      <div class="skincare-step ${done ? 'done' : ''}" onclick="toggleSkincare('${s.id}','pm')">
        <div class="step-icon">${done ? '✅' : s.icon}</div>
        <div class="step-name">${s.name}</div>
      </div>
    `;
  });

  html += `</div></div>`;

  // ===== 一键操作 =====
  html += `
    <div class="card">
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" style="flex:1;" onclick="completeAllSkincare('am')">☀️ 一键完成晨间</button>
        <button class="btn btn-pink" style="flex:1;" onclick="completeAllSkincare('pm')">🌙 一键完成夜间</button>
      </div>
    </div>
  `;

  // ===== 鼓励语 =====
  html += `
    <div class="card" style="background:linear-gradient(135deg,#FFF5F8,#FFE8F0);">
      <p style="font-size:13px;color:var(--soft-pink);text-align:center;font-weight:600;line-height:1.6;">
        ✨ 护肤不只是为了好看<br>
        更是对自己的温柔和宠爱<br>
        Wendy，你值得被好好对待 💕
      </p>
    </div>
  `;

  main.innerHTML = html;
}

function toggleSkincare(id, period) {
  const today = getToday();
  if (!appData.skincare[today]) appData.skincare[today] = { am: [], pm: [] };

  // 兼容旧数据
  if (Array.isArray(appData.skincare[today])) {
    appData.skincare[today] = { am: [], pm: [] };
  }

  const arr = appData.skincare[today][period] || [];
  const idx = arr.indexOf(id);

  if (idx >= 0) {
    arr.splice(idx, 1);
  } else {
    arr.push(id);
  }

  appData.skincare[today][period] = arr;
  saveData(appData);
  renderPage('skincare');
}

function completeAllSkincare(period) {
  const today = getToday();
  if (!appData.skincare[today]) appData.skincare[today] = { am: [], pm: [] };
  if (Array.isArray(appData.skincare[today])) {
    appData.skincare[today] = { am: [], pm: [] };
  }

  const ids = period === 'am'
    ? ['am_water','am_lotion','am_serum','am_sunscreen','am_cream','am_eye']
    : ['pm_water','pm_lotion','pm_serum','pm_cream','pm_eye','pm_clean_mask','pm_hydra_mask'];

  appData.skincare[today][period] = [...ids];
  saveData(appData);
  showToast(period === 'am' ? '☀️ 晨间护肤全部完成！' : '🌙 夜间护肤全部完成！');
  renderPage('skincare');
}

