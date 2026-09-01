import { Permission } from '../entities/permission.entity';
declare class UserInfo {
    id: number;
    username: string;
    nickName: string;
    email: string;
    headPic: string;
    phoneNumber: string;
    isFrozen: boolean;
    isAdmin: boolean;
    createTime: number;
    roles: string[];
    permissions: Permission[];
}
export declare class LoginUserVo {
    userInfo: UserInfo;
    accessToken: string;
    refreshToken: string;
}
export {};
