import { Controller, Get, Param } from "@nestjs/common"
import { LoggerService } from "./logger.service"

@Controller("logger")
export class LoggerController {
  constructor(public logService: LoggerService) {
    console.log("LoggerController created")
  }

  @Get("log")
  getLog() {
    return this.logService.getLogs()
  }

  @Get("log/:info")
  setLog(@Param("info") info: string) {
    console.log(info)
    this.logService.setLogs(info)
  }
}
