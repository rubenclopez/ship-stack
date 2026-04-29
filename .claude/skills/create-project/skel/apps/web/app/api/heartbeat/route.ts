import { NextResponse } from "next/server"
import { heartbeatService } from "@/services/heartbeat.service"

export async function GET() {
  try {
    const heartbeat = await heartbeatService.getHeartbeat()
    return NextResponse.json({
      success: true,
      data: heartbeat
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: (error as Error).message
      },
      {
        status: 500
      }
    )
  }
}