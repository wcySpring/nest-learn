// controller 用来处理请求
import { AppController } from './app.controller'

import { Module } from '@nestjs/common'
import { LoggerService } from './inject/LoggerService'
import { ProviderController } from './provide/provider.controller'
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
	controllers: [AppController, ProviderController],
	providers: [LoggerService], // LoggerService 注入到 ProviderController 让ProviderController可以依赖反转控制
})
export class AppModule {}
