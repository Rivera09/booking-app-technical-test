import { GUARDS_NAMES } from '@/core/utils/core.constants';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private name = GUARDS_NAMES.JWT;

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const excludedGuards = this.reflector.get<string[]>(
      'excludedGuards',
      context.getHandler(),
    );
    if (excludedGuards && excludedGuards.includes(this.name)) {
      return true;
    }
    return super.canActivate(context) as Promise<boolean>;
  }
}
