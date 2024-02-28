module.exports = {
  method: '*',
  path: '/',
  handler: async (request, h) => {
    return 'Hello World!'
  }
}
