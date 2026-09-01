import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
export declare class BookingService {
    private entityManager;
    initData(): Promise<void>;
    find(pageNo: number, pageSize: number, username: string, meetingRoomName: string, meetingRoomPosition: string, bookingTimeRangeStart: number, bookingTimeRangeEnd: number): Promise<{
        bookings: Booking[];
        totalCount: number;
    }>;
    add(bookingDto: CreateBookingDto, userId: number): Promise<void>;
    apply(id: number): Promise<string>;
    reject(id: number): Promise<string>;
    unbind(id: number): Promise<string>;
    private redisService;
    private emailService;
    urge(id: number): Promise<"半小时内只能催办一次，请耐心等待" | undefined>;
}
