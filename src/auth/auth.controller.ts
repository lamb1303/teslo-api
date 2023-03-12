import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { LoginUserDto, CreateUserDto } from './dto';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  SetMetadata,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  //@SetMetadata('roles', ['admin', 'super-user'])
  // @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  // @UseGuards(AuthGuard(), UserRoleGuard)
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  createUSer(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
