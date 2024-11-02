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

    // 檢查登入狀態並顯示適當頁面
    if (!checkLoginStatus()) {
        document.getElementById('app').style.display = 'none';
        document.getElementById('loginPage').style.display = 'flex';
    } else {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        showCards();
    }

    // 隱藏載入動畫
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }, 500);

    setupScrollToTop();
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
            
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
                showCards();
            }
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

// 更新時鐘顯示
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// 處理工具詳情
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

// 更新個人資料顯示
function updateProfileInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
        const elements = {
            'profileName': userInfo.userName,
            'profilePhone': userInfo.phoneNumber,
            'profileRegDate': new Date(userInfo.registrationDate).toLocaleDateString()
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
}

// 處理登出
function handleLogout() {
    if (confirm('確定要登出嗎？')) {
        localStorage.removeItem('userInfo');
        location.reload();
    }
}

// 初始化應用
document.addEventListener('DOMContentLoaded', initializeApp);

// 錯誤處理
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error:', msg, '\nURL:', url, '\nLine:', lineNo, '\nColumn:', columnNo, '\nError object:', error);
    showToast('發生錯誤，請重新整理頁面');
    return false;
};
