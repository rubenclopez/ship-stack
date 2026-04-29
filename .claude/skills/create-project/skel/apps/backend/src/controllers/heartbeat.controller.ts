import { Request, Response, NextFunction } from "express"
import { heartbeatService } from "../services/heartbeat.service";

export const heartbeatController = {
  async getHeartbeat(req: Request, res: Response, next: NextFunction) {
    try {
      const heartbeat = await heartbeatService.getHeartbeat()
      res.json({
        success: true,
        data: heartbeat
      })
    } catch (error) {
      next(error) // passes to error middleware
    }
  }
}