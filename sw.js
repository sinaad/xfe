importScripts('src/sw-util.js')

let CACHE_VERSION = '2.0'
let cacheList = [
  'serviceworker.html',
  'src/logo.png'
]
let CACHE_NAME = 'acelan-v' + CACHE_VERSION

self.addEventListener('install', (e) => {
  console.log('SW install')
  // waitUntil接受一个Promise, 当promise resolve的时候继续
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log(`Opened cache ${CACHE_NAME}`)
        return cache.addAll(cacheList)
      })
  )
})
// 1、首次安装成功后进入active状态
// 2、或者页面刷新后发现sw变化后会更新sw.js, 然后进入wait状态
// 等浏览器关闭下一次进入后active新的sw.js
self.addEventListener('activate', (e) => {
  console.log('SW active')
  // activate周期用来更新缓存
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`删除过期的cache: ${key}`)
            return caches.delete(key)
          }
        })
      )
    })
  )
})


// ================
self.addEventListener('fetch', (e) => {
  console.log('SW fetch', e.request.url)
  e.respondWith(
    caches.match(e.request)
      .then((response) => {
        // cache-first
        return response || fetch(e.request)
      }
    )
  )
})
self.addEventListener('message', ({data, source}) => {
  console.log('SW message')
  this.clients.matchAll()
    .then((clientList) => {
      clientList.forEach(function(client) {
        client.postMessage({
          client: source.id,
          message: `很高兴收到你(${source.id})的消息(${data}), 我还活着`
        })
      })
    })
})

// ================
self.addEventListener('update', (e) => {
  console.log('SW update')
})
self.addEventListener('sync', (e) => {
  console.log('SW sync')
})
