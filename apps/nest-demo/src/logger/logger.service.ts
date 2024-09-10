import { Injectable } from "@nestjs/common"

@Injectable()
export class LoggerService {
  public logInfo = []

  getLogs() {
    return this.logInfo
  }

  setLogs(log: string) {
    console.log(this.logInfo)
    console.log(log)

    this.logInfo.push(log)
  }
}
