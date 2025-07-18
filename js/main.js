// 主题切换功能
(function() {
    'use strict';
    
    // 获取主题相关元素
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // 获取当前主题
    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
    
    // 应用主题
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    }
    
    // 更新主题图标
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    // 切换主题
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }
    
    // 监听系统主题变化
    function watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', function(e) {
                if (!localStorage.getItem('theme')) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    // 初始化主题
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;
        
        applyTheme(initialTheme);
        watchSystemTheme();
    }
    
    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        initTheme();
        
        // 绑定主题切换按钮事件
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    });
    
    // 键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Shift + L 切换主题
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            toggleTheme();
        }
    });
})();

// 平滑滚动功能
(function() {
    'use strict';
    
    // 为所有内部链接添加平滑滚动
    document.addEventListener('DOMContentLoaded', function() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 更新URL
                    history.pushState(null, null, href);
                }
            });
        });
    });
})();

// 返回顶部功能
(function() {
    'use strict';
    
    let backToTopButton;
    
    // 创建返回顶部按钮
    function createBackToTopButton() {
        backToTopButton = document.createElement('button');
        backToTopButton.innerHTML = '↑';
        backToTopButton.className = 'back-to-top';
        backToTopButton.setAttribute('aria-label', 'Back to top');
        backToTopButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--accent-color);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px var(--shadow-color);
        `;
        
        document.body.appendChild(backToTopButton);
        
        // 点击事件
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 显示/隐藏返回顶部按钮
    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    }
    
    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        createBackToTopButton();
        window.addEventListener('scroll', toggleBackToTopButton);
    });
})();

// 图片懒加载
(function() {
    'use strict';
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        });
    }
})();

// 代码块复制功能
(function() {
    'use strict';
    
    function createCopyButton() {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '📋';
        button.setAttribute('aria-label', 'Copy code');
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: var(--card-background);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        return button;
    }
    
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(function(codeBlock) {
            const pre = codeBlock.parentElement;
            if (pre.tagName === 'PRE') {
                pre.style.position = 'relative';
                
                const copyButton = createCopyButton();
                pre.appendChild(copyButton);
                
                // 鼠标悬停显示复制按钮
                pre.addEventListener('mouseenter', function() {
                    copyButton.style.opacity = '1';
                });
                
                pre.addEventListener('mouseleave', function() {
                    copyButton.style.opacity = '0';
                });
                
                // 复制功能
                copyButton.addEventListener('click', function() {
                    const code = codeBlock.textContent || codeBlock.innerText;
                    copyToClipboard(code).then(function() {
                        copyButton.innerHTML = '✅';
                        setTimeout(function() {
                            copyButton.innerHTML = '📋';
                        }, 2000);
                    }).catch(function(err) {
                        console.error('复制失败:', err);
                        copyButton.innerHTML = '❌';
                        setTimeout(function() {
                            copyButton.innerHTML = '📋';
                        }, 2000);
                    });
                });
            }
        });
    });
})();

// 外部链接处理
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
        
        externalLinks.forEach(function(link) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    });
})();

// 阅读进度条
(function() {
    'use strict';
    
    let progressBar;
    
    function createProgressBar() {
        progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(to right, var(--accent-color), #64b5f6);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        if (document.querySelector('.post-content')) {
            createProgressBar();
            window.addEventListener('scroll', updateProgress);
        }
    });
})();

// 表格响应式处理
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        const tables = document.querySelectorAll('.post-content table');
        
        tables.forEach(function(table) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            wrapper.style.cssText = `
                overflow-x: auto;
                margin: var(--spacing-md) 0;
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
            `;
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    });
})();