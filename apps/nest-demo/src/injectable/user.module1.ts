import { Injectable } from "@nestjs/common";

@Injectable()
export class UserModule1 {
  constructor(public name: string, public age: number) {
    this.name = "w";
    this.age = 12;
  }

  get info() {
    return `${this.name}_${this.age}`;
  }
}
