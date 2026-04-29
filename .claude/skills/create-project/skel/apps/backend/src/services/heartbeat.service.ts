import { heartbeatRepository } from "@/repositories/heartbeat.repository";
import { Heartbeat } from "@repo/types"

export const heartbeatService = {
  async getHeartbeat(): Promise<Heartbeat> {
    return await heartbeatRepository.getHeartbeat()
  },
}