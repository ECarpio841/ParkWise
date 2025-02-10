// types.ts (archivo nuevo)
export interface Space {
    id: number;
    spaceId: string;
    occupied: boolean;
    startTime: string | null;
    endTime: string | null;
    duration: number | null;
    dateTime: string;
    createdAt: string;
    updatedAt: string;
  }