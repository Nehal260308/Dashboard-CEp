export interface ModuleTypes {
  poster: 'poster';
  wardMap: 'ward-map';
  skywalk: 'skywalk';
  survey: 'survey';
  interview: 'interview';
  mapillary: 'mapillary';
  problemSolving: 'problem';
}

export type FileType = {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  type: string;
  size: number;
};

export type Profile = {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

export type PosterData = {
  id: string;
  user_id: string;
  image_url: string;
  title: string;
  created_at: string;
  updated_at: string;
  location?: { x: number; y: number };
  tags?: string[];
  status?: string;
};