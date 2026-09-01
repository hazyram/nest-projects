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
exports.MeetingRoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const meeting_room_entity_1 = require("./entities/meeting-room.entity");
let MeetingRoomService = class MeetingRoomService {
    repository;
    async find(pageNo, pageSize, name, capacity, equipment) {
        if (pageNo < 1) {
            throw new common_1.BadRequestException('页码最小为 1');
        }
        const skipCount = (pageNo - 1) * pageSize;
        const condition = {};
        if (name) {
            condition.name = (0, typeorm_2.Like)(`%${name}%`);
        }
        if (equipment) {
            condition.equipment = (0, typeorm_2.Like)(`%${equipment}%`);
        }
        if (capacity) {
            condition.capacity = capacity;
        }
        const [meetingRooms, totalCount] = await this.repository.findAndCount({
            skip: skipCount,
            take: pageSize,
            where: condition
        });
        return {
            meetingRooms,
            totalCount
        };
    }
    async create(meetingRoomDto) {
        const room = await this.repository.findOneBy({
            name: meetingRoomDto.name
        });
        if (room) {
            throw new common_1.BadRequestException('会议室名字已存在');
        }
        return await this.repository.save(meetingRoomDto);
    }
    async update(meetingRoomDto) {
        const meetingRoom = await this.repository.findOneBy({
            id: meetingRoomDto.id
        });
        if (!meetingRoom) {
            throw new common_1.BadRequestException('会议室不存在');
        }
        meetingRoom.capacity = meetingRoomDto.capacity;
        meetingRoom.location = meetingRoomDto.location;
        meetingRoom.name = meetingRoomDto.name;
        if (meetingRoomDto.description) {
            meetingRoom.description = meetingRoomDto.description;
        }
        if (meetingRoomDto.equipment) {
            meetingRoom.equipment = meetingRoomDto.equipment;
        }
        await this.repository.update({
            id: meetingRoom.id
        }, meetingRoom);
        return 'success';
    }
    async findById(id) {
        return this.repository.findOneBy({
            id
        });
    }
    async delete(id) {
        await this.repository.delete({
            id
        });
        return 'success';
    }
    initData() {
        const room1 = new meeting_room_entity_1.MeetingRoom();
        room1.name = '木星';
        room1.capacity = 10;
        room1.equipment = '白板';
        room1.location = '一层西';
        const room2 = new meeting_room_entity_1.MeetingRoom();
        room2.name = '金星';
        room2.capacity = 5;
        room2.equipment = '';
        room2.location = '二层东';
        const room3 = new meeting_room_entity_1.MeetingRoom();
        room3.name = '天王星';
        room3.capacity = 30;
        room3.equipment = '白板，电视';
        room3.location = '三层东';
        this.repository.insert([room1, room2, room3]);
    }
};
exports.MeetingRoomService = MeetingRoomService;
__decorate([
    (0, typeorm_1.InjectRepository)(meeting_room_entity_1.MeetingRoom),
    __metadata("design:type", typeorm_2.Repository)
], MeetingRoomService.prototype, "repository", void 0);
exports.MeetingRoomService = MeetingRoomService = __decorate([
    (0, common_1.Injectable)()
], MeetingRoomService);
//# sourceMappingURL=meeting-room.service.js.map