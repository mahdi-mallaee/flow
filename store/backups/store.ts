import create from "./create";
import getAll from "./getAll";
import remove from "./remove";
import removeAll from "./removeAll";

const backupStore = {
  create: create,
  remove: remove,
  getAll: getAll,
  removeAll: removeAll
}

export default backupStore