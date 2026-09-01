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
exports.MeetingRoom = void 0;
const typeorm_1 = require("typeorm");
let MeetingRoom = class MeetingRoom {
    id;
    name;
    capacity;
    location;
    equipment;
    description;
    isBooked;
    createTime;
    updateTime;
};
exports.MeetingRoom = MeetingRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        comment: '会议室ID'
    }),
    __metadata("design:type", Number)
], MeetingRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        comment: '会议室名字'
    }),
    __metadata("design:type", String)
], MeetingRoom.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '会议室容量'
    }),
    __metadata("design:type", Number)
], MeetingRoom.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        comment: '会议室位置'
    }),
    __metadata("design:type", String)
], MeetingRoom.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        comment: '设备',
        default: ''
    }),
    __metadata("design:type", String)
], MeetingRoom.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
        comment: '描述',
        default: ''
    }),
    __metadata("design:type", String)
], MeetingRoom.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '是否被预订',
        default: false
    }),
    __metadata("design:type", Boolean)
], MeetingRoom.prototype, "isBooked", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        comment: '创建时间'
    }),
    __metadata("design:type", Date)
], MeetingRoom.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        comment: '更新时间'
    }),
    __metadata("design:type", Date)
], MeetingRoom.prototype, "updateTime", void 0);
exports.MeetingRoom = MeetingRoom = __decorate([
    (0, typeorm_1.Entity)()
], MeetingRoom);
//# sourceMappingURL=meeting-room.entity.js.map