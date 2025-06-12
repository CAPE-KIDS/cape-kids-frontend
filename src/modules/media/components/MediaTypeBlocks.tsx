import TextMedia from "../blocks/TextMedia";
import VideoMedia from "../blocks/VideoMedia";
import AudioMedia from "../blocks/AudioMedia";
import ImageMedia from "../blocks/ImageMedia";

export const MediaTypeBlocks = () => {
  return (
    <div className="flex gap-1">
      <TextMedia />
      <ImageMedia />
      {/* <VideoMedia />
      <AudioMedia /> */}
    </div>
  );
};
