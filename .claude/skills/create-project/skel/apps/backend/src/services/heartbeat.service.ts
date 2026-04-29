// import { userRepository } from "../repositories/user.repository";
import { Heartbeat } from "../types"

export const heartbeatService = {
  async getHeartbeat(): Promise<Heartbeat> {
    return {
        status: 'online'
    }
  },
}