// 用戶數據管理
let userData = {
    level: 1,
    exp: 0,
    completedLessons: [],
    badges: [],
    quizScores: {}
};

// 用戶訂閱狀態
let userSubscription = {
    status: 'free',
    expireDate: null
};

// 檢查用戶是否已登入
function checkLoginStatus() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        loadUserData();
        return true;
    }
    return false;
}

// 處理登入
function handleLogin() {
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const userName = document.getElementById('userName').value.trim();

    if (!phoneNumber || !userName) {
        showToast('請填寫完整資料');
        return;
    }

    if (phoneNumber.length !== 8 || !/^\d+$/.test(phoneNumber)) {
        showToast('請輸入有效的8位手機號碼');
        return;
    }

    const userInfo = {
        phoneNumber,
        userName,
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        loadUserData();
        showToast('登入成功！', 'success');
        initializeApp();
    } catch (error) {
        console.error('登入時發生錯誤:', error);
        showToast('登入失敗，請稍後再試');
    }
}

// 顯示提示訊息
function showToast(message, type = 'error') {
    // 先移除現有的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // 添加顯示動畫
    setTimeout(() => toast.classList.add('show'), 100);

    // 自動隱藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 應用程式初始化
function initializeApp() {
    updateClock();
    setInterval(updateClock, 1000);
    setupNavigation();
    loadSubscriptionStatus();
    showCards();

    // 隱藏載入動畫
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 300);

    // 更新個人資料
    updateProfileInfo();
}

// 更新時鐘顯示
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('clock').textContent = timeString;
}

// 設置導航功能
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有活動狀態
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            
            // 添加當前活動狀態
            this.classList.add('active');
            
            // 切換頁面
            const targetPage = this.dataset.page;
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(targetPage).classList.add('active');
            
            // 顯示新頁面的卡片動畫
            showCards();
        });
    });
}

// 顯示卡片動畫
function showCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.remove('visible');
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
}

// 載入訂閱狀態
function loadSubscriptionStatus() {
    const savedSubscription = localStorage.getItem('userSubscription');
    if (savedSubscription) {
        userSubscription = JSON.parse(savedSubscription);
        if (userSubscription.expireDate && new Date(userSubscription.expireDate) < new Date()) {
            userSubscription.status = 'free';
            userSubscription.expireDate = null;
            localStorage.setItem('userSubscription', JSON.stringify(userSubscription));
        }
    }
}

// 開始課程
function startLesson(lessonId = null) {
    if (!checkLoginStatus()) {
        showToast('請先登入');
        return;
    }

    if (lessonId) {
        showToast(`開始課程：${lessonId}`, 'success');
    } else {
        showToast('開始今日課程！', 'success');
    }
}

// 顯示詳細信息
function showDetail(topic) {
    const details = {
        'chatgpt-4': {
            title: 'ChatGPT 4.0 更新詳情',
            content: '最新版本支援圖像識別、代碼生成等多項新功能...'
        },
        'ai-drawing': {
            title: 'AI 繪圖完整指南',
            content: '學習使用 Midjourney、DALL-E 等熱門 AI 繪圖工具...'
        },
        'ai-cases': {
            title: 'AI 產業應用案例',
            content: '了解 AI 在各個領域的實際應用案例...'
        }
    };

    const detail = details[topic];
    if (detail) {
        showContentModal(detail.title, detail.content);
    }
}

// 顯示工具詳情
function showToolDetail(toolId) {
    const toolDetails = {
        'chatgpt': {
            title: 'ChatGPT 使用指南',
            content: '了解如何有效使用 ChatGPT 提升工作效率...'
        },
        'midjourney': {
            title: 'Midjourney 創作指南',
            content: '掌握 Midjourney 的進階提示詞技巧...'
        },
        'github-copilot': {
            title: 'GitHub Copilot 開發指南',
            content: '使用 AI 加速你的程式開發流程...'
        }
    };

    const detail = toolDetails[toolId];
    if (detail) {
        showContentModal(detail.title, detail.content);
    }
}

// 顯示內容模態框
function showContentModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'content-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${title}</h2>
            <div class="modal-body">${content}</div>
            <button class="action-button" onclick="closeModal(this)">關閉</button>
        </div>
    `;
    document.body.appendChild(modal);

    // 添加動畫效果
    setTimeout(() => modal.classList.add('show'), 10);
}

// 關閉模態框
function closeModal(button) {
    const modal = button.closest('.content-modal');
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
}

// 更新個人資料顯示
function updateProfileInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
        document.getElementById('profileName').textContent = userInfo.userName;
        document.getElementById('profilePhone').textContent = userInfo.phoneNumber;
        document.getElementById('profileRegDate').textContent = 
            new Date(userInfo.registrationDate).toLocaleDateString();
    }
}

// 處理登出
function handleLogout() {
    if (confirm('確定要登出嗎？')) {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('aiLearningUserData');
        location.reload();
    }
}

// 載入用戶數據
function loadUserData() {
    const savedData = localStorage.getItem('aiLearningUserData');
    if (savedData) {
        userData = JSON.parse(savedData);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 檢查登入狀態
    if (!checkLoginStatus()) {
        document.getElementById('app').style.display = 'none';
        document.getElementById('loginPage').style.display = 'flex';
    } else {
        initializeApp();
    }
});

// 錯誤處理
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error:', msg, '\nURL:', url, '\nLine:', lineNo, '\nColumn:', columnNo, '\nError object:', error);
    showToast('發生錯誤，請重新整理頁面');
    return false;
};
