/**
 * 根据北京时间自动切换深浅模式 (带调试信息)
 */
function autoSwitchThemeForBeijingTime() {
  // 在控制台打印一条消息，确认脚本开始运行
  console.log("自动切换主题脚本开始执行...");

  try {
    // 1. 计算当前的北京时间小时数
    const beijingHours = (new Date().getUTCHours() + 8) % 24;
    console.log("计算出的北京时间小时为: " + beijingHours);

    // 2. 判断是否为夜间 (北京时间晚上6点到次日早上6点)
    const isNight = beijingHours >= 18 || beijingHours < 6;
    console.log("根据北京时间判断，是否为夜间: " + isNight);

    // 3. 直接为 body 元素添加或移除 'darkmode' 类
    if (isNight) {
      console.log("正在应用深色模式 (添加 .darkmode 类)...");
      document.body.classList.add('darkmode');
    } else {
      console.log("正在应用浅色模式 (移除 .darkmode 类)...");
      document.body.classList.remove('darkmode');
    }
    console.log("主题切换脚本执行完毕。");

  } catch (e) {
    console.error("自动切换主题脚本出错:", e);
  }
}

// 确保脚本在 DOM 加载后运行
document.addEventListener('DOMContentLoaded', autoSwitchThemeForBeijingTime);