import {getVkey, getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
export default class Song {
  constructor({id, mid, singer, name, album, druration, image}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.druration = druration
    this.image = image
  }
  getMusicUrl() {
    if (this.url) {
      return Promise.resolve(this.url)
    }
    return new Promise((resolve, reject) => {
      getVkey(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          let {items: [{filename, vkey}]} = res.data
          let url = `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&guid=4288820000&uin=0&fromtag=66`
          this.url = url
          resolve(url)
        }
      }).catch((e) => {
        reject(e)
      })
    })
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        }
      }).catch((e) => {
        reject(e)
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    druration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}