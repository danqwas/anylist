import { UsersService } from 'src/users/users.service';

import { Injectable } from '@nestjs/common';

import { AuthResponse } from './auth-response.type';
import { SignupInput } from './dto/inputs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);
    console.log('🚀 ~ AuthService ~ signup ~ signupInput:', signupInput);
    const token = 'ABC123';
    return { token, user };
    /*  return {
      token: 'token',
      user: {
        id: '1',
        email: signupInput.email,
        fullName: signupInput.fullName,
        password: '',
        roles: [],
        isActive: false,
      },
    }; */
    throw new Error('No implemented');
  }
}
