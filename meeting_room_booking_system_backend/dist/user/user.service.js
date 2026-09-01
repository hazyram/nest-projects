"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const redis_service_1 = require("../redis/redis.service");
const role_entity_1 = require("./entities/role.entity");
const permission_entity_1 = require("./entities/permission.entity");
const utils_1 = require("../utils");
const login_user_vo_1 = require("./vo/login-user.vo");
const user_info_vo_1 = require("./vo/user-info.vo");
const user_list_vo_1 = require("./vo/user-list.vo");
let UserService = UserService_1 = class UserService {
    logger = new common_1.Logger();
    userRepository;
    roleRepository;
    permissionRepository;
    redisService;
    async register(user) {
        const captcha = await this.redisService.get(`captcha_${user.email}`);
        console.log(captcha);
        if (!captcha) {
            throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.captcha !== captcha) {
            throw new common_1.HttpException('验证码不正确', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundUser = await this.userRepository.findOneBy({
            username: user.username
        });
        if (foundUser) {
            throw new common_1.HttpException('用户已存在', common_1.HttpStatus.BAD_REQUEST);
        }
        const newUser = new user_entity_1.User();
        newUser.username = user.username;
        newUser.password = (0, utils_1.md5)(user.password);
        newUser.email = user.email;
        newUser.nickName = user.nickName;
        try {
            await this.userRepository.save(newUser);
            return '注册成功';
        }
        catch (e) {
            this.logger.error(e, UserService_1);
            return '注册失败';
        }
    }
    async login(loginUserDto, isAdmin) {
        const user = await this.userRepository.findOne({
            where: {
                username: loginUserDto.username,
                isAdmin
            },
            relations: {
                roles: {
                    permissions: true
                }
            }
        });
        if (!user) {
            throw new common_1.HttpException('用户不存在', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.password !== (0, utils_1.md5)(loginUserDto.password)) {
            throw new common_1.HttpException('密码错误', common_1.HttpStatus.BAD_REQUEST);
        }
        const vo = new login_user_vo_1.LoginUserVo();
        vo.userInfo = {
            id: user.id,
            username: user.username,
            nickName: user.nickName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            headPic: user.headPic,
            createTime: user.createTime.getTime(),
            isFrozen: user.isFrozen,
            isAdmin: user.isAdmin,
            roles: user.roles.map((item) => item.name),
            permissions: [
                ...new Map(user.roles.flatMap((item) => item.permissions).map((p) => [p.code, p])).values()
            ]
        };
        return vo;
    }
    async initData() {
        const user1 = new user_entity_1.User();
        user1.username = 'zhangsan';
        user1.password = (0, utils_1.md5)('111111');
        user1.email = 'xxx@xx.com';
        user1.isAdmin = true;
        user1.nickName = '张三';
        user1.phoneNumber = '13233323333';
        const user2 = new user_entity_1.User();
        user2.username = 'lisi';
        user2.password = (0, utils_1.md5)('222222');
        user2.email = 'yy@yy.com';
        user2.nickName = '李四';
        const role1 = new role_entity_1.Role();
        role1.name = '管理员';
        const role2 = new role_entity_1.Role();
        role2.name = '普通用户';
        const permission1 = new permission_entity_1.Permission();
        permission1.code = 'ccc';
        permission1.description = '访问 ccc 接口';
        const permission2 = new permission_entity_1.Permission();
        permission2.code = 'ddd';
        permission2.description = '访问 ddd 接口';
        user1.roles = [role1];
        user2.roles = [role2];
        role1.permissions = [permission1, permission2];
        role2.permissions = [permission1];
        await this.permissionRepository.save([permission1, permission2]);
        await this.roleRepository.save([role1, role2]);
        await this.userRepository.save([user1, user2]);
    }
    async findUserById(userId, isAdmin) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
                isAdmin
            },
            relations: {
                roles: {
                    permissions: true
                }
            }
        });
        if (!user) {
            throw new common_1.HttpException('用户不存在', common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            email: user.email,
            roles: user.roles.map((item) => item.name),
            permissions: [
                ...new Map(user.roles.flatMap((item) => item.permissions).map((p) => [p.code, p])).values()
            ]
        };
    }
    async findUserDetailById(userId) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.HttpException('用户不存在', common_1.HttpStatus.BAD_REQUEST);
        }
        const vo = new user_info_vo_1.UserDetailVo();
        vo.id = user.id;
        vo.email = user.email;
        vo.username = user.username;
        vo.headPic = user.headPic;
        vo.phoneNumber = user.phoneNumber;
        vo.nickName = user.nickName;
        vo.createTime = user.createTime;
        vo.isFrozen = user.isFrozen;
        return vo;
    }
    async updatePassword(passwordDto) {
        const captcha = await this.redisService.get(`update_password_captcha_${passwordDto.email}`);
        if (!captcha) {
            throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.BAD_REQUEST);
        }
        if (passwordDto.captcha !== captcha) {
            throw new common_1.HttpException('验证码不正确', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundUser = await this.userRepository.findOneBy({
            username: passwordDto.username
        });
        if (!foundUser) {
            throw new common_1.HttpException('用户不存在', common_1.HttpStatus.BAD_REQUEST);
        }
        if (foundUser.email !== passwordDto.email) {
            throw new common_1.HttpException('邮箱不正确', common_1.HttpStatus.BAD_REQUEST);
        }
        foundUser.password = (0, utils_1.md5)(passwordDto.password);
        try {
            await this.userRepository.save(foundUser);
            return '密码修改成功';
        }
        catch (e) {
            this.logger.error(e, UserService_1);
            return '密码修改失败';
        }
    }
    async update(userId, updateUserDto) {
        const captcha = await this.redisService.get(`update_user_captcha_${updateUserDto.email}`);
        if (!captcha) {
            throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.BAD_REQUEST);
        }
        if (updateUserDto.captcha !== captcha) {
            throw new common_1.HttpException('验证码不正确', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundUser = await this.userRepository.findOneBy({
            id: userId
        });
        if (!foundUser) {
            throw new common_1.HttpException('用户不存在', common_1.HttpStatus.BAD_REQUEST);
        }
        if (updateUserDto.nickName) {
            foundUser.nickName = updateUserDto.nickName;
        }
        if (updateUserDto.headPic) {
            foundUser.headPic = updateUserDto.headPic;
        }
        try {
            await this.userRepository.save(foundUser);
            return '用户信息修改成功';
        }
        catch (e) {
            this.logger.error(e, UserService_1);
            return '用户信息修改成功';
        }
    }
    async freezeUserById(id) {
        const user = await this.userRepository.findOneBy({
            id
        });
        if (!user) {
            throw new common_1.HttpException('用户不存在', common_1.HttpStatus.BAD_REQUEST);
        }
        user.isFrozen = true;
        await this.userRepository.save(user);
    }
    async findUsersByPage(username, nickName, email, pageNo, pageSize) {
        const skipCount = (pageNo - 1) * pageSize;
        const condition = {};
        if (username) {
            condition.username = (0, typeorm_2.Like)(`%${username}%`);
        }
        if (nickName) {
            condition.nickName = (0, typeorm_2.Like)(`%${nickName}%`);
        }
        if (email) {
            condition.email = (0, typeorm_2.Like)(`%${email}%`);
        }
        const [users, totalCount] = await this.userRepository.findAndCount({
            select: {
                id: true,
                username: true,
                nickName: true,
                email: true,
                phoneNumber: true,
                isFrozen: true,
                headPic: true,
                createTime: true
            },
            skip: skipCount,
            take: pageSize,
            where: condition
        });
        const vo = new user_list_vo_1.UserListVo();
        vo.users = users;
        vo.totalCount = totalCount;
        return vo;
    }
};
exports.UserService = UserService;
__decorate([
    (0, typeorm_1.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "userRepository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(role_entity_1.Role),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "roleRepository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(permission_entity_1.Permission),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "permissionRepository", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserService.prototype, "redisService", void 0);
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map