import create from "./create";
import load from "./load";
import remove from "./remove";

const backupStore = {
  create: create,
  remove: remove,
  load: load
}

export default backupStore