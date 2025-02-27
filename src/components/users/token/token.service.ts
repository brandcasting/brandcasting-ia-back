import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async create(createTokenDto: CreateTokenDto) {
    const user = await this.userService.findOne({limit: 1, email: createTokenDto.email})
    if (user) {
      if (user.status == 'locked') {
        throw new UnauthorizedException('Usuario bloqueado.');
      }
      const passwordValidate = await bcrypt.compare(createTokenDto.password, user.password);
      if (passwordValidate) {
        const token = sign(user, process.env.SECRET_KEY, {
          expiresIn: '7d',
        });
        return token;
      }
      throw new UnauthorizedException('Constraseña incorrecta.');
    }
    throw new UnauthorizedException('Usuario no registrado.');
  }

  validate(token: string) {
    return verify(token, process.env.SECRET_KEY);
  }
}
