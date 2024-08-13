import { Injectable } from "@nestjs/common";

@Injectable()
export class UserModule {
  name: string = "w";
  age: number = 12;

  get info() {
    return `${this.name}_${this.age}`;
  }
}
