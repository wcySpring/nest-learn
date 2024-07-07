import 'reflect-metadata'

export const createParamDecorator = (key: String) => {
  return function (data?: any) {
    //target控制器原型 propertyKey 方法名handleRequest  parameterIndex 先走1再走0
    return function (target: any, propertyKey: string, parameterIndex: number) {
      // 将被装饰器 收集的参数先 在nest-application init 时候参数映射到实际的 express 对象上
      console.log(parameterIndex);

      // 因为方法的参数会很多，存在一个数组中，先取出来看看是否已经存储过了
      const existingParameters =
        Reflect.getMetadata(`params`, target, propertyKey) || [];

      //  表示哪个位置使用装饰器，存储格式是参数的位置index 和 使用注册的名字
      //  被修饰参数 使用的 express 那个能能力的映射
      existingParameters[parameterIndex] = { key, data };
      // 将这些存入的映射元数据
      Reflect.defineMetadata("params", existingParameters, target, propertyKey);
    };
  };
};

// 导出装饰器
export const Request = createParamDecorator("Request");
export const Req = createParamDecorator("Req");

export const Response = createParamDecorator("Response");
export const Res = createParamDecorator("Res");

// req.query/req.query[key]
export const Query = createParamDecorator("Query");

// req.headers/req.headers[name]
export const Headers = createParamDecorator("Headers");

// req.ip
export const Ip = createParamDecorator("Ip");

// req.session
export const Session = createParamDecorator("Session");

// req.body/req.body[key]
export const Body = createParamDecorator("Body");

// req.params/req.params[key]
export const Param = createParamDecorator("Param");

// next
export const Next = createParamDecorator("Next");
