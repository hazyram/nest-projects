"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_service_1 = require("./user.service");
const register_user_dto_1 = require("./dto/register-user.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const email_service_1 = require("../email/email.service");
const redis_service_1 = require("../redis/redis.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const custom_decorator_1 = require("../custom.decorator");
const update_user_password_dto_1 = require("./dto/update-user-password.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const utils_1 = require("../utils");
const swagger_1 = require("@nestjs/swagger");
const login_user_vo_1 = require("./vo/login-user.vo");
const refresh_token_vo_1 = require("./vo/refresh-token.vo");
const user_info_vo_1 = require("./vo/user-info.vo");
const user_list_vo_1 = require("./vo/user-list.vo");
const path = __importStar(require("path"));
const my_file_storage_1 = require("../my-file-storage");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    emailService;
    redisService;
    jwtService;
    configService;
    async register(registerUser) {
        return await this.userService.register(registerUser);
    }
    async captcha(address) {
        const code = Math.random().toString().slice(2, 8);
        await this.redisService.set(`captcha_${address}`, code, 5 * 60);
        await this.emailService.sendMail({
            to: address,
            subject: '注册验证码',
            html: `<p>你的注册验证码是 ${code}</p>`
        });
        return '发送成功';
    }
    async initData() {
        await this.userService.initData();
        return 'done';
    }
    async userLogin(loginUser) {
        const vo = await this.userService.login(loginUser, false);
        vo.accessToken = this.jwtService.sign({
            userId: vo.userInfo.id,
            username: vo.userInfo.username,
            email: vo.userInfo.email,
            roles: vo.userInfo.roles,
            permissions: vo.userInfo.permissions
        }, {
            expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
        });
        vo.refreshToken = this.jwtService.sign({
            userId: vo.userInfo.id
        }, {
            expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
        });
        return vo;
    }
    async adminLogin(loginUser) {
        const vo = await this.userService.login(loginUser, true);
        vo.accessToken = this.jwtService.sign({
            userId: vo.userInfo.id,
            username: vo.userInfo.username,
            email: vo.userInfo.email,
            roles: vo.userInfo.roles,
            permissions: vo.userInfo.permissions
        }, {
            expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
        });
        vo.refreshToken = this.jwtService.sign({
            userId: vo.userInfo.id
        }, {
            expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
        });
        return vo;
    }
    async refresh(refreshToken) {
        try {
            const data = this.jwtService.verify(refreshToken);
            const user = await this.userService.findUserById(data.userId, false);
            const access_token = this.jwtService.sign({
                userId: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles,
                permissions: user.permissions
            }, {
                expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
            });
            const refresh_token = this.jwtService.sign({
                userId: user.id
            }, {
                expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
            });
            const vo = new refresh_token_vo_1.RefreshTokenVo();
            vo.access_token = access_token;
            vo.refresh_token = refresh_token;
            return vo;
        }
        catch (e) {
            throw new common_1.UnauthorizedException('token 已失效，请重新登录');
        }
    }
    async adminRefresh(refreshToken) {
        try {
            const data = this.jwtService.verify(refreshToken);
            const user = await this.userService.findUserById(data.userId, true);
            const access_token = this.jwtService.sign({
                userId: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles,
                permissions: user.permissions
            }, {
                expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
            });
            const refresh_token = this.jwtService.sign({
                userId: user.id
            }, {
                expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
            });
            return {
                access_token,
                refresh_token
            };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('token 已失效，请重新登录');
        }
    }
    async info(userId) {
        return await this.userService.findUserDetailById(userId);
    }
    async updatePassword(passwordDto) {
        return await this.userService.updatePassword(passwordDto);
    }
    async updatePasswordCaptcha(address) {
        const code = Math.random().toString().slice(2, 8);
        await this.redisService.set(`update_password_captcha_${address}`, code, 10 * 60);
        await this.emailService.sendMail({
            to: address,
            subject: '更改密码验证码',
            html: `<p>你的更改密码验证码是 ${code}</p>`
        });
        return '发送成功';
    }
    async update(userId, updateUserDto) {
        return await this.userService.update(userId, updateUserDto);
    }
    async updateCaptcha(address) {
        const code = Math.random().toString().slice(2, 8);
        await this.redisService.set(`update_user_captcha_${address}`, code, 10 * 60);
        await this.emailService.sendMail({
            to: address,
            subject: '更改用户信息验证码',
            html: `<p>你的验证码是 ${code}</p>`
        });
        return '发送成功';
    }
    async freeze(userId) {
        await this.userService.freezeUserById(userId);
        return 'success';
    }
    async list(pageNo, pageSize, username, nickName, email) {
        return await this.userService.findUsersByPage(username, nickName, email, pageNo, pageSize);
    }
    uploadFile(file) {
        console.log('file', file);
        return file.path;
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Inject)(email_service_1.EmailService),
    __metadata("design:type", email_service_1.EmailService)
], UserController.prototype, "emailService", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserController.prototype, "redisService", void 0);
__decorate([
    (0, common_1.Inject)(jwt_1.JwtService),
    __metadata("design:type", jwt_1.JwtService)
], UserController.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], UserController.prototype, "configService", void 0);
__decorate([
    (0, swagger_1.ApiBody)({ type: register_user_dto_1.RegisterUserDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '验证码已失效/验证码不正确/用户已存在',
        type: String
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '注册成功/失败',
        type: String
    }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'address',
        type: String,
        description: '邮箱地址',
        required: true,
        example: 'xxx@xx.com'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '发送成功',
        type: String
    }),
    (0, common_1.Get)('register-captcha'),
    __param(0, (0, common_1.Query)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "captcha", null);
__decorate([
    (0, common_1.Get)('init-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "initData", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: login_user_dto_1.LoginUserDto
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '用户不存在/密码错误',
        type: String
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '用户信息和 token',
        type: login_user_vo_1.LoginUserVo
    }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userLogin", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: login_user_dto_1.LoginUserDto
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '用户不存在/密码错误',
        type: String
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '用户信息和 token',
        type: login_user_vo_1.LoginUserVo
    }),
    (0, common_1.Post)('admin/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminLogin", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'refreshToken',
        type: String,
        description: '刷新 token',
        required: true,
        example: 'xxxxxxxxyyyyyyyyzzzzz'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'token 已失效，请重新登录'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '刷新成功',
        type: refresh_token_vo_1.RefreshTokenVo
    }),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Query)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('admin/refresh'),
    __param(0, (0, common_1.Query)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminRefresh", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        type: Number,
        description: '用户id',
        required: true,
        example: '1'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '用户信息',
        type: user_info_vo_1.UserDetailVo
    }),
    (0, common_1.Get)('info'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "info", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: update_user_password_dto_1.UpdateUserPasswordDto
    }),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: '验证码已失效/不正确'
    }),
    (0, common_1.Post)(['update_password', 'admin/update_password']),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_password_dto_1.UpdateUserPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'address',
        description: '邮箱地址',
        type: String
    }),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: '发送成功'
    }),
    (0, common_1.Get)('update_password/captcha'),
    __param(0, (0, common_1.Query)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePasswordCaptcha", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '验证码已失效/不正确'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '更新成功',
        type: String
    }),
    (0, common_1.Post)(['update', 'admin/update']),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: '发送成功'
    }),
    (0, custom_decorator_1.RequireLogin)(),
    (0, common_1.Get)('update/captcha'),
    __param(0, (0, custom_decorator_1.UserInfo)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateCaptcha", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'id',
        description: 'userId',
        type: Number
    }),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: 'success'
    }),
    (0, custom_decorator_1.RequireLogin)(),
    (0, common_1.Get)('freeze'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "freeze", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'pageNo',
        description: '第几页',
        type: Number
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        description: '每页多少条',
        type: Number
    }),
    (0, swagger_1.ApiQuery)({
        name: 'username',
        description: '用户名',
        type: Number
    }),
    (0, swagger_1.ApiQuery)({
        name: 'nickName',
        description: '昵称',
        type: Number
    }),
    (0, swagger_1.ApiQuery)({
        name: 'email',
        description: '邮箱地址',
        type: Number
    }),
    (0, swagger_1.ApiResponse)({
        type: user_list_vo_1.UserListVo,
        description: '用户列表'
    }),
    (0, custom_decorator_1.RequireLogin)(),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('pageNo', new common_1.DefaultValuePipe(1), (0, utils_1.generateParseIntPipe)('pageNo'))),
    __param(1, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(10), (0, utils_1.generateParseIntPipe)('pageSize'))),
    __param(2, (0, common_1.Query)('username')),
    __param(3, (0, common_1.Query)('nickName')),
    __param(4, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        dest: 'uploads',
        storage: my_file_storage_1.storage,
        limits: {
            fileSize: 1024 * 1024 * 3
        },
        fileFilter(req, file, callback) {
            const extname = path.extname(file.originalname);
            if (['.png', '.jpg', '.gif'].includes(extname)) {
                callback(null, true);
            }
            else {
                callback(new common_1.BadRequestException('只能上传图片'), false);
            }
        }
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "uploadFile", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('用户管理模块'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map