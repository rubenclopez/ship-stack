import { Router } from "express";
import userRoute from "./heartbeat.route";

const router = Router()

router.use("/heartbeat", userRoute)

export default router