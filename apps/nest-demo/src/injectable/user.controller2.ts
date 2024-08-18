import { Controller, Get, Inject } from "@nestjs/common";

@Controller("user2")
export class UserController2 {
  // 注入到 User

  @Inject("UserModule2")
  private readonly user;
  // constructor(@Inject("UserModule1") private readonly user) {}

  @Get("/info")
  getInfo() {
    return this.user.info;
  }
}
