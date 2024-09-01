import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"

@Module({
  // providers: [UserService], // 标准提供器

  //useClass
  providers: [
    {
      provide: UserService,
      useClass: UserService,
    },

    // useValue 1
    {
      provide: "USER_SERVICE",
      useValue: {
        getUser: () => "user",
      },
    },

    // useValue 2
    {
      provide: "APP_NAME",
      useValue: "MyApp",
    },

    // {
    // 	provide: `UserService`,
    // 	useFactory: () => {
    // 		return new UserService();
    // 	},
    // }
  ],
  controllers: [UserController],
})
export class UserModule {}
