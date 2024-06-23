import "reflect-metadata";

/**
 * @Module是一个装饰器，用于定义模块
 * 模块是组织代码的基本单元，它将相关的组件(控制器、服务器、提供者)组合在一起
 * Nest的模块系统是受Angular启动
 */

interface ModuleMetadata {
  controller?: Function[];
}

// 定义模块的装饰器
export function Module(metadata: ModuleMetadata): ClassDecorator {
  // 类装饰器的target参数是类的构造函数
  return (target) => {
    // 给绑定装饰器的类添加元数据 用来将类和 当前数据关联起来
    Reflect.defineMetadata("controller", metadata.controller, target);
  };
}
