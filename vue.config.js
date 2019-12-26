module.exports = {
  devServer: {
    proxy: {
      '/apis': {
        target: 'https://aigis.leadfintech.com',
        ws: true,
        changeOrigin: true
      },
      '^~ /websocket': {
        target: 'https://aigis.leadfintech.com/wss',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
