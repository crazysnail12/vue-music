import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({commit, state}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenctList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入歌曲到当前索引位置
  playlist.splice(currentIndex, 0, song)
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      // 插入歌曲的序号大于列表中同首歌曲的的序号
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 插入歌曲的序号小于列表中同首歌曲的的序号
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenctList, currentSong)

  let fsIndex = findIndex(sequenctList, song)
  currentSIndex++
  sequenctList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenctList.splice(fsIndex, 1)
    } else {
      sequenctList(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenctList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export function deleteSong({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  let playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export function deleteSongList({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export function savePlayHistory({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export function saveFavoriteList({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export function deleteFavoriteList({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}