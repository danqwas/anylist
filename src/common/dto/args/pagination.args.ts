import { IsOptional, Min } from 'class-validator';

import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  offset: number = 0;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  limit: number = 10;
}
