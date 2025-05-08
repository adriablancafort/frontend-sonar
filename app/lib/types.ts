// Schedule
export interface ScheduleOption {
  id: number;
  title: string;
  date: string;
  type: string;
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
  image_uri: string;
  activity_uri: string;
  start_time: string;
  end_time: string;
  dominant_color: string;
  dark_color: string;
  pastel_color: string;
  tags: string[];
}

// Results
export interface Result {
  id: number;
  title: string;
  description: string;
  image_uri: string;
  start_time: string;
  end_time: string;
  schedules: {
    title: string;
  };
  dominant_color: string;
  dark_color: string;
  pastel_color: string;
  activity_uri: string;
  tags: string[];
}