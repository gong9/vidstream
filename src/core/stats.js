/**
 * create display string array from RTCStatsReport
 * @param {RTCStatsReport} report - current RTCStatsReport
 * @param {RTCStatsReport} lastReport - latest RTCStatsReport
 * @return {Array<string>} - display string Array
 */
export function createDisplayStringArray(report, lastReport) {
  const array = []

  report.forEach((stat) => {
    if (stat.type === 'inbound-rtp') {
      array.push(`${stat.kind} receiving stream stats`)

      if (stat.codecId !== undefined) {
        const codec = report.get(stat.codecId)
        array.push(`Codec: ${codec.mimeType}`)

        if (codec.sdpFmtpLine) {
          codec.sdpFmtpLine.split(';').forEach((fmtp) => {
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
          codec.sdpFmtpLine.split(';').forEach((fmtp) => {
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

export function createDisplayStatsArray(report, lastReport) {
  const result = {}

  report.forEach((stat) => {
    if (stat.type === 'inbound-rtp' || stat.type === 'outbound-rtp') {
      const isAudio = stat.kind === 'audio'
      const isVideo = stat.kind === 'video'
      if (!isAudio && !isVideo)
        return

      const obj = {}
      // codec 相关
      if (stat.codecId !== undefined) {
        const codec = report.get(stat.codecId)
        if (codec?.mimeType)
          obj.codec = codec.mimeType
        if (codec?.payloadType !== undefined)
          obj.payloadType = codec.payloadType
        if (codec?.clockRate !== undefined)
          obj.clockRate = codec.clockRate
        if (codec?.channels !== undefined)
          obj.channels = codec.channels
        if (codec?.sdpFmtpLine) {
          codec.sdpFmtpLine.split(';').forEach((fmtp) => {
            const [k, v] = fmtp.split('=')
            if (k && v)
              obj[k.trim()] = isNaN(Number(v)) ? v.trim() : Number(v)
          })
        }
      }
      // video 相关
      if (isVideo) {
        if (stat.decoderImplementation !== undefined)
          obj.decoder = stat.decoderImplementation
        if (stat.frameWidth !== undefined && stat.frameHeight !== undefined)
          obj.resolution = { width: stat.frameWidth, height: stat.frameHeight }

        if (stat.framesPerSecond !== undefined)
          obj.framerate = stat.framesPerSecond
      }
      // bitrate
      if (lastReport && lastReport.has(stat.id)) {
        const lastStats = lastReport.get(stat.id)
        const duration = (stat.timestamp - lastStats.timestamp) / 1000
        let bytes
        if (stat.bytesReceived !== undefined && lastStats.bytesReceived !== undefined)
          bytes = stat.bytesReceived - lastStats.bytesReceived
        else if (stat.bytesSent !== undefined && lastStats.bytesSent !== undefined)
          bytes = stat.bytesSent - lastStats.bytesSent
        else
          bytes = undefined

        if (bytes !== undefined && duration > 0) {
          const bitrate = (8 * bytes / duration) / 1000
          obj.bitrate = `${bitrate.toFixed(2)} kbit/sec`
        }
      }
      // 过滤 undefined 字段
      Object.keys(obj).forEach((key) => {
        if (obj[key] === undefined)
          delete obj[key]
      })
      if (Object.keys(obj).length > 0) {
        if (isAudio)
          result.audio = obj
        if (isVideo)
          result.video = obj
      }
    }
  })
  return result
}
