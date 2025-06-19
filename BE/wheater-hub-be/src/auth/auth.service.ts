import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async register(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.users.create({ email, passwordHash });
    await this.users.save(user);
    return this.buildAuthResponse(user);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.users.findOne({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) return user;
    return null;
  }

  buildAuthResponse(user: User) {
    return {
      userId: user.id,
      token: this.jwt.sign({ sub: user.id, email: user.email }),
      expiresIn: process.env.JWT_EXPIRES_IN,
    };
  }
}