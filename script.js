// 檢查用戶是否已登入
function checkLoginStatus() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        // 已登入，隱藏登入頁面，顯示主應用
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        // 載入用戶資料
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

    // 儲存用戶資訊
    const userInfo = {
        phoneNumber,
        userName,
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // 初始化用戶數據
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

    // 隱藏登入頁面，顯示主應用
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    loadUserData();
}

// 修改原本的初始化函數
document.addEventListener('DOMContentLoaded', function() {
    // 檢查登入狀態
    if (!checkLoginStatus()) {
        // 未登入，顯示登入頁面
        document.getElementById('app').style.display = 'none';
    }
    
    // 初始化應用
    initializeApp();
});

// 當文檔加載完成時執行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化
    initializeApp();
});

// 應用程式初始化
function initializeApp() {
    // 更新時鐘
    updateClock();
    setInterval(updateClock, 1000);

    // 設置導航監聽器
    setupNavigation();

    // 頁面加載完成後顯示內容
    window.onload = function() {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        showCards();
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
            // 移除所有活動狀態
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            
            // 添加新的活動狀態
            this.classList.add('active');
            
            // 切換頁面
            const targetPage = this.dataset.page;
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(targetPage).classList.add('active');
            
            // 顯示卡片動畫
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
        }, index * 200); // 每張卡片延遲200ms出現
    });
}

// 開始課程
function startLesson(lessonId = null) {
    if (lessonId) {
        alert(`開始課程：${lessonId}`);
    } else {
        alert('開始今日課程！');
    }
    // 這裡可以添加跳轉到具體課程的邏輯
}

// 顯示詳細信息
function showDetail(topic) {
    alert(`顯示 ${topic} 的詳細信息`);
    // 這裡可以添加顯示詳細信息的邏輯
}

// 切換章節展開/收起
function toggleChapter(chapterId) {
    const chapter = document.getElementById(chapterId);
    const allChapters = document.querySelectorAll('.chapter-content');
    
    // 收起其他章節
    allChapters.forEach(ch => {
        if (ch.id !== chapterId) {
            ch.classList.remove('active');
        }
    });
    
    // 切換當前章節
    chapter.classList.toggle('active');
}

// 用戶數據管理
let userData = {
    level: 1,
    exp: 0,
    completedLessons: [],
    badges: [],
    quizScores: {}
};

// 保存用戶數據
function saveUserData() {
    localStorage.setItem('aiLearningUserData', JSON.stringify(userData));
}

// 加載用戶數據
function loadUserData() {
    const savedData = localStorage.getItem('aiLearningUserData');
    if (savedData) {
        userData = JSON.parse(savedData);
        updateUI();
    }
}

// 更新UI顯示
function updateUI() {
    // 更新進度條
    document.querySelectorAll('.progress').forEach(progress => {
        const width = progress.getAttribute('data-progress') || '0';
        progress.style.width = width + '%';
    });

    // 更新完成的課程標記
    userData.completedLessons.forEach(lesson => {
        const lessonElement = document.querySelector(`[data-lesson="${lesson}"]`);
        if (lessonElement) {
            lessonElement.classList.add('completed');
        }
    });
}

// 錯誤處理函數
function handleError(error) {
    console.error('錯誤：', error);
    alert('發生錯誤，請稍後再試');
}

// 初始加載用戶數據
loadUserData();

// 處理登出
function handleLogout() {
    if (confirm('確定要登出嗎？')) {
        // 只清除登入狀態，保留學習記錄
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

// 在原本的 loadUserData 函數中添加
function loadUserData() {
    const savedData = localStorage.getItem('aiLearningUserData');
    if (savedData) {
        userData = JSON.parse(savedData);
        updateUI();
        updateProfileInfo(); // 添加這行
    }
}

// 用戶訂閱狀態
let userSubscription = {
    status: 'free', // 'free' 或 'premium'
    expireDate: null
};

// 檢查章節是否可訪問
function checkChapterAccess(chapterId) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return false;

    // 第一章總是免費
    if (chapterId === 'chapter1') return true;

    // 檢查用戶訂閱狀態
    return userSubscription.status === 'premium';
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
    // 這裡應該連接到實際的支付系統
    alert('此功能正在開發中！');
    // 模擬訂閱成功
    userSubscription.status = 'premium';
    userSubscription.expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天後
    localStorage.setItem('userSubscription', JSON.stringify(userSubscription));
    closeSubscriptionModal();
    loadUserData(); // 重新加載用戶數據
}

// 關閉訂閱提示
function closeSubscriptionModal() {
    document.querySelector('.subscription-modal').remove();
}

// 修改原有的 toggleChapter 函數
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
