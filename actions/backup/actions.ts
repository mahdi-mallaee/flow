import create from "./create";
import download from "./download";
import load from "./load";
import runInterval from "./runInterval";
import upload from "./upload";

const backupActions = {
  create: create,
  download: download,
  upload: upload,
  runInterval: runInterval,
  load: load
}

export default backupActions