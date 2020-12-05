import Alert from "./alert/Alert";
import Constant from "./constant/Constant";
import JubileeDeck from "./jubileedeck/JubileeDeck";
import Wellplate from "./wellplate/Wellplate";
import BuildSonicationProtocol from "./buildSonicationProtocol/BuildSonicationProtocol";
import TextStep from "./textstep/TextStep";
import ProtocolViewer from "./protocolViewer/ProtocolViewer";
import DownloadFile from "./downloadFile/DownloadFile";
// import FirstStep from "./firststep/FirstStep";
// import Zip from "./zip/Zip";
// import Conditional from "./conditional/Conditional";

// In order for an action to show up on the main page, it must be imported
// and exported here. This is much easier to manage than trying to import
// them all in Main. We could also define subcategories here for
// better organization of actions.
export {
  Alert,
  Constant,
  JubileeDeck,
  Wellplate,
  // TextStep,
  BuildSonicationProtocol,
  ProtocolViewer,
  DownloadFile,
  // FirstStep,
  // Zip,
  // Conditional,
};
