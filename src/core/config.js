import { getServers } from './icesettings.js'

export function getRTCConfiguration() {
  const config = {}
  config.sdpSemantics = 'unified-plan'
  config.iceServers = getServers()
  return config
}
