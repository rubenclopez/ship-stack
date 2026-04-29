import { Router } from "express";
import { heartbeatController } from "../controllers/heartbeat.controller";

const router = Router()

router.get("/", heartbeatController.getHeartbeat)

export default router