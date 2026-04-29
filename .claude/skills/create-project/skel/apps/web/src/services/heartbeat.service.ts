import { heartbeatRepository } from "@/repositories/heartbeat.repository";
import { Heartbeat } from "@/types"

export const heartbeatService = {
  async getHeartbeat(): Promise<Heartbeat> {
    return heartbeatRepository.getHeartbeat()
  }
}