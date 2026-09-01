import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
export declare class MeetingRoomController {
    private readonly meetingRoomService;
    constructor(meetingRoomService: MeetingRoomService);
    list(pageNo: number, pageSize: number, name: string, capacity: number, equipment: string): Promise<{
        meetingRooms: import("./entities/meeting-room.entity").MeetingRoom[];
        totalCount: number;
    }>;
    create(meetingRoomDto: CreateMeetingRoomDto): Promise<CreateMeetingRoomDto & import("./entities/meeting-room.entity").MeetingRoom>;
    update(meetingRoomDto: UpdateMeetingRoomDto): Promise<string>;
    find(id: number): Promise<import("./entities/meeting-room.entity").MeetingRoom | null>;
    delete(id: number): Promise<string>;
}
