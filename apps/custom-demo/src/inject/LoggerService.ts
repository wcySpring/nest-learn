/**
 * 想让当前类可以 被依赖注入需要使用@Injectable() 装饰器。@Injectable() 装饰器附加元数据，
 * 该元数据声明 CatsService 是可由 Nest IoC 容器管理的类
 */
import { Injectable, Inject } from "@nestjs/common";
@Injectable()
export class LoggerClassService {
  log(message) {
    console.log("LoggerClassService", message)
  }
}
@Injectable()
export class LoggerService {
  constructor(@Inject("SUFFIX") private suffix: string) {
    console.log("LoggerService", this.suffix);
  }
  log(message) {
    console.log("LoggerService", message);
  }
}

@Injectable()
export class UseValueService {
  constructor(prefix: string) {
    console.log("UseValueService", prefix);
  }
  log(message) {
    console.log("UseValueService", message);
  }
}

@Injectable()
export class UseFactory {
  constructor(private prefix1: string, private suffix: string) {
    console.log("UseFactory", prefix1, suffix);
  }
  log(message) {
    console.log("UseFactory", this.suffix);
  }
}

