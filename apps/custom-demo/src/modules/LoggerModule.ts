import { Module } from "@nestjs/common"
import {
  LoggerClassService,
  LoggerService,
  UseValueService,
  UseFactory,
} from "src/inject/LoggerService"
@Module({
  providers: [
    {
      provide: "SUFFIX",
      useValue: "suffix",
    },
    LoggerClassService,
    {
      provide: LoggerService,
      useClass: LoggerService,
    },
    {
      provide: "StringToken",
      useValue: new UseValueService("prefix"),
    },
    {
      provide: "FactoryToken",
      inject: ["prefix1", "SUFFIX"],
      useFactory: (prefix1, suffix) => new UseFactory(prefix1, suffix),
    },
  ],
  exports: [
    "SUFFIX",
    LoggerClassService,
    LoggerService,
    "StringToken",
    "FactoryToken",
  ],
})
export class LoggerModule {}
