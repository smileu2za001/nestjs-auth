## Welcome to NestJS Authentication Project
<p align="center">
<img src="https://cdn.britannica.com/93/153593-050-15D2B42F/Osama-bin-Laden.jpg" width="320" />
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