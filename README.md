# Welcome to NestJS#2 User Authentication Project
<p align="center">
<img src="https://cdn.britannica.com/93/153593-050-15D2B42F/Osama-bin-Laden.jpg" width="320" />
  <h4><a href="https://github.com/smileu2za001/nestjs">PART1 - SQL DB Connecting</a></h4>
  <h4><a href="https://github.com/smileu2za001/nestjs-auth">PART2 - User Authentication</a></h4>
</p>

## Create Serv, Ctrl and Module

- first terminal
```bash
$ nest g module auth
$ nest g controller auth --no-spec
$ nest g service auth --no-spec
```

## Create Entity and Repository
- create new file on auth 'user.entity.ts'
```bash
  @Entity()
  export class User extends BaseEntity{
      @PrimaryGeneratedColumn()
      id : number;

      @Column()
      username: string;

      @Column()
      password: string; 
  }
```

- create new file on auth 'user.repository.ts'
```bash
  @EntityRepository(User)
  export class UserRepository extends Repository<User>{}
```

- on 'auth.module.ts' add into "@Module"
```bash
  imports: [
    TypeOrmModule.forFeature([UserRepository])
  ],
```

- on 'auth.services.ts' add into "export class AuthService {"
```bash
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ){}
```

## Create DataTransferObject(DTO)
- create new folder 'dto' and new file 'auth-credentials.dto.ts'
```bash
export class AuthCredentialsDto {
    username : string;
    password : string;
}
```
## Function SignUp()

- 'auth.controller.ts'
```bash
    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {}
```
- 'auth.service.ts'
```bash
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.singUp(authCredentialsDto);
    }
```
- 'user.repository.ts'
```bash
    async singUp(authCredentialsdto: AuthCredentialsDto): Promise<void> {}
```


## Unique Username
- add into 'user.repositoty.ts
```bash
  try {
      await user.save();
  } catch (error) {
      if(error.code === '23505'){ // dupplicate username
          console.log("Username : "+ USERNAME + " is already signed up");
          throw new ConflictException('Username "'+ USERNAME + '" is already signed up')
      }
      else{
          throw new InternalServerErrorException();
      }
  }
```
-  add into 'user.entity.ts
```bash
  @Unique(['username'])
```

## Complexity Password & Hashing
- Terminal
```bash
  $ npm install bcrypt --save
  $ yarn add bcrypt
``` 
- Add into 'auth.controller.ts
```bash
  @UsePipes(ValidationPipe)
``` 
- Add into 'auth-credentials.dto'
```bash
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
```
- 'user.repository.ts' on Class 'UserRepository
```bash
  private async hashPassword(PASSWORD:string, SALT:string): Promise<string>{
      return bcrypt.hash(PASSWORD,SALT);
  }
```
- 'user.repository.ts' on Function 'signUp()'
```bash
  const user = new User();
  user.username = USERNAME;
  user.salt = await bcrypt.genSalt();
  user.password = await this.hashPassword(PASSWORD,user.salt);
```


## Sign In System
- 'user.entity.ts' on class 'User'
```bash
  async validatePassword(PASSWORD: string): Promise<boolean> {
      const hash = await bcrypt.hash(PASSWORD, this.salt);
      return hash === this.password;
  }
``` 
- 'user.repository.ts' on class 'UserRepository'
```bash
  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const USERNAME = authCredentialsDto.username;
    const PASSWORD = authCredentialsDto.password;
    
    const username = USERNAME;
    const user = await this.findOne({username});
    
    if (user && await user.validatePassword(PASSWORD)) {
        return user.username;
    }
    else {
        return null;
    }
  }
```
- 'auth.service.ts' on class 'AuthService'
```bash
  async signIn(authCredentialsDto: AuthCredentialsDto){
      const username  = await this.userRepository.validateUserPassword(authCredentialsDto);
      if(!username){
          throw new UnauthorizedException('Invalid credentials')
      }
      return username;
  }
```
- 'auth.controller.ts' on class 'AuthController'
```bash
  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto){
      return this.authService.signIn(authCredentialsDto);
  }
```

## JWT Module
- terminal
```bash
  npm add @nestjs/jwt @nestjs/passport passport passport-jwt
``` 
- add into 'auth.module.ts' 
```bash
  import { Module } from '@nestjs/common';
  import { AuthController } from './auth.controller';
  import { AuthService } from './auth.service';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { UserRepository } from './user.repository';
  import { JwtModule } from '@nestjs/jwt'
  import { PassportModule } from '@nestjs/passport'
  import { JwtStrategy } from './jwt.strategy';

  @Module({
    imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
        secret: 'topSecret51',
        signOptions: {
          expiresIn: 3600,
        },
      }),
      TypeOrmModule.forFeature([UserRepository])
    ],
    controllers: [AuthController],
    providers: [
      AuthService,
      JwtStrategy,
    ],
    exports: [
      JwtStrategy,
      PassportModule,
    ]
  })
  export class AuthModule { }
``` 
- 'auth.service.ts' on class 'AuthService'
```bash
  private jwtService: JwtService,
``` 
```bash
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string}>{
      const username = await this.userRepository.validateUserPassword(authCredentialsDto);
      if (!username) {
          throw new UnauthorizedException('Invalid credentials')
      }
      const payload: JwtPayLoad = { username };
      const accessToken = await this.jwtService.sign(payload);

      return {accessToken};
  }
``` 
- 'auth.controller.ts' on class 'AuthController'
```bash
  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string}>{
      return this.authService.signIn(authCredentialsDto);
  }
``` 
- Create New file 'jwt-payload.interface.ts'
```bash
  export interface JwtPayLoad {
      username: string;
  }
``` 
- Create New file 'jwt.strategy.ts'
```bash
  import { PassportStrategy } from '@nestjs/passport'
  import { JwtPayLoad } from './jwt-payload.interface'
  import { Strategy, ExtractJwt } from 'passport-jwt'
  import { Injectable, UnauthorizedException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { UserRepository } from './user.repository';
  import { User } from './user.entity';

  @Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy) {
      constructor(
          @InjectRepository(UserRepository)
          private userRepository: UserRepository,
      ) {  
          super({
              jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
              secretOrKey: 'topSecret51',
          });
      }

      async validate(payload: JwtPayLoad): Promise<User> {
          const { username } = payload;
          const user = await this.userRepository.findOne({ username });

          if (!user) {
              throw new UnauthorizedException();
          }
          return user;
      }
  }
```

## JWT Result Encoder
<p align="center">
<img src="https://s3-ap-southeast-1.amazonaws.com/img-in-th/19d435be1198d552d1c9955d1992e371.png" alt="19d435be1198d552d1c9955d1992e371.png" width="640" />
</p>


## Route Task Path
- Import 'AuthModule' into 'Tasks.module.ts'
```bash
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    AuthModule,
  ],
```
- add @UserGauard into 'tasks.controller.ts'
```bash
  @Controller('tasks')
  @UseGuards(AuthGuard())
```

## GET ALL TASK in POSTMAN
- If get all tasks without Authorize
```bash
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
```
- If get all tasks With Authorize
```bash
    {
      "id": 6,
      "title": "Test",
      "description": "Test Language",
      "status": "OPEN"
    },
```
