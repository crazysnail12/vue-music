import {commonParams, options} from './config'
import jsonp from 'common/js/jsonp'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })

  return jsonp(url, data, options)
}

export function getTopMusic(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    fromat: 'jsonp'
  })

  return jsonp(url, data, options)
}