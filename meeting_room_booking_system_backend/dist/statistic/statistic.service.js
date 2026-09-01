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
exports.StatisticService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("../booking/entities/booking.entity");
const user_entity_1 = require("../user/entities/user.entity");
const meeting_room_entity_1 = require("../meeting-room/entities/meeting-room.entity");
const typeorm_2 = require("typeorm");
let StatisticService = class StatisticService {
    entityManager;
    async userBookingCount(startTime, endTime) {
        const res = await this.entityManager
            .createQueryBuilder(booking_entity_1.Booking, 'b')
            .select('u.id', 'userId')
            .addSelect('u.username', 'username')
            .leftJoin(user_entity_1.User, 'u', 'b.userId = u.id')
            .addSelect('count(1)', 'bookingCount')
            .where('b.startTime between :time1 and :time2', {
            time1: startTime,
            time2: endTime
        })
            .addGroupBy('b.user')
            .getRawMany();
        return res;
    }
    async meetingRoomUsedCount(startTime, endTime) {
        const res = await this.entityManager
            .createQueryBuilder(booking_entity_1.Booking, 'b')
            .select('m.id', 'meetingRoomId')
            .addSelect('m.name', 'meetingRoomName')
            .leftJoin(meeting_room_entity_1.MeetingRoom, 'm', 'b.roomId = m.id')
            .addSelect('count(1)', 'usedCount')
            .where('b.startTime between :time1 and :time2', {
            time1: startTime,
            time2: endTime
        })
            .addGroupBy('b.roomId')
            .getRawMany();
        return res;
    }
};
exports.StatisticService = StatisticService;
__decorate([
    (0, typeorm_1.InjectEntityManager)(),
    __metadata("design:type", typeorm_2.EntityManager)
], StatisticService.prototype, "entityManager", void 0);
exports.StatisticService = StatisticService = __decorate([
    (0, common_1.Injectable)()
], StatisticService);
//# sourceMappingURL=statistic.service.js.map