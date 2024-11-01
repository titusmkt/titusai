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