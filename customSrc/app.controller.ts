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
} from "@nestjs/common";
import { Request, Response } from "express";
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
  @Get("/b")
  getHello(@Req() req: Request, name: string, @Res() res: Response) {
    console.log(name);

    res.send("22222");
    // return 'Hello World!'
  }

  // query 链接上的 包含 URL 查询参数的对象。例如，在 URL "/a/query?id=2" 中，
  // 使用的就是express req.query
  /**
   *
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
   * 必须要现有中间件 在nest-application初始化的时候创建了
   * @param body  req.body
   * @param userName  req.body[key]
   */
  @Post("/body")
  handlerBody(@Body() body, @Body("userName") userName) {
    console.log(body);
    console.log(userName);
  }
}
