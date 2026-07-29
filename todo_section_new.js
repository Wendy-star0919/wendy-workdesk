// ========== 待办清单 ==========
function renderShopping(main, today) {
  // 待购清单
  const shopPending = (appData.shopItems || []).filter(s => !s.bought);
  const shopBought = (appData.shopItems || []).filter(s => s.bought);
  // 待办明细
  const todoPending = (appData.todoItems || []).filter(t => !t.done);
  const todoDone = (appData.todoItems || []).filter(t => t.done);

  let html = `
    <div class="page-header">
      <span class="star-icon"><img src="__STAR_B64__" alt=""></span>
      <div>
        <div class="page-title">待办清单</div>
        <div class="page-subtitle">想买什么、要做什么，都记下来 📝</div>
      </div>
    </div>

    <!-- 两列布局 -->
    <div style="display:flex;gap:8px;">

      <!-- 左列：待购清单 -->
      <div style="flex:1;min-width:0;">
        <div class="card" style="padding:10px;">
          <div style="font-size:14px;font-weight:700;color:var(--coral);margin-bottom:8px;">🛒 待购清单 <span style="font-size:11px;color:var(--text-light);font-weight:400;">(${shopPending.length})</span></div>

          <!-- 添加待购 -->
          <div style="display:flex;gap:4px;margin-bottom:8px;">
            <input id="shopName" placeholder="要买什么?" style="flex:1;font-size:12px;padding:6px 8px;" onkeypress="if(event.key==='Enter')addShopItem()">
            <button class="btn btn-xs btn-pink" style="white-space:nowrap;" onclick="addShopItem()">+</button>
          </div>

          <!-- 待购列表 -->
          <div id="shopList">
  `;

  if (shopPending.length === 0 && shopBought.length === 0) {
    html += '<div style="text-align:center;color:var(--text-light);font-size:12px;padding:12px 0;">暂无待购~</div>';
  }

  shopPending.forEach(s => {
    const realIdx = appData.shopItems.indexOf(s);
    html += '<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid #f5f0eb;">';
    html += '<div onclick="toggleShopItem(' + realIdx + ')" style="width:20px;height:20px;border:2px solid #ccc;border-radius:50%;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;"></div>';
    html += '<span style="flex:1;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escHtml(s.name) + '</span>';
    html += '</div>';
  });

  if (shopBought.length > 0) {
    html += '<div style="margin-top:6px;font-size:10px;color:var(--text-light);">✅ 已购买</div>';
    shopBought.forEach(s => {
      const realIdx = appData.shopItems.indexOf(s);
      html += '<div style="display:flex;align-items:center;gap:6px;padding:3px 0;">';
      html += '<div onclick="toggleShopItem(' + realIdx + ')" style="width:20px;height:20px;background:#4CAF50;border:2px solid #4CAF50;border-radius:50%;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">✓</div>';
      html += '<span style="flex:1;font-size:12px;color:var(--text-light);text-decoration:line-through;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escHtml(s.name) + '</span>';
      html += '</div>';
    });
  }

  html += `
          </div>
        </div>
      </div>

      <!-- 右列：待办明细 -->
      <div style="flex:1;min-width:0;">
        <div class="card" style="padding:10px;">
          <div style="font-size:14px;font-weight:700;color:var(--warm-orange);margin-bottom:8px;">📋 待办事项 <span style="font-size:11px;color:var(--text-light);font-weight:400;">(${todoPending.length})</span></div>

          <!-- 添加待办 -->
          <div style="display:flex;gap:4px;margin-bottom:6px;">
            <input id="todoText" placeholder="要做什么?" style="flex:1;font-size:12px;padding:6px 8px;" onkeypress="if(event.key==='Enter')addTodoItem()">
            <button class="btn btn-xs btn-primary" style="white-space:nowrap;" onclick="addTodoItem()">+</button>
          </div>
          <input id="todoDate" type="date" style="width:100%;font-size:11px;padding:4px 8px;margin-bottom:8px;">

          <!-- 待办列表 -->
          <div id="todoList">
  `;

  if (todoPending.length === 0 && todoDone.length === 0) {
    html += '<div style="text-align:center;color:var(--text-light);font-size:12px;padding:12px 0;">暂无待办~</div>';
  }

  // 按日期排序
  const sortedTodo = [...todoPending].sort((a, b) => (a.date || '9999') > (b.date || '9999') ? 1 : -1);
  sortedTodo.forEach(t => {
    const realIdx = appData.todoItems.indexOf(t);
    const todayStr = getToday();
    let dateLabel = '';
    let dateColor = 'var(--text-light)';
    if (t.date) {
      if (t.date < todayStr) { dateLabel = '⚠️ ' + t.date.slice(5); dateColor = 'var(--coral)'; }
      else if (t.date === todayStr) { dateLabel = '📍 今天'; dateColor = 'var(--warm-orange)'; }
      else { dateLabel = t.date.slice(5); }
    }

    html += '<div style="display:flex;align-items:flex-start;gap:6px;padding:5px 0;border-bottom:1px solid #f5f0eb;">';
    html += '<div onclick="toggleTodoItem(' + realIdx + ')" style="width:20px;height:20px;border:2px solid #ccc;border-radius:50%;cursor:pointer;flex-shrink:0;margin-top:1px;"></div>';
    html += '<div style="flex:1;min-width:0;">';
    html += '<div style="font-size:12px;word-wrap:break-word;">' + escHtml(t.text) + '</div>';
    if (dateLabel) html += '<div style="font-size:10px;color:' + dateColor + ';margin-top:1px;">' + dateLabel + '</div>';
    html += '</div></div>';
  });

  if (todoDone.length > 0) {
    html += '<div style="margin-top:6px;font-size:10px;color:var(--text-light);">✅ 已完成</div>';
    todoDone.forEach(t => {
      const realIdx = appData.todoItems.indexOf(t);
      html += '<div style="display:flex;align-items:flex-start;gap:6px;padding:3px 0;">';
      html += '<div onclick="toggleTodoItem(' + realIdx + ')" style="width:20px;height:20px;background:#4CAF50;border:2px solid #4CAF50;border-radius:50%;cursor:pointer;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">✓</div>';
      html += '<div style="flex:1;min-width:0;">';
      html += '<div style="font-size:12px;color:var(--text-light);text-decoration:line-through;word-wrap:break-word;">' + escHtml(t.text) + '</div>';
      html += '</div></div>';
    });
  }

  html += `
          </div>
        </div>
      </div>

    </div>

    <!-- 底部统计 -->
    <div class="card" style="background:linear-gradient(135deg,#FFF8F0,#FFEEDD);padding:12px;">
      <div style="display:flex;justify-content:space-around;text-align:center;">
        <div>
          <div style="font-size:20px;font-weight:800;color:var(--coral);">${shopPending.length}</div>
          <div style="font-size:10px;color:var(--text-light);">待购</div>
        </div>
        <div>
          <div style="font-size:20px;font-weight:800;color:var(--mint);">${shopBought.length}</div>
          <div style="font-size:10px;color:var(--text-light);">已购</div>
        </div>
        <div>
          <div style="font-size:20px;font-weight:800;color:var(--warm-orange);">${todoPending.length}</div>
          <div style="font-size:10px;color:var(--text-light);">待办</div>
        </div>
        <div>
          <div style="font-size:20px;font-weight:800;color:#4CAF50;">${todoDone.length}</div>
          <div style="font-size:10px;color:var(--text-light);">已完成</div>
        </div>
      </div>
    </div>
  `;

  main.innerHTML = html;

  // 默认设置待办日期为今天
  const todoDateInput = document.getElementById('todoDate');
  if (todoDateInput) todoDateInput.value = getToday();
}

function addShopItem() {
  const name = document.getElementById('shopName').value.trim();
  if (!name) { showToast('请输入商品名称'); return; }
  if (!appData.shopItems) appData.shopItems = [];
  appData.shopItems.push({ name, bought: false, addedAt: getToday() });
  saveData(appData);
  showToast('已加入待购清单！🛒');
  renderPage('shopping');
}

function addTodoItem() {
  const text = document.getElementById('todoText').value.trim();
  const date = document.getElementById('todoDate').value;
  if (!text) { showToast('请输入待办内容'); return; }
  if (!appData.todoItems) appData.todoItems = [];
  appData.todoItems.push({ text, date: date || '', done: false, addedAt: getToday() });
  saveData(appData);
  showToast('待办已添加！📋');
  renderPage('shopping');
}

function toggleShopItem(idx) {
  appData.shopItems[idx].bought = !appData.shopItems[idx].bought;
  saveData(appData);
  renderPage('shopping');
}

function toggleTodoItem(idx) {
  appData.todoItems[idx].done = !appData.todoItems[idx].done;
  saveData(appData);
  renderPage('shopping');
}

