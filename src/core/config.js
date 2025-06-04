import { getServers } from './icesettings.js'

export async function getServerConfig(messageDiv) {
  const protocolEndPoint = `${location.origin}/config`

  try {
    const createResponse = await fetch(protocolEndPoint)
    return await createResponse.json()
  }
  catch (error) {
    messageDiv.style.display = 'block'
    messageDiv.innerText = 'Error fetching server config'
    throw error
  }
}

export function getRTCConfiguration() {
  const config = {}
  config.sdpSemantics = 'unified-plan'
  config.iceServers = getServers()
  return config
}
