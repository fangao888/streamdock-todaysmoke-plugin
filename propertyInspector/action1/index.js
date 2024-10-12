/// <reference path="../utils/common.js" />
/// <reference path="../utils/action.js" />

const $local = false, $back = false, $dom = {
    main: $('.sdpi-wrapper')
};

const $propEvent = {
    didReceiveSettings(data) {
        console.log('接收到设置:', data);
    },
    sendToPropertyInspector(data) {
        console.log('收到插件消息:', data);
    }
};

// 显示属性检查器
$dom.main.style.display = 'block';