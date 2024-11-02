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
    status: 'free', // 'free' 或 'premium'
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
    const phoneNumber = document.getElementById('phoneNumber').value;
    const userName = document.getElementById('userName').value;

    if (!phoneNumber || !userName) {
        alert('請填寫完整資料');
        return;
    }

    if (phoneNumber.length !== 8 || !/^\d+$/.test(phoneNumber)) {
        alert('請輸入有效的8位手機號碼');
        return;
    }

    const userInfo = {
        phoneNumber,
        userName,
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

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
}

// 應用程式初始化
function initializeApp() {
    updateClock();
    setInterval(updateClock, 1000);
    setupNavigation();

    window.onload = function() {
        document.getElementById('loader').style.display = 'none';
        if (!checkLoginStatus()) {
            document.getElementById('app').style.display = 'none';
        } else {
            document.getElementById('app').style.display = 'block';
            showCards();
        }
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
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 200);
    });
}

// 開始課程
function startLesson(lessonId = null) {
    if (lessonId) {
        alert(`開始課程：${lessonId}`);
    } else {
        alert('開始今日課程！');
    }
}

// 顯示詳細信息
function showDetail(topic) {
    alert(`顯示 ${topic} 的詳細信息`);
}

// 工具詳情
function showToolDetail(toolId) {
    alert(`顯示 ${toolId} 的使用指南`);
}

// 檢查章節是否可訪問
function checkChapterAccess(chapterId) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return false;
    if (chapterId === 'chapter1') return true;
    return userSubscription.status === 'premium';
}

// 切換章節展開/收起
function toggleChapter(chapterId) {
    if (!checkChapterAccess(chapterId)) {
        showSubscriptionModal();
        return;
    }

    const chapter = document.getElementById(chapterId);
    const allChapters = document.querySelectorAll('.chapter-content');
    
    allChapters.forEach(ch => {
        if (ch.id !== chapterId) {
            ch.classList.remove('active');
        }
    });
    
    chapter.classList.toggle('active');
}

// 顯示訂閱提示
function showSubscriptionModal() {
    const modal = document.createElement('div');
    modal.className = 'subscription-modal';
    modal.innerHTML = `
        <div class="subscription-content">
            <h2>升級到專業版</h2>
            <p>解鎖所有進階內容：</p>
            <ul>
                <li>✓ 所有章節完整內容</li>
                <li>✓ 專業練習題</li>
                <li>✓ 實戰項目案例</li>
                <li>✓ 專家社群支援</li>
            </ul>
            <div class="subscription-price">
                <span class="price">NT$ 299</span>
                <span class="period">/月</span>
            </div>
            <button class="action-button" onclick="handleSubscription()">立即升級</button>
            <button class="close-button" onclick="closeSubscriptionModal()">稍後再說</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// 處理訂閱
function handleSubscription() {
    alert('此功能正在開發中！');
    userSubscription.status = 'premium';
    userSubscription.expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    localStorage.setItem('userSubscription', JSON.stringify(userSubscription));
    closeSubscriptionModal();
    loadUserData();
}

// 關閉訂閱提示
function closeSubscriptionModal() {
    document.querySelector('.subscription-modal').remove();
}

// 處理登出
function handleLogout() {
    if (confirm('確定要登出嗎？')) {
        localStorage.removeItem('userInfo');
        location.reload();
    }
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

// 加載用戶數據
function loadUserData() {
    const savedData = localStorage.getItem('aiLearningUserData');
    if (savedData) {
        userData = JSON.parse(savedData);
        updateUI();
        updateProfileInfo();
    }
}

// 更新UI顯示
function updateUI() {
    document.querySelectorAll('.progress').forEach(progress => {
        const width = progress.getAttribute('data-progress') || '0';
        progress.style.width = width + '%';
    });

    userData.completedLessons.forEach(lesson => {
        const lessonElement = document.querySelector(`[data-lesson="${lesson}"]`);
        if (lessonElement) {
            lessonElement.classList.add('completed');
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', initializeApp);
