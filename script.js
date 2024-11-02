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

        if (!localStorage.getItem('aiLearningUserData')) {
            const initialUserData = {
                level: 1,
                exp: 0,
                completedLessons: [],
                badges: [],
                quizScores: {}
            };
            localStorage.setItem('aiLearningUserData', JSON.stringify(initialUserData));
        }

        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        loadUserData();
        showToast('登入成功！', 'success');
    } catch (error) {
        console.error('登入時發生錯誤:', error);
        showToast('登入失敗，請稍後再試');
    }
}

// 顯示提示訊息
function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // 動畫效果
    setTimeout(() => toast.classList.add('show'), 100);
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

    window.onload = function() {
        document.getElementById('loader').style.display = 'none';
        if (!checkLoginStatus()) {
            document.getElementById('app').style.display = 'none';
        } else {
            document.getElementById('app').style.display = 'block';
            showCards();
        }
    };

    // 添加返回頂部按鈕
    setupScrollToTop();
}

// 載入訂閱狀態
function loadSubscriptionStatus() {
    const savedSubscription = localStorage.getItem('userSubscription');
    if (savedSubscription) {
        userSubscription = JSON.parse(savedSubscription);
        
        // 檢查訂閱是否過期
        if (userSubscription.expireDate && new Date(userSubscription.expireDate) < new Date()) {
            userSubscription.status = 'free';
            userSubscription.expireDate = null;
            localStorage.setItem('userSubscription', JSON.stringify(userSubscription));
        }
    }
}

// 返回頂部功能
function setupScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<span class="material-icons">arrow_upward</span>';
    document.body.appendChild(scrollBtn);

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    };

    scrollBtn.onclick = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
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
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const targetPage = this.dataset.page;
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(targetPage).classList.add('active');
            
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
        }, index * 200);
    });
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

// 顯示內容模態框
function showContentModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'content-modal';
    modal.innerHTML = `
        <div class="content-modal-body">
            <h2>${title}</h2>
            <div class="content-text">${content}</div>
            <button class="action-button" onclick="closeContentModal()">關閉</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// 關閉內容模態框
function closeContentModal() {
    const modal = document.querySelector('.content-modal');
    if (modal) {
        modal.remove();
    }
}

[原有的其他函數保持不變...]

// 初始化
document.addEventListener('DOMContentLoaded', initializeApp);

// 錯誤處理
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    showToast('發生錯誤，請重新整理頁面');
    return false;
};
