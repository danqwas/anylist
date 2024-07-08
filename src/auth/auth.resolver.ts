import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthResponse } from './auth-response.type';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }
  //  @Mutation(/**sdfsadf */  ,{name: 'login'} )
  //  async login(
  //   /* Signin input */
  // ) : Promise</*Signin*/>
  // {
  //     return this.authService.login(/** */)
  // }

  // @Query(/**/, {name: 'revalidate'})
  // async revalidateToken(){

  //   return this.authService.revalidateToken()
  // }
}
