# Stream Deck 中文文档 V2.8

仅记录常用简易API，更详细的属性还请阅读官方文档。

## 属性检查器HTML模板

<!-- input -->
<div class="sdpi-item">
    <div class="sdpi-item-label">xxx</div>
    <input class="sdpi-item-value"></input>
</div>

<!-- button -->
<div class="sdpi-item">
    <div class="sdpi-item-label">Button</div>
    <button class="sdpi-item-value">Click Me</button>
</div>

<!-- textarea -->
<div type="textarea" class="sdpi-item">
    <div class="sdpi-item-label">xxx</div>
    <textarea class="sdpi-item-value" type="textarea"></textarea>
</div>

<!-- select -->
<div type="select" class="sdpi-item">
    <div class="sdpi-item-label">xxx</div>
    <select class="sdpi-item-value">
        <option value="xxx">xxx</option>
    </select>
</div>

<!-- checkbox -->
<div type="checkbox" class="sdpi-item">
    <div class="sdpi-item-label">Check Me</div>
    <div class="sdpi-item-value">
        <span class="sdpi-item-child">
            <input id="chk1" type="checkbox" value="left">
            <label for="chk1"><span></span>left</label>
        </span>
        <span class="sdpi-item-child">
            <input id="chk2" type="checkbox" value="right">
            <label for="chk2"><span></span>right</label>
        </span>
    </div>
</div>

<!-- radio -->
<div type="radio" class="sdpi-item">
    <div class="sdpi-item-label">Radio</div>
    <div class="sdpi-item-value">
        <span class="sdpi-item-child">
            <input id="rdio1" type="radio" name="rdio" checked>
            <label for="rdio1" class="sdpi-item-label"><span></span>on</label>
        </span>
        <span class="sdpi-item-child">
            <input id="rdio2" type="radio" value="off" name="rdio">
            <label for="rdio2" class="sdpi-item-label"><span></span>off</label>
        </span>
        <span class="sdpi-item-child">
            <input id="rdio3" type="radio" value="mute" name="rdio">
            <label for="rdio3" class="sdpi-item-label"><span></span>mute</label>
        </span>
    </div>
</div>

<!-- range -->
<div type="range" class="sdpi-item" id="temperatureslider">
    <div class="sdpi-item-label">xxx</div>
    <input type="range" class="sdpi-item-value" min="0" max="100" value=37>
</div>

## 使用Nodejs增强你的插件

有了 app.exe 你可以直接使用此方式运行nodejs文件而无需Nodejs环境。

// 执行 Nodejs （app.exe）脚本源码

``` js
const { execFile } = require('child_process');
const port = process.argv[3];
const uuid = process.argv[5];
const event = process.argv[7];
const language = JSON.parse(process.argv[9]).application.language;
execFile('node', ['./index.js', port, uuid, event, language], error => {
    if (error) return;
});
```
## 插件能够触发的事件

didReceiveSettings 操作持久化数据触发

{
  "action": "com.elgato.example.action1", 
  "event": "didReceiveSettings", 
  "context": uniqueValue, 
  "device": uniqueValue, 
  "payload": {
   "settings": {<json data>},
    "coordinates": {
      "column": 3, 
      "row": 1
    }, 
    "isInMultiAction": false
  }
}

keyDown/keyUp/touchTap 按下时/释放按键时/触摸时触发

{
    "action": "com.elgato.example.action1",
    "event": "keyUp",
    "context": uniqueValue,
    "device": uniqueValue,
    "payload": {
    "settings": {<json data>},
    "coordinates": {
        "column": 3, 
        "row": 1
    },
    "state": 0,
    "userDesiredState": 1,
    "isInMultiAction": false
    }
}

willAppear/willDisappear 当一个插件创建/删除时时触发

{
    "action": "com.elgato.example.action1",
    "event": "willAppear",
    "context": uniqueValue,
    "device": uniqueValue,
    "payload": {
    "settings": {<json data>},
    "coordinates": {
        "column": 3, 
        "row": 1
    },
    "state": 0,
    "isInMultiAction": false
    }
}

titleParametersDidChange 当用户修改标题/标题参数时触发

{
  "action": "com.elgato.example.action1", 
  "event": "titleParametersDidChange", 
  "context": "uniqueValue", 
  "device": "uniqueValue", 
  "payload": {
    "coordinates": {
      "column": 3, 
      "row": 1
    }, 
    "settings": {<json data>}, 
    "state": 0, 
    "title": "", 
    "titleParameters": {
      "fontFamily": "", 
      "fontSize": 12, 
      "fontStyle": "", 
      "fontUnderline": false, 
      "showTitle": true, 
      "titleAlignment": "bottom", 
      "titleColor": "#ffffff"
    }
  }
}

deviceDidConnect/deviceDidDisconnect 当设备从计算机上插入/拔出时触发

{
 "event": "deviceDidConnect",
    "device": uniqueValue,
     "deviceInfo": {
        "name": "Device Name",
        "type": 0,
         "size": {
            "columns": 5,
            "rows": 3
        }
    },
}

propertyInspectorDidAppear/propertyInspectorDidDisappear 当属性选择器出现/隐藏在用户界面时触发

{
  "action": "com.elgato.example.action1", 
  "event": "propertyInspectorDidAppear", 
  "context": uniqueValue, 
  "device": uniqueValue
}

sendToPlugin 当属性选择器使用 sendToPlugin 事件时触发

{
  "action": "com.elgato.example.action1", 
  "event": "sendToPlugin", 
  "context": uniqueValue, 
  "payload": {<json data>}
}

dialRotate 当旋钮旋转

{
  "action": "com.elgato.example.action1", 
  "event": "sendToPlugin", 
  "context": uniqueValue, 
  "payload": {<json data>}
}

dialDown 当旋钮按下

{
  "action": "com.elgato.example.action1", 
  "event": "sendToPlugin", 
  "context": uniqueValue, 
  "payload": {<json data>}
}


## 属性选择器能够触发的事件

didReceiveSettings 操作持久化数据触发

sendToPropertyInspector 当插件使用 sendToPropertyInspector 事件时触发

{
  "action": "com.elgato.example.action1", 
  "event": "sendToPropertyInspector", 
  "context": uniqueValue, 
  "payload": {<json data>}
}

## 插件能够发送的事件

setSettings 持久保存操作实例的数据

openUrl 在默认浏览器中打开URL

setTitle 动态更改操作实例的标题

setImage 动态更改动作实例显示的图像

setState 更改支持多个状态的操作实例的状态

sendToPropertyInspector 向属性检查器发送有效负载

## 属性选择器能够发送的事件

setSettings 持久保存操作实例的数据

openUrl 在默认浏览器中打开URL

sendToPlugin 向插件发送有效负载