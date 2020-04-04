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
- create new file on auth 'user.repository.ts'

- on 'auth.module.ts' add into "@Module"
```bash
  imports: [
    TypeOrmModule.forFeature([UserRepository])
  ],
```

- on 'auth.module.ts' add into "export class AuthService {"
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
- async signUp Function() on repository, services and controller

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

