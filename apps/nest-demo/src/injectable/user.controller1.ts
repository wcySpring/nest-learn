import { Controller, Get, Inject } from "@nestjs/common";

@Controller("user1")
export class UserController1 {
  // 注入到 User

  @Inject("UserModule1")
  private readonly user;
  // constructor(@Inject("UserModule1") private readonly user) {}

  @Get("/info")
  getInfo() {
    return this.user.info;
  }
}
