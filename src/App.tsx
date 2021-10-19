import VideoPlayer from 'components/VideoPlayer';
import React, { useEffect, useState } from 'react';
import { videoList } from 'assets/videoList.json';
import { Mark } from 'types';
import commonService from 'util/commonService';
const App: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<number>(
    parseInt(sessionStorage.getItem('currentVideo') ?? '0')
  );
  const [videoMoveTo, setVideoMoveTo] = useState<number | null>(null);

  const [markList, setMarkList] = useState<Mark[]>([]);

  useEffect(() => {
    sessionStorage.setItem('currentVideo', currentVideo.toString());
  }, [currentVideo]);

  useEffect(() => {
    const sessionCurrentVideo = sessionStorage.getItem('currentVideo');
    console.log(sessionCurrentVideo);
    if (sessionCurrentVideo) setCurrentVideo(parseInt(sessionCurrentVideo));
  }, []);

  const handleToNext = () => {
    if (currentVideo === videoList.length - 1) {
      setCurrentVideo(0);
    } else {
      setCurrentVideo((prev) => prev + 1);
    }
  };

  const addMark = (mark: Mark) => {
    setMarkList((prev) => {
      let prevState = [...prev];
      const target = prev.findIndex((i) => i.fileName === mark.fileName);
      if (target !== -1) {
        prevState[target] = {
          ...prev[target],
          markList: [...prev[target].markList, ...mark.markList]
        };
      } else {
        prevState = [...prevState, mark];
      }
      return prevState;
    });
  };

  const deleteMark = (targetIndex: number) => {
    setMarkList((prev) => {
      let prevState = [...prev];
      const target = prev.findIndex(
        (i) => i.fileName === videoList[currentVideo].fileName
      );
      if (target !== -1) {
        prevState[target] = {
          ...prev[target],
          markList: prev[target].markList.filter(
            (i, index) => targetIndex !== index
          )
        };
      }
      return prevState;
    });
  };
  const currentMark =
    markList.find((i) => i.fileName === videoList[currentVideo].fileName)
      ?.markList ?? [];

  const handleRemarkChange = (
    e: React.FormEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    const remark = e.currentTarget.nodeValue ?? '';
    console.log(remark);
    setMarkList((prev) => {
      let prevState = [...prev];
      const target = prev.findIndex(
        (i) => i.fileName === videoList[currentVideo].fileName
      );
      if (target !== -1) {
        prevState[target] = {
          ...prev[target],
          markList: prev[target].markList.map((i, index) => {
            if (targetIndex === index) {
              return {
                timePoint: i.timePoint,
                remark: remark
              };
            } else {
              return i;
            }
          })
        };
      }

      return prevState;
    });
  };

  const hanleMoveTo = (time: number) => {
    setVideoMoveTo(time);
  };

  const handleMoveToFinish = () => {
    setVideoMoveTo(null);
  };
  return (
    <div className="App">
      <div className="container">
        <div className="player">
          <div className="player__video">
            <VideoPlayer
              data={videoList[currentVideo]}
              toNext={handleToNext}
              addMark={addMark}
              moveTo={videoMoveTo}
              afterMoveTo={handleMoveToFinish}
            />
          </div>
          <div className="player__feature">
            <div className="player__feature__title">時間軸</div>
            <div className="player__feature__content">
              {currentMark.map((i, index) => (
                <div className="player__feature__item" key={index}>
                  <div
                    className="item__time-point"
                    onClick={() => hanleMoveTo(i.timePoint)}
                  >
                    {commonService.handleTimeFormat(i.timePoint)}
                  </div>
                  <div
                    className="item__remark"
                    onChange={(e) => handleRemarkChange(e, index)}
                  >
                    {i.remark}
                  </div>
                  <button onClick={() => deleteMark(index)}>x</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="info">
          <div className="info__title">{videoList[currentVideo].name}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
