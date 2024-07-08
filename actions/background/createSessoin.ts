import actions from "~actions"

const createSession = async (payload: any, sendResponse: (response: any) => void) => {
  const result = await actions.session.create(payload)
  sendResponse(result)
}

export default createSession