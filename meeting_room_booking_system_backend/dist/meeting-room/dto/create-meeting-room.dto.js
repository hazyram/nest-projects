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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMeetingRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMeetingRoomDto {
    name;
    capacity;
    location;
    equipment;
    description;
}
exports.CreateMeetingRoomDto = CreateMeetingRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: '会议室名称不能为空'
    }),
    (0, class_validator_1.MaxLength)(10, {
        message: '会议室名称最长为 10 字符'
    }),
    __metadata("design:type", String)
], CreateMeetingRoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: '容量不能为空'
    }),
    __metadata("design:type", Number)
], CreateMeetingRoomDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: '位置不能为空'
    }),
    (0, class_validator_1.MaxLength)(50, {
        message: '位置最长为 50 字符'
    }),
    __metadata("design:type", String)
], CreateMeetingRoomDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.MaxLength)(50, {
        message: '设备最长为 50 字符'
    }),
    __metadata("design:type", String)
], CreateMeetingRoomDto.prototype, "equipment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.MaxLength)(100, {
        message: '描述最长为 100 字符'
    }),
    __metadata("design:type", String)
], CreateMeetingRoomDto.prototype, "description", void 0);
//# sourceMappingURL=create-meeting-room.dto.js.map