// TODO: The available actions should be loaded dynamically and not imported here. They should only import if added to the plan.
import ImageTrace from "../actionsets/images/image_trace/ImageTrace";
import ImageViewer from "../actionsets/images/image_viewer/ImageViewer";
import Options from "../actionsets/axidraw/options/Options";
import Resize from "../actionsets/images/resize/Resize";
import Editor from "../actionsets/data/editor/Editor";
import PixelArt from "../actionsets/pixels/pixel_art/PixelArt";
import Download from "../actionsets/data/download/Download";
import DataViewer from "../actionsets/data/data_viewer/DataViewer";
import CellularAutomata from "../actionsets/pixels/cellular_automata_1d/CellularAutomata";
import Upload from "../actionsets/data/upload/Upload";
import Thing from "../actionsets/workflow/thing/Thing";
import Method from "../actionsets/workflow/method/Method";
import Text from "../actionsets/inputs/text/Text";
import RecordArray from "../actionsets/inputs/recordArray/RecordArray";
import MediaSources from "../actionsets/inputs/mediaSources/MediaSources";
import VideoFeed from "../actionsets/inputs/videoFeed/VideoFeed";
import AudioFeed from "../actionsets/inputs/audioFeed/AudioFeed";
import PlotInteractive from "../actionsets/axidraw/plot_interactive/PlotInteractive";
import MachineState from "../actionsets/axidraw/machine_state/MachineState";
import AxidrawInit from "../actionsets/axidraw/axidraw_init/AxidrawInit";
import Toggle from "../actionsets/inputs/toggle/Toggle";
import Slider from "../actionsets/inputs/slider/Slider";
import Gate from "../actionsets/control_flow/gate/Gate";
import DrawPath from "../actionsets/paths/drawPath/DrawPath";
import LSystem from "../actionsets/recursion/lSystem/LSystem";
import Num from "../actionsets/inputs/num/Num";

export default {
  Gate: Gate,
  Num: Num,
  DrawPath: DrawPath,
  AudioFeed: AudioFeed,
  LSystem: LSystem,
  ImageTrace: ImageTrace,
  ImageViewer: ImageViewer,
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
  PlotInteractive: PlotInteractive,
  MachineState: MachineState,
  AxidrawInit: AxidrawInit,
  Toggle: Toggle,
  Slider: Slider,
};
