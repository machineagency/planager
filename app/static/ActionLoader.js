// TODO: The available actions should be loaded dynamically and not imported here. They should only import if added to the plan.
import PlanagerWebcam from "../planager/actionsets/camera/planager_webcam/PlanagerWebcam";
import ImageTrace from "../planager/actionsets/svgtools/image_trace/ImageTrace";
import ImageViewer from "../planager/actionsets/camera/image_viewer/ImageViewer";
import DrawSVG from "../planager/actionsets/axidraw/draw_svg/DrawSVG";
import Options from "../planager/actionsets/axidraw/options/Options";
import Resize from "../planager/actionsets/svgtools/resize/Resize";
import Editor from "../planager/actionsets/data/editor/Editor";
import PixelArt from "../planager/actionsets/pixels/pixel_art/PixelArt";
import Download from "../planager/actionsets/data/download/Download";
import DataViewer from "../planager/actionsets/data/data_viewer/DataViewer";
import CellularAutomata from "../planager/actionsets/pixels/cellular_automata_1d/CellularAutomata";
import Upload from "../planager/actionsets/data/upload/Upload";
import Thing from "../planager/actionsets/workflow/thing/Thing";
import Method from "../planager/actionsets/workflow/method/Method";
import Text from "../planager/actionsets/inputs/text/Text";
import RecordArray from "../planager/actionsets/inputs/recordArray/RecordArray";
import MediaSources from "../planager/actionsets/inputs/mediaSources/MediaSources";
import VideoFeed from "../planager/actionsets/inputs/videoFeed/VideoFeed";
import AudioFeed from "../planager/actionsets/inputs/audioFeed/AudioFeed";

export default {
  AudioFeed: AudioFeed,
  PlanagerWebcam: PlanagerWebcam,
  ImageTrace: ImageTrace,
  ImageViewer: ImageViewer,
  DrawSVG: DrawSVG,
  Options: Options,
  Resize: Resize,
  Method: Method,
  Thing: Thing,
  Text: Text,
  RecordArray: RecordArray,
  MediaSources: MediaSources,
  Editor: Editor,
  PixelArt: PixelArt,
  Download: Download,
  DataViewer: DataViewer,
  CellularAutomata: CellularAutomata,
  Upload: Upload,
  VideoFeed: VideoFeed,
};
