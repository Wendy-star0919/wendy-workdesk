// ========== 读书记录 ==========
function renderReading(main, today) {
  // 书籍类别
  const categories = [
    { id: 'parenting', name: '育儿', icon: '👶', color: '#FFB5A7' },
    { id: 'economy', name: '经济', icon: '💰', color: '#A3D9B1' },
    { id: 'philosophy', name: '哲学', icon: '🤔', color: '#C5B9E8' },
    { id: 'literature', name: '文艺', icon: '🎨', color: '#A8D8EA' },
    { id: 'psychology', name: '心理', icon: '🧠', color: '#F4845F' },
    { id: 'history', name: '历史', icon: '📜', color: '#D4C4B0' },
    { id: 'science', name: '科普', icon: '🔬', color: '#81C784' },
    { id: 'biography', name: '传记', icon: '👤', color: '#FFD93D' },
    { id: 'business', name: '商业', icon: '📈', color: '#FF8C42' },
    { id: 'other', name: '其他', icon: '📚', color: '#B0B0B0' },
  ];

  const catMap = {};
  categories.forEach(c => catMap[c.id] = c);

  let html = `
    <div class="page-header">
      <span class="star-icon"><img src="__STAR_B64__" alt=""></span>
      <div>
        <div class="page-title">读书记录</div>
        <div class="page-subtitle">目标：每月2-3本 📖</div>
      </div>
    </div>
  `;

  // ===== 添加新书 =====
  html += `
    <div class="card">
      <div class="card-title"><span class="emoji">➕</span> 添加新书</div>
      <div style="display:flex;gap:6px;">
        <input id="bookName" placeholder="书名" style="flex:1;">
        <input id="bookAuthor" placeholder="作者" style="flex:1;">
      </div>
      <div style="display:flex;gap:6px;margin-top:6px;">
        <input id="bookPages" placeholder="总页数" type="number" style="flex:1;">
        <input id="bookCurrent" placeholder="当前页" type="number" value="0" style="flex:1;">
      </div>
      <div style="margin-top:6px;">
        <select id="bookCategory" style="width:100%;">
  `;

  categories.forEach(c => {
    html += '<option value="' + c.id + '">' + c.icon + ' ' + c.name + '</option>';
  });

  html += `
        </select>
      </div>
      <button class="btn btn-primary" style="margin-top:8px;width:100%;" onclick="addBook()">📚 添加这本书</button>
    </div>
  `;

  // ===== 类别统计 =====
  if (appData.books.length > 0) {
    const catCount = {};
    appData.books.forEach(b => {
      const cat = b.category || 'other';
      catCount[cat] = (catCount[cat] || 0) + 1;
    });

    html += '<div class="card"><div class="card-title"><span class="emoji">📊</span> 书籍分类</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    categories.forEach(c => {
      const count = catCount[c.id] || 0;
      if (count > 0) {
        html += '<div style="background:' + c.color + '20;border:1px solid ' + c.color + ';border-radius:16px;padding:4px 10px;font-size:12px;display:flex;align-items:center;gap:4px;">';
        html += '<span>' + c.icon + '</span><span>' + c.name + '</span><span style="font-weight:700;color:' + c.color + ';">' + count + '</span>';
        html += '</div>';
      }
    });
    html += '</div></div>';
  }

  // ===== 按类别分组显示书籍 =====
  const monthStart = getMonthStart();
  const monthBooks = appData.books.filter(b => b.addedAt >= monthStart);

  if (appData.books.length === 0) {
    html += '<div class="card"><p style="color:var(--text-light);text-align:center;padding:16px;">还没有添加书籍，快来记录吧~</p></div>';
  } else {
    // 按类别分组
    const grouped = {};
    appData.books.forEach(b => {
      const cat = b.category || 'other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(b);
    });

    // 按类别顺序展示
    categories.forEach(c => {
      const books = grouped[c.id];
      if (!books || books.length === 0) return;

      html += '<div class="card">';
      html += '<div class="card-title"><span class="emoji">' + c.icon + '</span> ' + c.name + ' <span style="font-size:11px;color:var(--text-light);font-weight:400;">(' + books.length + '本)</span></div>';

      books.forEach(b => {
        const idx = appData.books.indexOf(b);
        const pct = b.totalPages > 0 ? Math.round((b.currentPage / b.totalPages) * 100) : 0;
        const isFinished = pct >= 100;
        const barColor = isFinished ? '#4CAF50' : c.color;

        html += '<div class="book-item">';
        html += '<div style="font-size:28px;">' + c.icon + '</div>';
        html += '<div style="flex:1;">';
        html += '<div style="font-weight:700;">' + escHtml(b.name) + (isFinished ? ' <span style="font-size:11px;color:#4CAF50;">✅ 已读完</span>' : '') + '</div>';
        html += '<div style="font-size:11px;color:var(--text-light);">' + escHtml(b.author || '未知') + ' · ' + (b.currentPage || 0) + '/' + (b.totalPages || 0) + '页</div>';
        html += '<div class="book-progress-bar"><div class="book-progress-fill" style="width:' + pct + '%;background:' + barColor + ';"></div></div>';
        html += '<div style="font-size:10px;color:var(--text-light);text-align:right;">' + pct + '%</div>';
        html += '</div>';
        html += '<button class="btn btn-sm btn-outline" onclick="updateBookProgress(' + idx + ')">更新</button>';
        html += '</div>';
      });

      html += '</div>';
    });
  }

  // ===== 阅读提醒 =====
  html += `
    <div class="card" style="background:linear-gradient(135deg,#F8F0FF,#EDE0FF);">
      <div class="card-title"><span class="emoji">⏰</span> 阅读提醒</div>
      <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
        📌 每周日记得检查阅读进度哦~<br>
        ${monthBooks.length >= 2 ? '🎉 本月已达标，继续保持！' : monthBooks.length >= 1 ? '📖 本月在读1本，再加1本达成目标！' : '🌟 本月还没有开始读书，选一本好书吧~'}
      </p>
    </div>
  `;

  main.innerHTML = html;
}

function addBook() {
  const name = document.getElementById('bookName').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const totalPages = parseInt(document.getElementById('bookPages').value) || 0;
  const currentPage = parseInt(document.getElementById('bookCurrent').value) || 0;
  const category = document.getElementById('bookCategory').value;

  if (!name) { showToast('请输入书名'); return; }
  appData.books.push({ name, author, totalPages, currentPage, category, addedAt: getToday() });
  saveData(appData);
  showToast('书籍添加成功！📚');
  renderPage('reading');
}

function updateBookProgress(idx) {
  const current = prompt('当前读到第几页？', appData.books[idx].currentPage);
  if (current === null) return;
  const p = parseInt(current) || 0;
  appData.books[idx].currentPage = Math.min(p, appData.books[idx].totalPages);
  saveData(appData);
  if (p >= appData.books[idx].totalPages) {
    showToast('恭喜读完这本书！🎉');
  } else {
    showToast('进度已更新！');
  }
  renderPage('reading');
}

