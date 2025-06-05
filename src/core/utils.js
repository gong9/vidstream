import mitt from 'mitt'

const emitterHandle = mitt()

export const emitter = {
    on: emitterHandle.on,
    off: emitterHandle.off,
    emit: emitterHandle.emit,
    all: emitterHandle.all,
}

export function parseStreamStats(lines) {
  const result = {}
  let currentSection = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed === 'audio receiving stream stats') {
      currentSection = 'audio'
      result[currentSection] = {}
    }
    else if (trimmed === 'video receiving stream stats') {
      currentSection = 'video'
      result[currentSection] = {}
    }
    else if (trimmed.startsWith('Codec:')) {
      result[currentSection].codec = trimmed.split(':')[1].trim()
    }
    else if (trimmed.startsWith('Decoder:')) {
      result[currentSection].decoder = trimmed.split(':')[1].trim()
    }
    else if (trimmed.startsWith('Resolution:')) {
      const [width, height] = trimmed.split(':')[1].trim().split('x')
      result[currentSection].resolution = {
        width: parseInt(width),
        height: parseInt(height),
      }
    }
    else if (trimmed.startsWith('Framerate:')) {
      result[currentSection].framerate = parseFloat(trimmed.split(':')[1].trim())
    }
    else if (trimmed.startsWith('Bitrate:')) {
      result[currentSection].bitrate = trimmed.split(':')[1].trim()
    }
    else if (trimmed.startsWith('-')) {
      const [key, value] = trimmed.slice(1).split('=').map(s => s.trim())
      result[currentSection][key] = isNaN(value) ? value : Number(value)
    }
  }

  return result
}
