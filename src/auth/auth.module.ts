import { UsersModule } from 'src/users/users.module';

import { Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [UsersModule],
})
export class AuthModule {}
