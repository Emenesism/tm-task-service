import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Amqplibi } from '../services/rmq.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private Amqplibi: Amqplibi) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = request.headers.authorization?.split(' ')[1]; // Extract JWT from the header

    if (!jwt) {
      throw new UnauthorizedException('No JWT provided');
    }
    console.log('request come here in the step 1');
    // Send JWT to User Service for validation
    const isValid = await this.Amqplibi.validateJwtWithUserService(jwt);
    if (!isValid) {
      throw new UnauthorizedException('Invalid JWT');
    }

    return true; // If valid, proceed with the request
  }
}
