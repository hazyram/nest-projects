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
exports.MeetingRoomController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const meeting_room_service_1 = require("./meeting-room.service");
const utils_1 = require("../utils");
const create_meeting_room_dto_1 = require("./dto/create-meeting-room.dto");
const update_meeting_room_dto_1 = require("./dto/update-meeting-room.dto");
const custom_decorator_1 = require("../custom.decorator");
const meeting_room_vo_1 = require("./vo/meeting-room.vo");
const meeting_room_list_vo_1 = require("./vo/meeting-room-list.vo");
let MeetingRoomController = class MeetingRoomController {
    meetingRoomService;
    constructor(meetingRoomService) {
        this.meetingRoomService = meetingRoomService;
    }
    async list(pageNo, pageSize, name, capacity, equipment) {
        return await this.meetingRoomService.find(pageNo, pageSize, name, capacity, equipment);
    }
    async create(meetingRoomDto) {
        return await this.meetingRoomService.create(meetingRoomDto);
    }
    async update(meetingRoomDto) {
        return await this.meetingRoomService.update(meetingRoomDto);
    }
    async find(id) {
        return await this.meetingRoomService.findById(id);
    }
    async delete(id) {
        return await this.meetingRoomService.delete(id);
    }
};
exports.MeetingRoomController = MeetingRoomController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'pageNo',
        type: Number,
        required: false
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        type: Number,
        required: false
    }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        type: String,
        required: false
    }),
    (0, swagger_1.ApiQuery)({
        name: 'capacity',
        type: String,
        required: false
    }),
    (0, swagger_1.ApiQuery)({
        name: 'equipment',
        type: String,
        required: false
    }),
    (0, swagger_1.ApiResponse)({
        type: meeting_room_list_vo_1.MeetingRoomListVo
    }),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('pageNo', new common_1.DefaultValuePipe(1), (0, utils_1.generateParseIntPipe)('pageNo'))),
    __param(1, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(2), (0, utils_1.generateParseIntPipe)('pageSize'))),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Query)('capacity')),
    __param(4, (0, common_1.Query)('equipment')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, String]),
    __metadata("design:returntype", Promise)
], MeetingRoomController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: create_meeting_room_dto_1.CreateMeetingRoomDto
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '会议室名字已存在'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: meeting_room_vo_1.MeetingRoomVo
    }),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meeting_room_dto_1.CreateMeetingRoomDto]),
    __metadata("design:returntype", Promise)
], MeetingRoomController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: update_meeting_room_dto_1.UpdateMeetingRoomDto
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '会议室不存在'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'success'
    }),
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_meeting_room_dto_1.UpdateMeetingRoomDto]),
    __metadata("design:returntype", Promise)
], MeetingRoomController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MeetingRoomController.prototype, "find", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'id'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'success',
        type: meeting_room_vo_1.MeetingRoomVo
    }),
    (0, custom_decorator_1.RequireLogin)(),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MeetingRoomController.prototype, "delete", null);
exports.MeetingRoomController = MeetingRoomController = __decorate([
    (0, swagger_1.ApiTags)('会议室模块'),
    (0, common_1.Controller)('meeting-room'),
    __metadata("design:paramtypes", [meeting_room_service_1.MeetingRoomService])
], MeetingRoomController);
//# sourceMappingURL=meeting-room.controller.js.map