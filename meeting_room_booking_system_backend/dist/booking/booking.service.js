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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const user_entity_1 = require("../user/entities/user.entity");
const meeting_room_entity_1 = require("../meeting-room/entities/meeting-room.entity");
const email_service_1 = require("../email/email.service");
const redis_service_1 = require("../redis/redis.service");
let BookingService = class BookingService {
    entityManager;
    async initData() {
        const user1 = await this.entityManager.findOneBy(user_entity_1.User, {
            id: 1
        });
        const user2 = await this.entityManager.findOneBy(user_entity_1.User, {
            id: 2
        });
        const room1 = await this.entityManager.findOneBy(meeting_room_entity_1.MeetingRoom, {
            id: 2
        });
        const room2 = await await this.entityManager.findOneBy(meeting_room_entity_1.MeetingRoom, {
            id: 4
        });
        const booking1 = new booking_entity_1.Booking();
        booking1.room = room1;
        booking1.user = user1;
        booking1.startTime = new Date();
        booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(booking_entity_1.Booking, booking1);
        const booking2 = new booking_entity_1.Booking();
        booking2.room = room2;
        booking2.user = user2;
        booking2.startTime = new Date();
        booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(booking_entity_1.Booking, booking2);
        const booking3 = new booking_entity_1.Booking();
        booking3.room = room1;
        booking3.user = user2;
        booking3.startTime = new Date();
        booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(booking_entity_1.Booking, booking3);
        const booking4 = new booking_entity_1.Booking();
        booking4.room = room2;
        booking4.user = user1;
        booking4.startTime = new Date();
        booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(booking_entity_1.Booking, booking4);
    }
    async find(pageNo, pageSize, username, meetingRoomName, meetingRoomPosition, bookingTimeRangeStart, bookingTimeRangeEnd) {
        const skipCount = (pageNo - 1) * pageSize;
        const condition = {};
        if (username) {
            condition.user = {
                username: (0, typeorm_2.Like)(`%${username}%`)
            };
        }
        if (meetingRoomName) {
            condition.room = {
                name: (0, typeorm_2.Like)(`%${meetingRoomName}%`)
            };
        }
        if (meetingRoomPosition) {
            if (!condition.room) {
                condition.room = {};
            }
            condition.room.location = (0, typeorm_2.Like)(`%${meetingRoomPosition}%`);
        }
        if (bookingTimeRangeStart) {
            if (!bookingTimeRangeEnd) {
                bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
            }
            condition.startTime = (0, typeorm_2.Between)(new Date(bookingTimeRangeStart), new Date(bookingTimeRangeEnd));
        }
        const [bookings, totalCount] = await this.entityManager.findAndCount(booking_entity_1.Booking, {
            where: condition,
            relations: {
                user: true,
                room: true
            },
            skip: skipCount,
            take: pageSize
        });
        return {
            bookings: bookings.map((item) => {
                delete item.user.password;
                return item;
            }),
            totalCount
        };
    }
    async add(bookingDto, userId) {
        const meetingRoom = await this.entityManager.findOneBy(meeting_room_entity_1.MeetingRoom, {
            id: bookingDto.meetingRoomId
        });
        if (!meetingRoom) {
            throw new common_1.BadRequestException('会议室不存在');
        }
        const user = await this.entityManager.findOneBy(user_entity_1.User, {
            id: userId
        });
        const booking = new booking_entity_1.Booking();
        booking.room = meetingRoom;
        booking.user = user;
        booking.startTime = new Date(bookingDto.startTime);
        booking.endTime = new Date(bookingDto.endTime);
        const res = await this.entityManager.findOneBy(booking_entity_1.Booking, {
            room: {
                id: meetingRoom.id
            },
            startTime: (0, typeorm_2.LessThanOrEqual)(booking.startTime),
            endTime: (0, typeorm_2.MoreThanOrEqual)(booking.endTime)
        });
        if (res) {
            throw new common_1.BadRequestException('该时间段已被预定');
        }
        await this.entityManager.save(booking_entity_1.Booking, booking);
    }
    async apply(id) {
        await this.entityManager.update(booking_entity_1.Booking, {
            id
        }, {
            status: '审批通过'
        });
        return 'success';
    }
    async reject(id) {
        await this.entityManager.update(booking_entity_1.Booking, {
            id
        }, {
            status: '审批驳回'
        });
        return 'success';
    }
    async unbind(id) {
        await this.entityManager.update(booking_entity_1.Booking, {
            id
        }, {
            status: '已解除'
        });
        return 'success';
    }
    redisService;
    emailService;
    async urge(id) {
        const flag = await this.redisService.get('urge_' + id);
        if (flag) {
            return '半小时内只能催办一次，请耐心等待';
        }
        let email = await this.redisService.get('admin_email');
        if (!email) {
            const admin = await this.entityManager.findOne(user_entity_1.User, {
                select: {
                    email: true
                },
                where: {
                    isAdmin: true
                }
            });
            email = admin.email;
            this.redisService.set('admin_email', admin?.email ?? '');
        }
        this.emailService.sendMail({
            to: email,
            subject: '预定申请催办提醒',
            html: `id 为 ${id} 的预定申请正在等待审批`
        });
        this.redisService.set('urge_' + id, 1, 60 * 30);
    }
};
exports.BookingService = BookingService;
__decorate([
    (0, typeorm_1.InjectEntityManager)(),
    __metadata("design:type", typeorm_2.EntityManager)
], BookingService.prototype, "entityManager", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], BookingService.prototype, "redisService", void 0);
__decorate([
    (0, common_1.Inject)(email_service_1.EmailService),
    __metadata("design:type", email_service_1.EmailService)
], BookingService.prototype, "emailService", void 0);
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)()
], BookingService);
//# sourceMappingURL=booking.service.js.map