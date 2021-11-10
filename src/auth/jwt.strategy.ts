import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import plugins from 'src/schemas/mongose-plugins';
import { TUserDocument, User } from '../schemas/user.model';
import { Model } from 'mongoose';

const permissionOptions = {
  user: plugins.prefixes.user,
};

export interface JWTPayload {
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<TUserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JWTPayload): Promise<TUserDocument> {
    let user = null;

    if (payload.id.includes(permissionOptions.user)) {
      user = await this.userModel.findById(payload.id);
    }

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
