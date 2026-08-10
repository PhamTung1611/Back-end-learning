import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../../../databases/schemas/user.schema';

import { Role, RoleDocument } from '../../../databases/schemas/role.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub).lean();

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    const role = await this.roleModel
      .findById(user.roleId)
      .populate('permissions')
      .lean();

    if (!role) {
      throw new UnauthorizedException('Role không tồn tại');
    }

    const permissions = (role.permissions || []).map(
      (permission: any) => permission.name,
    );

    const result = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: role.name,
      permissions,
    };

    console.log('JWT USER:', result);

    return result;
  }
}
