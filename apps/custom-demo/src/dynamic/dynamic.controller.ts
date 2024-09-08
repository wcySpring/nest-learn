import { Controller, Get } from "@nestjs/common"
import { DynamicService } from "./dynamic.service"

@Controller("/dynamic")
export class DynamicController {
  constructor(public DynamicService: DynamicService) {}
  @Get("/")
  getConfig() {
    console.log("dynamicController", this)

    return this.DynamicService.get("HELLO_MESSAGE")
  }
}
