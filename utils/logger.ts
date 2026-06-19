const isDev = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: any[]): void => {
    if (isDev) {
      console.log(...args)
    }
  },
  warn: (...args: any[]): void => {
    if (isDev) {
      console.warn(...args)
    }
  },
  error: (...args: any[]): void => {
    if (isDev) {
      console.error(...args)
    }
  }
}

export default logger
