import create from "./create";
import getAll from "./getAll";
import remove from "./remove";
import removeAll from "./removeAll";

const backupStore = {
  create,
  remove,
  getAll,
  removeAll
}

export default backupStore