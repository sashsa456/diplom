import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.emailIsTaken(createUserDto.email);

    const hash = await this.hashPassword(createUserDto.password);

    const shouldBeAdmin = await this.checkIsFirstUser();
    const user = this.repo.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hash,
      isAdmin: shouldBeAdmin
    });

    return this.repo.save(user);
  }

  findAll(options: FindManyOptions<UserEntity> = {}) {
    return this.repo.find(options);
  }

  async findOne(options: FindOneOptions<UserEntity> = {}) {
    const user = await this.repo.findOne(options);

    if (!user) {
      throw new BadRequestException("Пользователь не найден");
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne({ where: { id } });

    if (updateUserDto.email) {
      await this.emailIsTaken(updateUserDto.username);
    }

    if (updateUserDto.password) {
      const hash = await this.hashPassword(updateUserDto.password);
      updateUserDto.password = hash;
    }

    return this.repo.update(user.id, updateUserDto);
  }

  async emailIsTaken(email: string) {
    const isTaken = await this.repo.findOneBy({
      email
    });

    if (isTaken) {
      throw new BadRequestException("Почта уже занята");
    }

    return false;
  }

  async remove(id: number) {
    await this.findOne({ where: { id } });

    return this.repo.delete(id);
  }

  async checkIsFirstUser() {
    return (await this.repo.count()) === 0;
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
