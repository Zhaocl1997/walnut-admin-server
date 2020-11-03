import { Injectable } from '@nestjs/common';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class AppService {
  private readonly users: UserInterface[] = [];

  create(user: UserInterface) {    
    this.users.push(user);
  }

  findAll(): UserInterface[] {
    return this.users;
  }
}
