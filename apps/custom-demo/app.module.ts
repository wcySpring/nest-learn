// controller 用来处理请求
import { AppController } from "./app.controller";

import { Module } from "@nestjs/common";
import {
  LoggerClassService,
  LoggerService,
  UseFactory,
  UseValueService,
} from "./src/inject/LoggerService";
import { ProviderController } from "./src/provide/provider.controller";
import { LoggerModule } from "src/modules/LoggerModule"
import { DynamicConfigModule } from "src/dynamic/dynamic.module"
import { DynamicController } from "src/dynamic/dynamic.controller"
// nest 创建一个新的模块。这个模块是一个类，用 @Module 装饰器装饰
/**
 * @Module是一个装饰器，用于定义模块
 * 模块是组织代码的基本单元，它将相关的组件(控制器、服务器、提供者)组合在一起
 * Nest的模块系统是受Angular启动
 *
 * controllers  接收应用的特定请求。路由机制控制哪个控制器接收哪些请求
 *
 * providers 将由 Nest 注入器实例化并且至少可以在该模块中共享的提供程序，注册需要依赖注入的类，
 * 与 Nest 不同，Angularproviders 是在全局作用域内注册的。一旦定义，它们随处可用。然而，Nest 将提供程序
 * 封装在模块作用域内。如果不首先导入封装模块，则无法在其他地方使用模块的提供程序使用 定义provider类用@Injectable() 装饰器
 * 在Module里注册Provider类，在控制里面声明或者说使用Provder类
 */
@Module({
  controllers: [AppController, ProviderController, DynamicController],
  // providers: [
  //   {
  //     provide: "SUFFIX", //后缀
  //     useValue: "suffix",
  //   },
  //   LoggerClassService, //这样定义provider的话，token值就是这个类本身，这种写法最多 90%以上用这个就可以了
  //   {
  //     provide: LoggerService,
  //     useClass: LoggerService, //说明提供的是一个类
  //   },
  //   {
  //     //也个也是一种定义provider的方法
  //     provide: "StringToken", //这是一个token，也称为标志 ，或者说令牌，也就是provider的名字
  //     useValue: new UseValueService("prefix"), //可以直接提供一个值
  //   },
  //   {
  //     provide: "FactoryToken",
  //     inject: ["prefix1", "SUFFIX"],
  //     useFactory: (prefix1, suffix) => new UseFactory(prefix1, suffix),
  //   },
  // ], // LoggerService 注入到 ProviderController 让ProviderController可以依赖反转控制
  imports: [LoggerModule, DynamicConfigModule.register({ folder: "" })],
})
export class AppModule {}
