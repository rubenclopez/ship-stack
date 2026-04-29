import type { Heartbeat } from "@repo/types"

export const heartbeatRepository = {
  async getHeartbeat(): Promise<Heartbeat> {
    const data = {
      status: 'online'
    }
    const error = null as unknown as Error

    if (error) throw new Error(error.message)
    return data as Heartbeat
  }
}