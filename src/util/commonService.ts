/**
  * @description 影片時間格式化
  * @param seconds 秒數
  */
const handleTimeFormat = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours > 0 ? hours + ':' : ''}${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs
    }`;
};


export default {
  handleTimeFormat
}