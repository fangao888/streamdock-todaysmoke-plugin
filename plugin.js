let websocket = null;
let pluginUUID = null;
let context = null;
let currentImageIndex = 0;

const imagePaths = [
    'imagesSwitchGroup/静态图1.png',
    'imagesSwitchGroup/静态图2.png',
    'imagesSwitchGroup/静态图3.png'
];

async function createCustomImage(imagePath) {
    const canvas = document.createElement('canvas');
    canvas.width = 144;
    canvas.height = 144;

    const ctx = canvas.getContext('2d');

    const backgroundImage = await loadImage(imagePath);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(imagePath, canvas.width / 2, 20);
    ctx.fillText("Canvas绘制", canvas.width / 2, 100);

    return canvas.toDataURL();
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    pluginUUID = inPluginUUID;

    websocket = new WebSocket("ws://127.0.0.1:" + inPort);

    websocket.onopen = function() {
        registerPlugin(inRegisterEvent, inPluginUUID);
    }

    websocket.onmessage = function(evt) {
        const jsonObj = JSON.parse(evt.data);
        const event = jsonObj['event'];
        context = jsonObj['context'];

        if (event === "keyDown") {
            onKeyDown(context);
        }
    };
}

function registerPlugin(inRegisterEvent, inPluginUUID) {
    const json = {
        "event": inRegisterEvent,
        "uuid": inPluginUUID
    };
    websocket.send(JSON.stringify(json));
}

async function onKeyDown(context) {
    const imagePath = imagePaths[currentImageIndex];
    const imageBase64 = await createCustomImage(imagePath);
    setImage(context, imageBase64);

    currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
}

function setImage(context, imageBase64) {
    const json = {
        "event": "setImage",
        "context": context,
        "payload": {
            "image": imageBase64,
            "target": 0
        }
    };
    websocket.send(JSON.stringify(json));
}

// 为了兼容Elgato，我们使用相同的函数名
window.connectElgatoStreamDeckSocket = connectElgatoStreamDeckSocket;