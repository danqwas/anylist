import * as bcrypt from 'bcrypt';
import { SignupInput } from 'src/auth/dto/inputs';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateUserInput } from './dto/inputs/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private logger = new Logger();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAll(validRoles: ValidRoles[]): Promise<User[]> {
    if (validRoles.length === 0) {
      return this.userRepository.find();
    }

    return this.userRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', validRoles)
      .getMany();
  }

  async findOneBbyEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException('Email Not Found');
    }
  }
  async findOneBbyId(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Id Not Found');
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updateBy: User,
  ): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        id,
        ...updateUserInput,
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      user.lastUpdateBy = updateBy;
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.userRepository.findOneBy({
      id,
    });

    if (!userToBlock) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    userToBlock.isActive = false;

    userToBlock.lastUpdateBy = adminUser;

    return await this.userRepository.save(userToBlock);
  }

  private handleErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
