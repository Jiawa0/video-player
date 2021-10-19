import { Mark } from 'types';

export interface IProps {
  data: {
    name: string;
    fileName: string;
  }
  toNext: () => void;
  addMark: (mark: Mark) => void;
  moveTo: number | null;
  afterMoveTo: () => void;
}

export enum SessionKey {
  PlayTime = 'playTime',
  VolumeValue = 'volumeValue'
}