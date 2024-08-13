import { Controller, Get } from "@nestjs/common";
import { UserModule } from "./user.module";

@Controller("user")
export class UserController {
  // 注入到 User
  constructor(private readonly user: UserModule) {}

  @Get("/info")
  getInfo() {
    return this.user.info;
  }
}
