// Schedule
export interface ScheduleOption {
  id: number;
  title: string;
  date: string;
}

// Tags
export interface TagOption {
  id: number;
  title: string;
  image_uri: string;
}

// Activities
export interface Activity {
  id: number;
  title: string;
  description: string;
  video_uri: string;
}