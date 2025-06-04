const allServersKey = 'servers'

export function getServers() {
  const storedServers = window.localStorage.getItem(allServersKey)

  if (storedServers === null || storedServers === '')
    return [{ urls: ['stun:stun.l.google.com:19302'] }]

  else
    return JSON.parse(storedServers)
}

export function getRTCConfiguration(): RTCConfiguration {
  const config: RTCConfiguration = {
    iceServers: getServers(),
    // @ts-expect-error
    sdpSemantics: 'unified-plan',
  }
  return config
}

export function createDisplayStringArray(report: any, lastReport: any) {
  const array: string[] = []

  report.forEach((stat: any) => {
    if (stat.type === 'inbound-rtp') {
      array.push(`${stat.kind} receiving stream stats`)

      if (stat.codecId !== undefined) {
        const codec = report.get(stat.codecId)
        array.push(`Codec: ${codec.mimeType}`)

        if (codec.sdpFmtpLine) {
          codec.sdpFmtpLine.split(';').forEach((fmtp: any) => {
            array.push(` - ${fmtp}`)
          })
        }

        if (codec.payloadType)
          array.push(` - payloadType=${codec.payloadType}`)

        if (codec.clockRate)
          array.push(` - clockRate=${codec.clockRate}`)

        if (codec.channels)
          array.push(` - channels=${codec.channels}`)
      }

      if (stat.kind === 'video') {
        array.push(`Decoder: ${stat.decoderImplementation}`)
        array.push(`Resolution: ${stat.frameWidth}x${stat.frameHeight}`)
        array.push(`Framerate: ${stat.framesPerSecond}`)
      }

      if (lastReport && lastReport.has(stat.id)) {
        const lastStats = lastReport.get(stat.id)
        const duration = (stat.timestamp - lastStats.timestamp) / 1000
        const bitrate = (8 * (stat.bytesReceived - lastStats.bytesReceived) / duration) / 1000
        array.push(`Bitrate: ${bitrate.toFixed(2)} kbit/sec`)
      }
    }
    else if (stat.type === 'outbound-rtp') {
      array.push(`${stat.kind} sending stream stats`)

      if (stat.codecId !== undefined) {
        const codec = report.get(stat.codecId)
        array.push(`Codec: ${codec.mimeType}`)

        if (codec.sdpFmtpLine) {
          codec.sdpFmtpLine.split(';').forEach((fmtp: any) => {
            array.push(` - ${fmtp}`)
          })
        }

        if (codec.payloadType)
          array.push(` - payloadType=${codec.payloadType}`)

        if (codec.clockRate)
          array.push(` - clockRate=${codec.clockRate}`)

        if (codec.channels)
          array.push(` - channels=${codec.channels}`)
      }

      if (stat.kind === 'video') {
        array.push(`Encoder: ${stat.encoderImplementation}`)
        array.push(`Resolution: ${stat.frameWidth}x${stat.frameHeight}`)
        array.push(`Framerate: ${stat.framesPerSecond}`)
      }

      if (lastReport && lastReport.has(stat.id)) {
        const lastStats = lastReport.get(stat.id)
        const duration = (stat.timestamp - lastStats.timestamp) / 1000
        const bitrate = (8 * (stat.bytesSent - lastStats.bytesSent) / duration) / 1000
        array.push(`Bitrate: ${bitrate.toFixed(2)} kbit/sec`)
      }
    }
  })

  return array
}
