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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const statistic_service_1 = require("./statistic.service");
const UserBookignCount_vo_1 = require("./vo/UserBookignCount.vo");
const MeetingRoomUsedCount_vo_1 = require("./vo/MeetingRoomUsedCount.vo");
let StatisticController = class StatisticController {
    statisticService;
    async userBookignCount(startTime, endTime) {
        return this.statisticService.userBookingCount(startTime, endTime);
    }
    async meetingRoomUsedCount(startTime, endTime) {
        return this.statisticService.meetingRoomUsedCount(startTime, endTime);
    }
};
exports.StatisticController = StatisticController;
__decorate([
    (0, common_1.Inject)(statistic_service_1.StatisticService),
    __metadata("design:type", statistic_service_1.StatisticService)
], StatisticController.prototype, "statisticService", void 0);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'startTime',
        type: String,
        description: '开始时间'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endTime',
        type: String,
        description: '结束时间'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: UserBookignCount_vo_1.UserBookignCount
    }),
    (0, common_1.Get)('userBookingCount'),
    __param(0, (0, common_1.Query)('startTime')),
    __param(1, (0, common_1.Query)('endTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StatisticController.prototype, "userBookignCount", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'startTime',
        type: String,
        description: '开始时间'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endTime',
        type: String,
        description: '结束时间'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: MeetingRoomUsedCount_vo_1.MeetingRoomUsedCount
    }),
    (0, common_1.Get)('meetingRoomUsedCount'),
    __param(0, (0, common_1.Query)('startTime')),
    __param(1, (0, common_1.Query)('endTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StatisticController.prototype, "meetingRoomUsedCount", null);
exports.StatisticController = StatisticController = __decorate([
    (0, swagger_1.ApiTags)('统计管理模块'),
    (0, common_1.Controller)('statistic')
], StatisticController);
//# sourceMappingURL=statistic.controller.js.map