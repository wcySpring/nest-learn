import 'reflect-metadata'

/**
 * @Module是一个装饰器，用于定义模块
 * 模块是组织代码的基本单元，它将相关的组件(控制器、服务器、提供者)组合在一起
 * Nest的模块系统是受Angular启动
 */

interface ModuleMetadata {
  controllers?: Function[]
  providers?: any[]
  imports?: any[]
  exports?: any[]
}

// 定义模块的装饰器
export function Module(metadata: ModuleMetadata): ClassDecorator {
  // 类装饰器的target参数是类的构造函数
  return (target) => {
    // 用来标识 那些是模块
    Reflect.defineMetadata("isModule", true, target)

    //我得知道此控制器属于哪个模块
    defineModule(target, metadata.controllers)
    // 给绑定装饰器的类添加元数据 用来将类和 当前数据关联起来
    Reflect.defineMetadata("controllers", metadata.controllers, target)
    //我得知道此providers属于哪个模块 其实这行代码我们尚未使用 target就是module
    defineProvidersModule(target, metadata.providers)

    // 收集需要绑定的依赖,先收集 providers 提供的值
    Reflect.defineMetadata("providers", metadata.providers, target)

    // 收集导入的模块
    Reflect.defineMetadata("imports", metadata.imports, target)

    // 收集导出的模块
    Reflect.defineMetadata("exports", metadata.exports, target)
  }
}

export function defineProvidersModule(nestModule, providers = []) {
  defineModule(
    nestModule,
    (providers ?? [])
      .map((provider) =>
        provider instanceof Function ? provider : provider.useClass
      )
      .filter(Boolean)
  )
}
export function defineModule(nestModule, targets = []) {
  //遍历targets数组，为每个元素添加元数据，key是nestModule,值是对应的模块
  targets.forEach((target) => {
    Reflect.defineMetadata("module", nestModule, target)
  })
}

// 全局导出的收集
export function Global(): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata("global", true, target)
  }
}

// 动态模块的类型约束导出
export interface DynamicModule extends ModuleMetadata {
	  module: Function;
}