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
exports.Booking = void 0;
const meeting_room_entity_1 = require("../../meeting-room/entities/meeting-room.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Booking = class Booking {
    id;
    startTime;
    endTime;
    status;
    note;
    user;
    room;
    createTime;
    updateTime;
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '会议开始时间'
    }),
    __metadata("design:type", Date)
], Booking.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '会议结束时间'
    }),
    __metadata("design:type", Date)
], Booking.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 20,
        comment: '状态（申请中、审批通过、审批驳回、已解除）',
        default: '申请中'
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
        comment: '备注',
        default: ''
    }),
    __metadata("design:type", String)
], Booking.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => meeting_room_entity_1.MeetingRoom),
    __metadata("design:type", meeting_room_entity_1.MeetingRoom)
], Booking.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        comment: '创建时间'
    }),
    __metadata("design:type", Date)
], Booking.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        comment: '更新时间'
    }),
    __metadata("design:type", Date)
], Booking.prototype, "updateTime", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)()
], Booking);
//# sourceMappingURL=booking.entity.js.map