import Alert from "./alert/Alert";
import Constant from "./constant/Constant";
import LinearArray from "./lineararray/LinearArray";
import JubileeDeck from "./jubileedeck/JubileeDeck";
import Wellplate from "./wellplate/Wellplate";
import TextStep from "./textstep/TextStep";
import FirstStep from "./firststep/FirstStep";
import Merge from "./merge/Merge";
import Conditional from "./conditional/Conditional";

// In order for an action to show up on the main page, it must be imported
// and exported here. This is much easier to manage than trying to import
// them all in Main. We could also define subcategories here for
// better organization of actions.
export {
  Alert,
  Constant,
  LinearArray,
  JubileeDeck,
  Wellplate,
  TextStep,
  FirstStep,
  Merge,
  Conditional,
};
