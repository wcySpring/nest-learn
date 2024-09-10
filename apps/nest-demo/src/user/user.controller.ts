import {
  Controller,
  Get,
  Query,
  Req,
  Headers,
  Post,
  Param,
  HttpCode,
  Body,
  Header,
  Res,
  Next,
  Redirect,
  Inject,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { Request, Response } from "express" // 导入 Express 的 Request 类型

@Controller("user")
export class UserController {
  // 通过provides 依赖注入 UserService 类

  // useClass 形式
  // @Inject(UserService)
  // public userService: UserService

  // useValue

  @Inject("USER_SERVICE")
  public USER_SERVICE: { getUser: () => string }

  constructor(public userService: UserService) {}

  @Get("appName")
  appName() {
    return this.userService.getAppName()
  }

  /**
   * 在nest 中 当你使用 @Res() 或 @Response() 装饰器时，你需要手动管理响应的发送
   *没有使用 这两个装饰器 NestJS 会自动处理 return 返回值作为 响应并发送给客户端 这是推荐的
   *
   **/
  @Get("hello")
  //可以将 passthrough 选项设置为 true
  // 这样即使用了  @Res() 或 @Response() 装饰器时 依旧可以用return nextjs 帮助分发
  // 就能与底层框架原生的响应对象（Response）进行交互（例如，根据特定条件设置 Cookie 或 HTTP 头）
  // 并将剩余的部分留给 Nest 处理。
  // hello(@Res({ passthrough: true }) res: Response) {
  hello(@Res() res: Response) {
    //但是有些我只是想添个响应头，仅此而矣
    res.setHeader("key", "value")
    // 我不想负责响应体的来自己触发 手动发送
    res.send(this.USER_SERVICE.getUser())
  }

  /**
   * 使用 @Next() 装饰器后也不能跳转 页面需要在保持一直响应中的状态
   */
  @Get("next")
  next(@Next() next) {
    console.log("next")
    next()
  }

  // 获取用户列表
  @Get("list")
  getUserList() {
    return this.userService.getAllUsers()
  }

  // 获取用户详情
  @Get("detail")
  /**
   * 	获取请求对象列如 请求头 请求体 请求方法等
   * 	req.query === @Query()
   *  req.query.id === @Query('id')
   *  req.headers === @Headers()
   *  req.headers.accept === @Headers('accept')
   * */
  // getUserDetail(@Req() req: Request) {
  //   console.log(req)
  //   return { age: 18 }
  // }

  // 获取get 请求参数 detail?id=1
  getUserDetail(@Query() query: { name: string }, @Query("name") name: string) {
    console.log(query, name) // { id: '1' } 1
    return this.userService.getUserByName(name)
  }

  /**
   * 获取请求头数据
   *
   */
  @Get("header")
  getHeader(@Headers() headers: Headers, @Headers("accept") accept: string) {
    console.log(headers, accept)
    return accept
  }

  /**
   * 删除用户 post 默认响应201
   * 通过  HttpCode 设置响应状态码
   */

  @HttpCode(200)
  @Post("delete/:name")
  deleteUser(@Param() params: { name: string }, @Param("name") name: string) {
    // delete/1
    // console.log(params, id) // { id: '1' } 1
    return this.userService.deleteUserByName(name)
  }

  /**
   * 删除用户 post 默认响应201
   */
  @Post("update")
  updateUser(
    @Body() body: { name: string; age: number },
    @Body("name") name: string
  ) {
    // console.log(body, name) // { name: '张三', age: 18 } 张三
    // return body
    return this.userService.updateUser({ name, age: body.age })
  }

  // 新增用户
  @Post("add")
  @Header("Cache-Control", "none") //向客户端发送一个响应头
  addUser(
    @Body() body: { name: string; age: number },
    @Body("name") name: string
  ) {
    console.log(body, name) // { name: '张三', age: 18 } 张三
    return this.userService.addUser({ name, age: body.age })
  }

  @Get("docs")
  @Redirect("https://nest.nodejs.cn", 302)
  getDocs(@Query("version") version) {
    if (version && version === "5") {
      //  返回值将覆盖传递给 @Redirect() 装饰器的任何参数
      return { url: "https://nest.nodejs.cn/v5/", statusCode: 301 }
    }
  }
}
