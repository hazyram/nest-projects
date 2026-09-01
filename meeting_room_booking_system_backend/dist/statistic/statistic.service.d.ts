export declare class StatisticService {
    private entityManager;
    userBookingCount(startTime: string, endTime: string): Promise<any[]>;
    meetingRoomUsedCount(startTime: string, endTime: string): Promise<any[]>;
}
