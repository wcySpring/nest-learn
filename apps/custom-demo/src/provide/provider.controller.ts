/**
 * 关于注入使用案例
 */

import { Controller, Get, Inject } from "@nestjs/common";
import {
  LoggerClassService,
  LoggerService,
  UseValueService,
  UseFactory,
} from "src/inject/LoggerService";

@Controller("/p")
export class ProviderController {
  constructor(
    private loggerClassService: LoggerClassService,
    private loggerService: LoggerService,
    @Inject("StringToken") private useValueService: UseValueService,
    @Inject("FactoryToken") private useFactory: UseFactory
  ) {}
  @Get()
  index() {
    this.loggerClassService.log("index");
    this.loggerService.log("index");
    this.useValueService.log("index");
    this.useFactory.log("index");
    return "index";
  }
}
