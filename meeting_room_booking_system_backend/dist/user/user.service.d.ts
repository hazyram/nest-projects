import { RegisterUserDto } from './dto/register-user.dto';
import { Permission } from './entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListVo } from './vo/user-list.vo';
export declare class UserService {
    private logger;
    private userRepository;
    private roleRepository;
    private permissionRepository;
    private redisService;
    register(user: RegisterUserDto): Promise<"注册成功" | "注册失败">;
    login(loginUserDto: LoginUserDto, isAdmin: boolean): Promise<LoginUserVo>;
    initData(): Promise<void>;
    findUserById(userId: number, isAdmin: boolean): Promise<{
        id: number;
        username: string;
        isAdmin: boolean;
        email: string;
        roles: string[];
        permissions: Permission[];
    }>;
    findUserDetailById(userId: number): Promise<UserDetailVo>;
    updatePassword(passwordDto: UpdateUserPasswordDto): Promise<"密码修改成功" | "密码修改失败">;
    update(userId: number, updateUserDto: UpdateUserDto): Promise<string>;
    freezeUserById(id: number): Promise<void>;
    findUsersByPage(username: string, nickName: string, email: string, pageNo: number, pageSize: number): Promise<UserListVo>;
}
