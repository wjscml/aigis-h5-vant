// import wx from '~@/assets/js/jweixin-1.4.0.js'
import { getSign } from '@/api'

export function wxInit (val) {
  let links = `${window.location.href}`
  let title = val.title
  let desc = val.summary
  let imgUrl = val.thumb
  window.wx.ready(function () { // 需在用户可能点击分享按钮前就先调用
    window.wx.updateAppMessageShareData({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 设置成功
      }
    })
    window.wx.updateTimelineShareData({
      title: title, // 分享标题
      link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 设置成功
      }
    })
  })

  window.wx.error(function (res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
  })
}

export function share (val) {
  let url = encodeURIComponent(`${window.location.href}`)
  getSign({ shareUrl: url }).then(res => {
    window.wx.config({
      debug: false,
      appId: 'wxae31656b5e43200b',
      timestamp: res.signPackage.timestamp,
      nonceStr: res.signPackage.nonceStr,
      signature: res.signPackage.signature,
      jsApiList: [
        'updateAppMessageShareData', 'updateTimelineShareData'
      ]
    })
    wxInit(val)
  })
}
