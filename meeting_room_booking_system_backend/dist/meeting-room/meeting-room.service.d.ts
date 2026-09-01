import { MeetingRoom } from './entities/meeting-room.entity';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
export declare class MeetingRoomService {
    private repository;
    find(pageNo: number, pageSize: number, name: string, capacity: number, equipment: string): Promise<{
        meetingRooms: MeetingRoom[];
        totalCount: number;
    }>;
    create(meetingRoomDto: CreateMeetingRoomDto): Promise<CreateMeetingRoomDto & MeetingRoom>;
    update(meetingRoomDto: UpdateMeetingRoomDto): Promise<string>;
    findById(id: number): Promise<MeetingRoom | null>;
    delete(id: number): Promise<string>;
    initData(): void;
}
