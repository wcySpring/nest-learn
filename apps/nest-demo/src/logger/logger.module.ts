import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { LoggerController } from "./logger.controller"
import { LoggerService } from "./logger.service"
import { LoggerMiddleware } from "./logger.middleware"

@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("logger")
  }
}
