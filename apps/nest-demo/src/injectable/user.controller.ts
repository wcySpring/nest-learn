import { Controller, Get, Inject } from "@nestjs/common";
import { UserModule } from "./user.module";

@Controller("user")
export class UserController {
  // 注入到 User
  // @Inject(UserModule)
  // private readonly user;
  constructor(private readonly user: UserModule) {}

  @Get("/info")
  getInfo() {
    return this.user.info;
  }
}
