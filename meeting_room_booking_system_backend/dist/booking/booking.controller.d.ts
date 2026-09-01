import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    list(pageNo: number, pageSize: number, username: string, meetingRoomName: string, meetingRoomPosition: string, bookingTimeRangeStart: number, bookingTimeRangeEnd: number): Promise<{
        bookings: import("./entities/booking.entity").Booking[];
        totalCount: number;
    }>;
    add(booking: CreateBookingDto, userId: number): Promise<string>;
    apply(id: number): Promise<string>;
    reject(id: number): Promise<string>;
    unbind(id: number): Promise<string>;
    urge(id: number): Promise<"半小时内只能催办一次，请耐心等待" | undefined>;
}
