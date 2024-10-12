/// <reference path="./utils/common.js" />
/// <reference path="./utils/axios.js" />

const plugin = new Plugins("今日抽烟")

// 设置token和请求间隔
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyOTY3NzgiLCJpYXQiOjE3Mjg3MDI4MDksImV4cCI6MTc1NDYyMjgwOSwibmJmIjoxNzI4NzAyODA5LCJzdWIiOiJzbW9rZS5pY2FyLnJlbiIsImp0aSI6ImQ1ZDM1NzgzM2NmZTM3NzYyMmM4ZmU0OWQ5ZTc3YWRjIn0.USKBtb-tFD_P0laDQ2ICawF4SlVWW44k94t5mMS32zw"
const UPDATE_INTERVAL = 5 * 60 * 1000 // 5分钟
const DISPLAY_UPDATE_INTERVAL = 1000 // 1秒

// 存储当前状态
let currentState = {
    smokeCount: 0,
    lastSmokeTime: 0
}

// 获取抽烟数据
async function getSmokeData() {
    try {
        const response = await axios.get('https://smk.xiao51.com/index.php?a=user_v5', {
            headers: { token: TOKEN }
        })
        return response.data.data
    } catch (error) {
        console.error('获取数据失败:', error)
        return null
    }
}

// 增加抽烟次数
async function addSmoke() {
    try {
        const response = await axios.post('https://smk.xiao51.com/index.php?a=smoke_add_v6', null, {
            headers: { token: TOKEN }
        })
        return response.data.data
    } catch (error) {
        console.error('增加抽烟次数失败:', error)
        return null
    }
}



// 格式化时间差
function formatTimeDiff(timestamp) {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp
    if (diff < 60) return `${diff}秒前`
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    return `${Math.floor(diff / 86400)}天前`
}

// 自定义的UTF-8编码函数
function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)))
}

function updateDisplay(context) {
    let svgContent

    switch (currentState.status) {
        case 'loading':
            svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
            <rect width="100%" height="100%" fill="#3498db"/>
            <g transform="translate(72,72)">
              <circle r="30" fill="none" stroke="white" stroke-width="4" stroke-dasharray="30 160">
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  dur="2s"
                  from="0"
                  to="360"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <text x="72" y="100" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">请求中...</text>
          </svg>
        `
            break
        case 'error':
            svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
            <rect width="100%" height="100%" fill="#2c3e50"/>
            <text x="72" y="72" font-family="Arial, sans-serif" font-size="20" fill="#e74c3c" text-anchor="middle" font-weight="bold">请求错误</text>
          </svg>
        `
            break
        default:
            svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
            <rect width="100%" height="100%" fill="#2c3e50"/>
            <text x="72" y="40" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">今日抽烟</text>
            <text x="72" y="80" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" font-weight="bold">${currentState.smokeCount}</text>
            <text x="72" y="110" font-family="Arial, sans-serif" font-size="16" fill="#bdc3c7" text-anchor="middle">上次: ${formatTimeDiff(currentState.lastSmokeTime)}</text>
          </svg>
        `
    }

    const svgBase64 = utf8_to_b64(svgContent)

    window.socket.send(JSON.stringify({
        event: "setImage",
        context: context,
        payload: {
            image: `data:image/svg+xml;base64,${svgBase64}`,
            target: 0
        }
    }))
}

// 主要action
plugin.action1 = new Actions({
    default: {},
    _willAppear({ context }) {
        this.initialLoad(context)
        setInterval(() => this.silentUpdate(context), UPDATE_INTERVAL)
        setInterval(() => updateDisplay(context), DISPLAY_UPDATE_INTERVAL)
    },
    async initialLoad(context) {
        currentState.status = 'loading'
        updateDisplay(context)

        const data = await getSmokeData()
        if (data) {
            currentState.smokeCount = parseInt(data.today[0].number.split(' ')[0])
            currentState.lastSmokeTime = parseInt(data.currentTime)
            currentState.status = 'idle'
        } else {
            currentState.status = 'error'
        }
        updateDisplay(context)
    },
    async silentUpdate(context) {
        const data = await getSmokeData()
        if (data) {
            currentState.smokeCount = parseInt(data.today[0].number.split(' ')[0])
            currentState.lastSmokeTime = parseInt(data.currentTime)
            updateDisplay(context)
        }
        // 如果请求失败，我们不改变状态，保持当前显示
    },
    async keyUp({ context }) {
        currentState.status = 'loading'
        updateDisplay(context)

        const data = await addSmoke()
        if (data) {
            currentState.smokeCount = parseInt(data.today[0].number.split(' ')[0])
            currentState.lastSmokeTime = parseInt(data.currentTime)
            currentState.status = 'idle'
        } else {
            currentState.status = 'error'
        }
        updateDisplay(context)
    }
})