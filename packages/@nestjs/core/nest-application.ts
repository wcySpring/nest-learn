import express, {
	Express,
	Request as ExpressRequest,
	Response as ExpressResponse,
	NextFunction,
} from 'express'
import path from 'path'

import 'reflect-metadata'
import { Logger } from './logger'
import { defineModule, DESIGN_PARAMTYPES, INJECTED_TOKENS } from "../common"

//    const app = new NestApplication(module);
export class NestApplication {
  // 实例化一个express
  private readonly app: Express = express()

  protected readonly module
  // 注册 module
  // constructor(protected readonly module) {}

  //在此处保存全部的providers
  // private readonly providers = new Map()

  // 所有providers 的实例
  private readonly providerInstances = new Map()
  //此入存放着全局可用的提供者和token
  private readonly globalProviders = new Set()
  // modules 中可以使用providers
  private readonly moduleProviders = new Map()
  constructor(module: any) {
    // body 必须使用 中间件才能使用 因此 在初始化时候就提前注册了比较常用
    // 用来把 JSON 格式的请求体对象放在 req.body 上
    this.app.use(express.json())

    // 把 form 表单格式的请求体对象放在 req.body
    this.app.use(express.urlencoded({ extended: true }))
    this.module = module

    // 注入 providers
    // this.initProviders()
  }

  // 注册中间件
  use(middleware) {
    this.app.use(middleware)
  }

  // 根据key 获取注入对象
  private getProviderByToken = (injectedToken, module) => {
    //如何通过token在特定模块下找对应的provider
    //先找到此模块对应的token set,再判断此injectedToken在不在此set中,如果存在， 是可能返回对应的provider实例
    if (
      this.moduleProviders.get(module)?.has(injectedToken) ||
      this.globalProviders.has(injectedToken)
    ) {
      return this.providerInstances.get(injectedToken)
    } else {
      return null
    }
  }
  //解析出控制器的依赖，将被依赖注入的class 的构造函数中的参数找到他们要依赖注入的对象
  private resolveDependencies(Cls: Function) {
    // 先获取绑定key 的注入
    const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, Cls) ?? []
    // 获取构造函数中所有的 参数类型
    const constructorParams = Reflect.getMetadata(DESIGN_PARAMTYPES, Cls) ?? []

