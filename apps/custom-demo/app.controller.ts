import {
  Controller,
  Get,
  Req,
  Res,
  Query,
  Headers,
  Ip,
  Session,
  Param,
  Body,
  Post,
  Next,
  Redirect,
  HttpCode,
  Header,
} from "@nestjs/common";
import { Request, Response } from "express";
import { User } from "./app.decorator";
// import { SessionData } from "express-session";

// 定义一个控制器类，用于处理请求
/**
 * @Controller也是一个装饰器，用于定义控制器
 * 控制器是处理传入HTTP请求的核心组件，每个控制器负责处理特定的请求路径和对应的HTTP方法
 * 在控制器的内部会使用路由装饰 器如@Get @Post来定义路径和请求处理方法
 *
 * @Get也是一个路由装饰器，用于将控制器的方法(getHello)映射到HTTP的GET请求
 * 当客户端使用GET方法访问 路径/a/b   ['a','b']
 * 通过@Get装饰器，可以指定该方法处理特定路径上的GET请求
 */
@Controller("/a")
export class AppController {
  // get req res 装饰器
  // 在nest 中 当你使用 @Res() 或 @Response() 装饰器时，你需要手动管理响应的发送
  // @Get()
  // getExample() {
  //   // 没有使用 这两个装饰器 NestJS 会自动处理响应并发送给客户端 这是推荐的
  //   return { message: 'Hello, world!' };
  // }
  @Get("/b")
  getHello(@Req() req: Request, name: string, @Res() res: Response) {
    console.log(name);

    // 手动发送
    res.send("22222");
    // return 'Hello World!'
  }

  /**
   *  但是 上面这种做法 就抛离的nestjs 这种分发可以将 passthrough 选项设置为 true
   * 这样即使用了  @Res() 或 @Response() 装饰器时 依旧可以用return nextjs 帮助分发
   * 就能与底层框架原生的响应对象（Response）进行交互（例如，根据特定条件设置 Cookie 或 HTTP 头），
   * 并将剩余的部分留给 Nest 处理。
   * */
  @Get()
  handlerPassthrough(@Res({ passthrough: true }) res: Response) {
    //但是有些我只是想添个响应头，仅此而矣，我不想负责响应体的发送
    res.setHeader("key", "value");
    //response.send('send');
    //response.json({success:true});
    //还是想返回一个值让Nest帮我们进行发送响应体操作 passthrough
    return `response`;
  }

  /**
   * query 链接上的 包含 URL 查询参数的对象。例如，在 URL "/a/query?id=2" 中，
   * 使用的就是express req.query
   * @param query  本质 req.query
   * @param id  本质 req.query.id
   */
  @Get("/query")
  handlerQuery(@Query() query: any, @Query("id") id: string) {
    console.log(query); // { id: '2' }
    console.log(id); // 2
  }

  // 请求头上的参数装饰器，使用的是express  req.headers/req.headers[name]
  /**
   *
   * @param Headers req.headers
   * @param accept req.headers[name]
   */
  @Get("/headers")
  handlerHeaders(@Headers() Headers, @Headers("accept") accept: string) {
    console.log(Headers); // {...header}
    console.log(accept); // text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
  }

  /**
   *
   * @param ip  	req.ip
   */
  @Get("/ip")
  handlerIp(@Ip() ip) {
    console.log(ip); // ::1
  }

  /**
   * /a/param/1
   * @param param  req.params
   * @param id req.params[key]
   */
  @Get("/param/:id")
  handlerParam(@Param() param, @Param("id") id) {
    console.log(param);
    console.log(id);
		return 12;
  }

  // 注册session 中间件 在express 中才能使用 /a/login?userId=1
  /**
   *
   * @param session  req.session 先注册express 中间件
   * @param id req.session.id
   */
  @Get("/login")
  handlerSession(
    @Req() req: Request,
    @Session() session,
    @Session("userId") id: string
  ) {
    // 也可以直接使用 @Query 装饰器
    const { userId } = req.query;
    session.userId = "2";
    // req.session.userId = userId as string;
    if (typeof userId === "string") session.userId = userId;
    console.log(session);
    console.log(id); // 1
  }

  /**
   * 默认响应201
   * 必须要现有中间件 在nest-application初始化的时候创建了
   * @param body  req.body
   * @param userName  req.body[key]
   */
  @Post("/body")
  handlerBody(@Body() body, @Body("userName") userName) {
    console.log(body);
    console.log(userName);
  }

  /**
   * post 默认201 这里设置 响应头 和 返回的code 码
   * @param createUserDto
   * @param username
   * @returns
   */
  @Post("create")
  @HttpCode(200)
  @Header("Cache-Control", "none") //向客户端发送一个响应头
  @Header("key1", "value1")
  @Header("key2", "value2")
  createUser(@Body() createUserDto, @Body("username") username: string) {
    console.log("createUserDto", createUserDto);
    console.log("username", username);
    return `user created`;
  }

  /**
   * 使用 @Next() 装饰器后也不能跳转 页面需要在保持一直响应中的状态
   */
  @Get("next")
  next(@Next() next) {
    console.log("next");
    next();
  }

  /**@Redirect() 装饰器或特定于库的响应对象（并直接调用 res.redirect()）。
   * @Redirect() 装饰器有两个可选参数，url 和 statusCode。
   * 如果省略，则 statusCode 默认为 302。
   */
  @Get("docs")
  @Redirect("https://nest.nodejs.cn", 302)
  getDocs(@Query("version") version) {
    if (version && version === "5") {
      //  返回值将覆盖传递给 @Redirect() 装饰器的任何参数
      return { url: "https://nest.nodejs.cn/v5/", statusCode: 301 };
    }
  }

  /**
   * 自定义装饰器
   * {
   *   aaa:'1'
   * }
   */
  @Get("custom")
  customParamDecorator(@User("aaa") role, @User() user) {
    console.log("user", user); // user { aaa: 111 }
    console.log("role", role); // role 111
    return user;
  }
}
