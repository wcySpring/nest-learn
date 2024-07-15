/**
 * express中的next是一个用于中间件链处理的函数
 * 每个中间件接收三个参数 req,res,next
 * 中间件函数通过调用next可以将控制权传递给下一个中间件函数，如果中间没有调用next，请求请会挂起
 *
 * 首先中间件调用函数要能使用 request 和 Response 这两种模式，因此要在中间件时候注入这两个对象
 * 其次 要能具备收集中间件的能力
 */

/**
 * 请求对象
 */
class Request1 {
  constructor(public url: string) {
    this.url = url;
  }

  get query() {
    const cs = new URL(this.url).searchParams;
    const paramsObject = {};
    cs.forEach((value, key) => {
      paramsObject[key] = value;
    });
    return paramsObject;
  }
}

/**
 * 响应对象
 */
class Response1 {
  send(message: string) {
    console.log(message);
  }
}

class Express {
  middlewares: Array<
    (res: Request1, req: Response1, next: () => void) => void
  > = [];

  /**
   * 注册中间件
   */
  use(middleware) {
    this.middlewares.push(middleware);
  }

  /**
   * 接受传入装饰器的 req 和res
   */
  handleRequest(request: Request1, response: Response1) {
    const { middlewares } = this;
    let index = 0;

    function next() {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        // 传入next 让产生自调用
        middleware(request, response, next);
      }
    }
    next();
  }
}

const app = new Express();
app.use((req, res, next) => {
  console.log(req.query.id);

  console.log("middleware1");

  // 调用后触发下一个中间件
  next();
});
app.use((req, res, next) => {
  console.log("middleware2");
  next();
});
app.use((req, res, next) => {
  console.log("middleware3");
  res.send("hello");
});
const req = new Request1("http://example.com/?id=1");
const res = new Response1();
app.handleRequest(req, res);

// 打印
// 1
// middleware1
// middleware2
// middleware3
// hello
