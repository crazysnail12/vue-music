<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMove"
          @beforeScroll="listScroll"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" ></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="很抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getIconCls(item) {
      if (item.t === TYPE_SINGER) {
        return 'icon-mine'
      }
      return 'icon-music'
    },
    getDisplayName(item) {
      if (item.t === TYPE_SINGER) {
        return item.singername
      }
      return `${item.name}-${item.singer}`
    },
    search() {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._getResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    searchMove() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._getResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    selectItem(item) {
      if (item.t === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    listScroll() {
      this.$emit('listScroll')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _getResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        let sIndex = this.result.findIndex((item) => {
          return item.singerid === data.zhida.singerid
        })
        if (sIndex === -1) {
          ret.push({...data.zhida, ...{t: TYPE_SINGER}})
        }
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style  lang='stylus' scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
