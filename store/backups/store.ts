import create from "./create";
import load from "./load";
import remove from "./remove";
import removeAll from "./removeAll";

const backupStore = {
  create: create,
  remove: remove,
  load: load,
  removeAll: removeAll
}

export default backupStore