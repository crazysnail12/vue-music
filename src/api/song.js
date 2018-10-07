import axios from 'axios'
import {commonParams} from 'api/config'

export function getVkey(mid) {
  const url = '/api/getVkey'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: mid,
    filename: `C400${mid}.m4a`,
    guid: 4288820000
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getLyric(mid) {
  const url = '/api/getLyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    needNewCode: 0,
    g_tk: 5381,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}