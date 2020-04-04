<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
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

## Complexity Password
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

