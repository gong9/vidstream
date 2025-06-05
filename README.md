# vidstream

A streaming video component for web applications.

## Installation

```bash
npm install vidstream
```

## Usage

```html
<streaming-video host="localhost:80" width="100%" height="100%" />
```


## Events

- `stream-progress` 流进度
- `stream-connected` 流连接成功
- `stream-stats` 流统计信息
- `stream-disconnected` 流断开连接
- `stream-ended` 流结束
- `stream-log` 流日志
- `stream-message` 渲染端返回的消息


## Methods

- `connect` 进行流连接
- `disconnect` 断开流连接
- `send` 发送消息





