import {commonParams, options} from './config'
import jsonp from 'common/js/jsonp'
import axios from 'axios'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })

  return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
  const url = '/api/search'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    _: +new Date(),
    platform: 'h5',
    needNewCode: 1,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}