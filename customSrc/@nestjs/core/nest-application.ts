import express, {
	Express,
	Request as ExpressRequest,
	Response as ExpressResponse,
	NextFunction,
} from 'express'
import path from 'path'

import 'reflect-metadata'
import { Logger } from './logger'

//    const app = new NestApplication(module);
export class NestApplication {
  // 实例化一个express
  private readonly app: Express = express();

  protected readonly module;
  // 注册 module
  // constructor(protected readonly module) {}
  constructor(module) {

		// body 必须使用 中间件才能使用 因此 在初始化时候就提前注册了比较常用
    this.app.use(express.json()); //用来把JSON格式的请求体对象放在req.body上
    this.app.use(express.urlencoded({ extended: true })); //把form表单格式的请求体对象放在req.body

    this.module = module;
  }

  // 注册中间件
  use(middleware) {
    this.app.use(middleware);
  }
  /**
   * 根据 reflect-metadata 元数据 收集相应依赖重新
   * 拼装成express 展示格式
   * 初始化配置
   * */
  init() {
    // 获取收集所有的 controllers 这里使用 reflect 获取收集的 class 实体
    const controllers = Reflect.getMetadata("controllers", this.module) || [];
    // controllers 层收集
    Logger.log(`AppModule dependencies initialized`, "InstanceLoader");
    // 循环收集 Module 中的 controllers 层 进行express 拼装
    for (const Controller of controllers) {
      //创建每个控制器的实例
      const controller = new Controller();
      // 在从每个控制器上获取绑定的 路径前缀 获取控制器的路径前缀
      const prefix = Reflect.getMetadata("prefix", Controller) || "/";
      //开始解析路由
      Logger.log(`${Controller.name} {${prefix}}`, "RoutesResolver");
      // 在从每一个 控制器上 原形链获取 请求方法

      for (const methodName of Object.getOwnPropertyNames(
        Controller.prototype
      )) {
        // 获取 class 上的method 方法
        const method = controller[methodName];
        // 根据 method 去映射请求是方式 和 路径
        const httpMethod: string = Reflect.getMetadata("method", method);
        const pathMetadata = Reflect.getMetadata("path", method);

        // 如果方法不存在 就跳过下面的处理
        if (!httpMethod) continue;

        //TODO:磨平多个地址 / path = 控制器前缀 + 方法装饰器上的
        const routePath = path.posix.join(prefix, pathMetadata);

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
            );
            // 这么传参就需要 指定参数位置才能利用call 传入
            // method.call(controller, req, res, next)
            // 用装饰器 自动匹配 多种可能的参数比上面的灵活了
            const result = method.call(controller, ...args);
            if (!result) res.send();
          }
        );
      }
    }
    Logger.log(`Nest application successfully started`, "NestApplication");
  }

  // 装饰器参数匹配的分发
  private resolveParams(
    instance: any,
    methodName: string,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    // 获取这个方法的被装饰器修饰的参数 获取参数的元数据
    const paramsMetaData = Reflect.getMetadata(`params`, instance, methodName);
    //[{ parameterIndex: 0, key: 'Req' },{ parameterIndex: 1, key: 'Request' }]
    //此处就是把元数据变成实际的参数
    return paramsMetaData.map((paramMetaData) => {
      const { key, data } = paramMetaData;
      switch (key) {
        // 把元数据标记的那个参数 反射到实际express 的参数对象
        case "Request":
        case "Req":
          return req;
        case "Response":
        case "Res":
          return res;
        case "Query":
          return data ? req.query[data] : req.query;
        case "Headers":
          return data ? req.headers[data] : req.headers;
        case "Ip":
          return req.ip;
        case "Body":
          return data ? req.body?.[data] : req.body;
        case "Session":
          return data ? req.session?.[data] : req.session;
        case "Param":
          return data ? req.params[data] : req.params;
        default:
          return null;
      }
    });
  }

  // 启动Http 服务
  async listen(port: Number) {
    await this.init();

    this.app.listen(port, () => {
      // 启动服务
      console.log(`Application is running on http://localhost:${port}`);
    });
  }
}