    // 获取 构成函数 部分需要注入的参数实例化
    /**
     * resolveDependencies 方法通过遍历构造函数的参数类型，并将每一个参数与提供的 injectedTokens（如果存在）进行匹配。然后，
     * 它调用 getProviderByToken 方法，从已经注册的 providers 中获取实际的例或值。
     * injectedTokens[index] ?? param: 如果在 injectedTokens 中存在与参数索引对应的值，则优先使用该值，否则使用参数本身的类型。
     * getProviderByToken: 这个方法根据传入的 token 从 providers 中获取实际的实例或值。
     */
    // return constructorParams.map((param, index) => {
    //   //把每个param中的token默认换成对应的provider值
    //   return this.getProviderByToken(injectedTokens[index] ?? param, module)
    // })
    return constructorParams.map((param, index) => {
      const module = Reflect.getMetadata("module", Cls)
      const injectedToken = injectedTokens[index] ?? param
      return this.getProviderByToken(injectedToken, module)
    })
  }

  // 匹配导出的exports 才能作为provides 提供
  private registerProvidersFromModule(module, ...parentModules) {
    // 获取当前模块的所有provides 注入
    const providers = Reflect.getMetadata("providers", module) || []
    // 获取当前模块的所有 exports注入s
    const exports = Reflect.getMetadata("exports", module) || []
    const global = Reflect.getMetadata("global", module) || []
    // 循环所有的exports 看是否在imports 在的话就是可以导出使用
    for (const exportToken of exports) {
      // 因为exports 有可能导出的是模块 因此判断是否是模块
      if (this.isModule(exportToken)) {
        //要执行递归操作
        this.registerProvidersFromModule(exportToken, module, ...parentModules)
      } else {
        // 找到 exports 导出和 imports 匹配的
        const provider = providers.find(
          (provider) =>
            provider === exportToken || provider.provide === exportToken
        )
        if (provider) {
          ;[module, ...parentModules].forEach((module) => {
            this.addProvider(provider, module, global)
          })
        }
      }
    }
  }

  isModule(injectToken) {
    return (
      injectToken &&
      injectToken instanceof Function &&
      Reflect.getMetadata("isModule", injectToken)
    )
  }

  // 通过imports 去收集所有的 providers
  //初始化提供化
  async initProviders() {
    //重写注册provider的流程
    //获取模块导入的元数据
    const imports = Reflect.getMetadata("imports", this.module) ?? []
    //遍历所有的导入的模块

    for (const importModule of imports) {
      let importedModule = importModule
      //如果导入的是一个Promise，说是它是异步的动态模块
      if (importModule instanceof Promise) {
        importedModule = await importedModule
      }
      // 动态模块会有一个module 属性因此根module 来判断是否是动态模块
      if ("module" in importedModule) {
        //获取动态模块返回的老的模块定义，新的providers数组，新的导出的token数组
        const { module, providers, controllers, exports } = importedModule
        //把老的和新的providers和exports进行合并
        // 这里的老的就是 静态修饰动态，我们需要获取原来的静态把现在的动态注入回去
        const oldControllers = Reflect.getMetadata("controllers", module)
        const newControllers = [
          ...(oldControllers ?? []),
          ...(controllers ?? []),
        ]
        defineModule(module, newControllers)
        const oldProviders = Reflect.getMetadata("providers", module)
        const newProviders = [...(oldProviders ?? []), ...(providers ?? [])]
        defineModule(module, newProviders)
        const oldExports = Reflect.getMetadata("exports", module)
        const newExports = [...(oldExports ?? []), ...(exports ?? [])]
        Reflect.defineMetadata("controllers", newControllers, module)
        Reflect.defineMetadata("providers", newProviders, module)
        Reflect.defineMetadata("exports", newExports, module)
        this.registerProvidersFromModule(module, this.module)
      } else {
        //LoggerModule
        this.registerProvidersFromModule(importModule, this.module)
      }
    }
    //获取当前模块提供者的元数据
    const providers = Reflect.getMetadata("providers", this.module) ?? []
    //遍历并添加每个提供者
    for (const provider of providers) {
      this.addProvider(provider, this.module)
    }
  }

  // 通过 addProvider 进行收集到Map 里面
  private addProvider(provider, module, global = false) {
    //此providers代表module这个模块对应的provider的token
    const providers = global
      ? this.globalProviders
      : this.moduleProviders.get(module) || new Set()
    if (!this.moduleProviders.has(module)) {
      this.moduleProviders.set(module, providers)
    }
    //获取要注册的provider的token
    const injectToken = provider.provide ?? provider
    //如果实例池里已经有此token对应的实例了
    if (this.providerInstances.has(injectToken)) {
      //则直接把此token放入到providers这个集合直接返回
      if (!providers.has(injectToken)) {
        providers.add(injectToken)
      }
      return
    }
    //如果有provider的token,并且有useClass属性，说明提供的是一个类，需要实例化
    if (provider.provide && provider.useClass) {
      //获取这个类的定义LoggerService
      const Clazz = provider.useClass
      //获取此类的参数['suffix'] 找到 provides 的构造函数中的参数找到他们要依赖注入的对象
      const dependencies = this.resolveDependencies(Clazz)
      //创建提供者类的实例
      const value = new Clazz(...dependencies)
      //把提供者的token和实例保存到Map中
      this.providerInstances.set(provider.provide, value)
      providers.add(provider.provide)
      //如果提供的是一个值，则直接放到Map中
    } else if (provider.provide && provider.useValue) {
      this.providerInstances.set(provider.provide, provider.useValue)
      providers.add(provider.provide)
    } else if (provider.provide && provider.useFactory) {
      const inject = provider.inject ?? [] //获取要注入工厂函数的参数
      //解析出参数的值
      const injectedValues = inject.map((injectToken) =>
        this.getProviderByToken(injectToken, module)
      )
      //执行工厂方法，获取返回的值
      const value = provider.useFactory(...injectedValues)
      //把token和值注册到Map中
      this.providerInstances.set(provider.provide, value)
      providers.add(provider.provide)
    } else {
      //获取此类的参数['suffix']
      const dependencies = this.resolveDependencies(provider)
      //创建提供者类的实例
      const value = new provider(...dependencies)
      //把提供者的token和实例保存到Map中
      this.providerInstances.set(provider, value)
      providers.add(provider)
    }
  }

  // 初始化provides 部分

  // initProviders() {
  //   // 获取 从 modules 装饰器收集的 providers
  //   const providers = Reflect.getMetadata("providers", this.module) ?? []
  //   // 循环遍历 providers 注册到 providers 中
  //   for (let provider of providers) {
  //     // 这里收集时候就要考虑 provides 几种使用情况不同 收集需要进行不同的判断
  //     if (provider.provide && provider.useClass) {
  //       // 注册到 providers 中
  //       const dependencies = this.resolveDependencies(provider.useClass)
  //       //创建类的实例
  //       const classInstance = new provider.useClass(...dependencies)
  //       //把provider的token和类的实例保存到this.providers里
  //       this.providers.set(provider.provide, classInstance)
  //     } else if (provider.provide && provider.useValue) {
  //       // 普通值 就是直接存储到时候映射即可
  //       this.providers.set(provider.provide, provider.useValue)
  //     } else if (provider.provide && provider.useFactory) {
  //       // 从inject 中获取 工厂需要的参数
  //       // 先查看 inject 中是否有提供的变量
  //       const inject = provider.inject ?? []
  //       //const injectedValues = inject.map((injectedToken)=>this.getProviderByToken(injectedToken));
  //       //const injectedValues = inject.map(this.getProviderByToken.bind(this));
  //       // 看对应的映射获取
  //       const injectedValues = inject.map(this.getProviderByToken)
  //       const value = provider.useFactory(...injectedValues)
  //       //提供的是一个值，则不需要容器帮助实例化，直接使用此值注册就可以了
  //       this.providers.set(provider.provide, value)
  //     } else {
  //       //表示只提供了一个类,token是这个类，值是这个类的实例
  //       const dependencies = this.resolveDependencies(provider)
  //       this.providers.set(provider, new provider(...dependencies))
  //     }
  //   }
  // }

  /**
   * 根据 reflect-metadata 元数据 收集相应依赖重新
   * 拼装成express 展示格式
   * 初始化配置
   * */
  init() {
    // 获取收集所有的 controllers 这里使用 reflect 获取收集的 class 实体
    const controllers = Reflect.getMetadata("controllers", this.module) || []
    // controllers 层收集
    Logger.log(`AppModule dependencies initialized`, "InstanceLoader")
    // 循环收集 Module 中的 controllers 层 进行express 拼装
    for (const Controller of controllers) {
      // 获取需要被注入的实例化参数 解析出控制器的依赖
      const dependencies = this.resolveDependencies(Controller)
      //创建每个控制器的实例
      const controller = new Controller(...dependencies)
      // 在从每个控制器上获取绑定的 路径前缀 获取控制器的路径前缀
      const prefix = Reflect.getMetadata("prefix", Controller) || "/"
      //开始解析路由
      Logger.log(`${Controller.name} {${prefix}}`, "RoutesResolver")
      // 在从每一个 控制器上 原形链获取 请求方法

      for (const methodName of Object.getOwnPropertyNames(
        Controller.prototype
      )) {
        // 获取 class 上的method 方法
        const method = controller[methodName]
        // 根据 method 去映射请求是方式 和 路径
        const httpMethod: string = Reflect.getMetadata("method", method)
        const pathMetadata = Reflect.getMetadata("path", method)

        // 处理重定向的地址
        const redirectUrl = Reflect.getMetadata("redirectUrl", method)

        // 处理重定向的code
        const redirectStatusCode = Reflect.getMetadata(
          "redirectStatusCode",
          method
        )

        // 响应状态码装饰器
        const statusCode = Reflect.getMetadata("statusCode", method)
        // 响应头装饰器
        const headers = Reflect.getMetadata("headers", method) ?? []

        // 如果方法不存在 就跳过下面的处理
        if (!httpMethod) continue

        //TODO:磨平多个地址 / path = 控制器前缀 + 方法装饰器上的
        const routePath = path.posix.join(prefix, pathMetadata)

        // 根据现在已有的信息拼接成express 的请求格式
        // this.app.get('/',function(req,res){})
        this.app[httpMethod.toLowerCase()](
          routePath,
          (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            // 将express 上参数 和 装饰器收集的进行匹配分发
            const args = this.resolveParams(
              controller,
              methodName,
              req,
              res,
              next
            )

            const result = method.call(controller, ...args)

            // 返回值将覆盖传递给 @Redirect() 装饰器的任何参数
            if (result?.url) {
              return res.redirect(result.statusCode || 302, result.url)
            }

            //判断如果需要重定向，则直接重定向到指定的redirectUrl
            if (redirectUrl) {
              return res.redirect(redirectStatusCode || 302, redirectUrl)
            }

            // 如果有设置响应code
            if (statusCode) {
              res.statusCode = statusCode
            } else if (httpMethod === "POST") {
              // 如果是post 请求 默认201
              res.statusCode = 201
            }
            /**
             * 这么传参就需要 指定参数位置才能利用call 传入
             *  method.call(controller, req, res, next)
             *  用装饰器 自动匹配 多种可能的参数比上面的灵活了
             *  在nest 中 当你使用 @Res() 或 @Response() 装饰器时，你需要手动管理响应的发送
             *  但是 上面这种做法 就抛离的nestjs 这种分发可以将 passthrough 选项设置为 true
             *  这样即使用了  @Res() 或 @Response() @Next()装饰器时 依旧可以用return nextjs 帮助分发
             */
            const responseMetadata = this.getResponseMetadata(
              controller,
              methodName
            )
            console.log(
              !responseMetadata || responseMetadata?.data?.passthrough
            )

            //判断controller的methodName方法里有没有使用Response或Res参数装饰器，如果用了任何一个则不发响应
            //或者没有注入Response参数装饰器，或者注入了但是传递了passthrough参数，都会由Nest.js来返回响应
            if (!responseMetadata || responseMetadata?.data?.passthrough) {
              headers.forEach(({ name, value }) => {
                res.setHeader(name, value)
              })
              // 不是就不处理 只能 你在collection 层去调用send
              //把返回值序列化发回给客户端

              res.send(result)
            }
          }
        )
      }
    }
    Logger.log(`Nest application successfully started`, "NestApplication")
  }

  /**
   * 在nest 中 当你使用 @Res() 或 @Response() @Next()装饰器时，你需要手动管理响应的发送
   */
  private getResponseMetadata(controller, methodName) {
    const paramsMetaData =
      Reflect.getMetadata(`params`, controller, methodName) ?? []
    return paramsMetaData.filter(Boolean).find((param) => {
      return (
        param.key === "Response" || param.key === "Res" || param.key === "Next"
      )
    })
  }

  // 装饰器参数匹配的分发
  private resolveParams(
    instance: any,
    methodName: string,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    const ctx = {
      //因为Nest不但支持http,还支持graphql 微服务 websocket
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => req,
      }),
      getNext: () => next,
    }
    // 获取这个方法的被装饰器修饰的参数 获取参数的元数据
    const paramsMetaData =
      Reflect.getMetadata(`params`, instance, methodName) ?? []
    //[{ parameterIndex: 0, key: 'Req' },{ parameterIndex: 1, key: 'Request' }]
    //此处就是把元数据变成实际的参数
    return paramsMetaData.map((paramMetaData) => {
      const { key, data, factory } = paramMetaData
      switch (key) {
        // 把元数据标记的那个参数 反射到实际express 的参数对象
        case "Request":
        case "Req":
          return req
        case "Response":
        case "Res":
          return res
        case "Query":
          return data ? req.query[data] : req.query
        case "Headers":
          return data ? req.headers[data] : req.headers
        case "Ip":
          return req.ip
        case "Body":
          return data ? req.body?.[data] : req.body
        case "Session":
          return data ? req.session?.[data] : req.session
        case "Param":
          return data ? req.params[data] : req.params
        case "Next":
          return next
        case "DecoratorFactory":
          return factory(data, ctx)

        default:
          return null
      }
    })
  }

  // 启动Http 服务
  async listen(port: Number) {
    await this.initProviders() //注入providers

    await this.init()

    this.app.listen(port, () => {
      // 启动服务
      console.log(`Application is running on http://localhost:${port}`)
    })
  }
}
