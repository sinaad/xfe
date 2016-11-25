importScripts('src/sw-util.js')
console.log('update2')

let CACHE_VERSION = '1.0'
let cacheList = [
  'serviceworker.html',
  'src/logo.png',
  'other.html',
  'src/images/1.jpeg',
  'src/images/2.jpeg',
  'src/images/3.jpeg',
  'src/images/4.jpeg'
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
          return caches.delete(key)
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
        // return response || fetch(e.request)
        // Cache-First
        // Cache hit - return response
        if (response) {
          return response;
        }

        //否则需要请求
        let fetchRequect = e.request.clone()
        return fetch(fetchRequect)
          .then((response) => {
            let cacheResponse = response.clone()
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(e.request, cacheResponse)
              })
            return response
          })
      })
  )
})
self.addEventListener('message', ({data, source}) => {
  console.log('SW message')
  this.clients.matchAll()
    .then((clientList) => {
      clientList.forEach(function(client) {
        client.postMessage({
          type: 'message',
          client: source.id,
          message: `收到client(${source.id})的消息(${data}), 回复：我还活着`
        })
      })
    })
})
self.addEventListener('push', (e) => {
  console.log('SW get push', e)
  // @get e.data.json()
  // @
  let info = {
    type: 'push',
    body: e.data.text(),
    icon: 'src/icons/128_128.png',
    tag: 'tag'
  }

  // 弹出通知
  e.waitUntil(
    this.registration.showNotification('通知', info)
  )
  // 把消息发送给页面
  this.clients.matchAll()
    .then((clientList) => {
      clientList.forEach(function(client) {
        client.postMessage(info)
      })
    })
})

self.addEventListener('notificationclick', (e) => {
  console.log('[Service Worker] Notification click Received.')
  e.notification.close()
  e.waitUntil(
    clients.openWindow('http://sina.com.cn')
  )
})

// 接受background sync处理状态
self.addEventListener('sync', (e) => {
  console.log('SW sync')
  if (e.tag == 'mySync') {
    e.waitUntil(
      this.registration.showNotification('同步通知', {
        icon: 'src/icons/128_128.png',
        body: '刚离线的时候，逗逼戳了你一下~'
      })
    )
  }
})
