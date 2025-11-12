export default defineEventHandler(async (event) => {
  const userSession = await auth.api.getSession({
    headers: event.headers
  })

  event.context.auth = userSession?.user
})
