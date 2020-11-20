import Alert from "./actions/Alert";
import Constant from "./actions/Constant";
import LinearArray from "./actions/LinearArray";
import JubileeDeck from "./actions/JubileeDeck";
import Wellplate from "./actions/wellplate/Wellplate";
import TextStep from "./actions/textstep/TextStep";
import FirstStep from "./actions/firststep/FirstStep";
import Merge from "./actions/merge/Merge";
import Conditional from "./actions/conditional/Conditional";

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
