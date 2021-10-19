import React, { useEffect, useRef, useState } from 'react';
import { Mark } from 'types';
import { IProps, SessionKey } from './types';

const VideoPlayer: React.FC<IProps> = ({
  data,
  toNext,
  addMark,
  moveTo,
  afterMoveTo
}) => {
  const seekBarRef = useRef<HTMLInputElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const remarkRef = useRef<HTMLTextAreaElement>(null);
  const [paused, setPaused] = useState<boolean>(true);
  const [seekValue, setSeekValue] = useState<number>(0);
  const [volumeValue, setVolumeValue] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [durationTime, setDurationTime] = useState<number>(0);
  const [rateSelectorVisible, setRateSelectorVisible] =
    useState<boolean>(false);
  const [rateList] = useState([0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]);
  const [rate, setRate] = useState<number>(1);
  const [markTime, setMarkTime] = useState<number>(0);
  const [markVisible, setMarkVisible] = useState<boolean>(false);

  useEffect(() => {
    if (moveTo !== null && videoRef.current) {
      setSeekValue((moveTo / videoRef.current.duration) * 100);
      videoRef.current.currentTime = moveTo;
      afterMoveTo();
    }
  }, [afterMoveTo, moveTo]);

  useEffect(() => {
    const sesstionVolumeValue = sessionStorage.getItem(SessionKey.VolumeValue);
    const sesstionPlayTime = sessionStorage.getItem(SessionKey.PlayTime);
    if (sesstionVolumeValue) {
      setVolumeValue(parseInt(sesstionVolumeValue));
    } else {
      setVolumeValue(50);
    }
    if (videoRef.current) {
      if (sesstionPlayTime) {
        const startTime = parseInt(sesstionPlayTime);
        setSeekValue((startTime / videoRef.current.duration) * 100);
        videoRef.current.currentTime = startTime;
      } else {
        setSeekValue(0);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SessionKey.PlayTime, currentTime.toString());
  }, [currentTime]);

  useEffect(() => {
    videoRef.current?.load();
  }, [data]);

  /**
   * @discription 播放
   */
  const handlePlayStatusSwitch = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.paused) {
        video.play();
        setPaused(false);
      } else {
        video.pause();
        setPaused(true);
      }
    }
  };

  /**
   * @description 處理進度條更新
   */
  const handelSeekUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const video = videoRef.current;
      const current = (video.duration * parseInt(e.target.value)) / 100;
      video.currentTime = current;
    }
  };

  /**
   * @description 處理input range 顯示
   */
  const handleInputRangeProgress = (
    ref: React.RefObject<HTMLInputElement>,
    valPercent: number
  ) => {
    if (ref.current) {
      const style = `background: -webkit-gradient(linear, 0% 0%, 100% 0%, 
        color-stop(${valPercent} , rgba(34, 158, 158, 0.815)),
        color-stop(${valPercent}, rgba(255, 255, 255, 0.3)));`;
      ref.current.setAttribute('style', style);
    }
  };

  const handleTimeLineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeekValue(parseInt(e.target.value));
    handelSeekUpdate(e);
  };

  /**
   * @description 處理影片時間更新
   */
  const handleVideoTimeUpdate = (e: React.ChangeEvent<HTMLVideoElement>) => {
    const current = (e.target.currentTime / e.target.duration) * 100;
    if (!isNaN(e.target.duration)) setSeekValue(current);

    setCurrentTime(e.target.currentTime);
  };

  /**
   * @description 處理音量改變
   */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const val = parseInt(e.target.value);
      setVolumeValue(val);
      videoRef.current.volume = val / 100;
      sessionStorage.setItem(SessionKey.VolumeValue, val.toString());
    }
  };

  /**
   * @description 靜音切換
   */
  const handleMuteStatusSwitch = () => {
    if (videoRef.current) {
      if (videoRef.current.muted) {
        setMuted(false);
        videoRef.current.muted = false;
        const sesstionVolumeValue = sessionStorage.getItem(
          SessionKey.VolumeValue
        );
        sesstionVolumeValue && setVolumeValue(parseInt(sesstionVolumeValue));
      } else {
        setMuted(true);
        videoRef.current.muted = true;
        setVolumeValue(0);
      }
    }
  };

  //時間軸改動
  useEffect(() => {
    const valPercent = seekValue / 100;
    handleInputRangeProgress(seekBarRef, valPercent);
  }, [seekValue]);

  //音量改動
  useEffect(() => {
    const valPercent = volumeValue / 100;
    handleInputRangeProgress(volumeRef, valPercent);
  }, [volumeValue]);

  //影片結束
  const handelVideoEnded = (e: React.ChangeEvent<HTMLVideoElement>) => {
    setPaused(true);
  };

  /**
   * @description 影片時間格式化
   * @param seconds 秒數
   */
  const handleTimeFormat = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours > 0 ? hours + ':' : ''}${mins < 10 ? '0' + mins : mins}:${
      secs < 10 ? '0' + secs : secs
    }`;
  };

  const handleFullScreenSwitch = () => {
    const video = videoRef.current;
    video && video.requestFullscreen();
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLVideoElement>) => {
    setDurationTime(e.target.duration);
  };

  const handleToNext = () => {
    toNext();
    sessionStorage.removeItem(SessionKey.PlayTime);
    setCurrentTime(0);
    setSeekValue(0);
    setPaused(true);
  };

  const handleRateChange = (rate: number) => {
    setRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  const handleRateSelectorVisibleSwitch = () => {
    setRateSelectorVisible((prev) => !prev);
  };

  const handleAddMark = () => {
    const content = remarkRef.current?.value ?? '';
    const mark: Mark = {
      fileName: data.fileName,
      markList: [{ timePoint: markTime, remark: content }]
    };
    addMark(mark);
    setMarkVisible(false);
  };

  const handleShowMarkSection = () => {
    setMarkVisible((prev) => !prev);
    setMarkTime(videoRef.current?.currentTime ?? 0);
  };
  return (
    <div className="video-player">
      <video
        ref={videoRef}
        onClick={handlePlayStatusSwitch}
        onTimeUpdate={handleVideoTimeUpdate}
        onEnded={handelVideoEnded}
        onDurationChange={handleDurationChange}
      >
        <source
          type="video/mp4"
          src={require(`assets/videos/${data.fileName}`).default}
        />
        Sorry, your browser doesn't support embedded videos.
      </video>
      <div className="video-player__controls">
        <div className="controls__seek-bar">
          <input
            type="range"
            ref={seekBarRef}
            name="timeLine"
            value={seekValue.toString()}
            onChange={handleTimeLineChange}
          />
        </div>
        <div className="controls__settings">
          <div className="controls__settings-group">
            <button
              className="controls__button"
              ref={playButtonRef}
              title="播放"
              style={
                paused
                  ? {
                      backgroundImage: `url(${
                        require('assets/images/play.png').default
                      })`
                    }
                  : {
                      backgroundImage: `url(${
                        require('assets/images/pause.png').default
                      })`
                    }
              }
              onClick={handlePlayStatusSwitch}
            />
            <button
              className="controls__button"
              title="下一部"
              style={{
                backgroundImage: `url(${
                  require('assets/images/next.png').default
                })`
              }}
              onClick={handleToNext}
            />
            <div className="controls__time">
              {handleTimeFormat(currentTime)} /{handleTimeFormat(durationTime)}
            </div>
            <button
              className="controls__button controls__button__sound"
              title="音量"
              style={
                muted
                  ? {
                      backgroundImage: `url(${
                        require('assets/images/muted.png').default
                      })`
                    }
                  : {
                      backgroundImage: `url(${
                        require('assets/images/sound.png').default
                      })`
                    }
              }
              onClick={handleMuteStatusSwitch}
            />
            <div className="controls__sound-volume">
              <input
                type="range"
                name="SoundVolume"
                ref={volumeRef}
                onChange={handleVolumeChange}
                value={volumeValue.toString()}
              />
            </div>
          </div>
          <div className="controls__settings-group controls__button__add-mark">
            {markVisible ? (
              <div className="mark">
                <textarea name="remark" ref={remarkRef} />
                <button className="mark__submit-btn" onClick={handleAddMark}>
                  OK
                </button>
              </div>
            ) : null}
            <button
              className="controls__button "
              title="+時間軸"
              style={{
                backgroundImage: `url(${
                  require('assets/images/add.png').default
                })`
              }}
              onClick={handleShowMarkSection}
            ></button>
            <button
              className="controls__button controls__button--rate"
              title="速率"
              onClick={handleRateSelectorVisibleSwitch}
            >
              x{rate}
              {rateSelectorVisible ? (
                <div className="rate__selector">
                  {rateList.map((rateItem) => (
                    <div
                      className={`rate__item ${
                        rateItem === rate ? 'rate__item--active' : ''
                      }`}
                      key={rateItem}
                      onClick={() => handleRateChange(rateItem)}
                    >
                      {rateItem}
                    </div>
                  ))}
                </div>
              ) : null}
            </button>
            <button
              className="controls__button"
              title="全螢幕"
              style={{
                backgroundImage: `url(${
                  require('assets/images/full.png').default
                })`
              }}
              onClick={handleFullScreenSwitch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
