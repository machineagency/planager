import Alert from "./alert/Alert";
import Constant from "./constant/Constant";
import JubileeDeck from "./jubileedeck/JubileeDeck";
import Wellplate from "./wellplate/Wellplate";
import ProtocolViewer from "./protocolViewer/ProtocolViewer";
import DownloadJSON from "./downloadJSON/DownloadJSON";
import Button from "./button/Button";
import Counter from "./counter/Counter";
// import InputJSON from "./inputJSON/InputJSON";
import SonicationPlan from "./sonicationPlan/SonicationPlan";
import AssignPlan from "./assignPlan/AssignPlan";

// In order for an action to show up on the main page, it must be imported
// and exported here. This is much easier to manage than trying to import
// them all in Main. We could also define subcategories here for
// better organization of actions.
export {
  Alert,
  Constant,
  JubileeDeck,
  Wellplate,
  ProtocolViewer,
  DownloadJSON,
  Button,
  Counter,
  // InputJSON,
  SonicationPlan,
  AssignPlan,
};
