/**
 * Creates a new session.
 *
 * @param payload - The payload data for creating the session.
 * @param sendResponse - A callback function to send the response.
 * @returns The result of the session creation.
 */
import actions from "~actions"

const createSession = async (payload: any, sendResponse: (response: any) => void) => {
  const result = await actions.session.create(payload)
  sendResponse(result)
}

export default createSession