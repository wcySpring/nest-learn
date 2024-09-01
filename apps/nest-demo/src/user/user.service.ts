import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class UserService {
  @Inject("APP_NAME")
  public APP_NAME: string

  public users: { name: string; age: number }[] = []

  getAppName() {
    return this.APP_NAME
  }

  addUser(user) {
    this.users.push(user)
    return this.users
  }

  deleteUserByName(name: string) {
    this.users = this.users.filter((user) => user.name !== name)
    return this.users
  }

  getAllUsers() {
    return this.users
  }

  getUserByName(name: string) {
    return this.users.find((user) => user.name === name)
  }

  updateUser(user: { name: string; age: number }) {
    const index = this.users.findIndex((u) => u.name === user.name)
    this.users[index] = user
    return user
  }
}
