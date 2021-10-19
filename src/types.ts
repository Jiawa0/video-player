export interface Mark {
  fileName: string;
  markList: MarkContent[];
}

export interface MarkContent {
  timePoint: number;
  remark: string;
}