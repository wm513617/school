let storage = window.localStorage
export function getYourIP() {
  storage.removeItem('IpInfo')
  let obj = {
    IP: '',
    errMessage: ''
  }
  let RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
  if (RTCPeerConnection) {
    (function() {
      let rtc = new RTCPeerConnection({iceServers: []})
      if (1 || window.mozRTCPeerConnection) {
        rtc.createDataChannel('', {reliable: false})
      };

      rtc.onicecandidate = function(evt) {
        if (evt.candidate) { grepSDP('a=' + evt.candidate.candidate) }
      }
      rtc.createOffer(function(offerDesc) {
        grepSDP(offerDesc.sdp)
        rtc.setLocalDescription(offerDesc)
      }, function(e) { console.warn('offer failed', e) })

      let addrs = Object.create(null)
      addrs['0.0.0.0'] = false
      function updateDisplay(newAddr) {
        if (newAddr in addrs) { return } else { addrs[newAddr] = true }
        var displayAddrs = Object.keys(addrs).filter(function(k) { return addrs[k] })
        for (let i = 0; i < displayAddrs.length; i++) {
          if (displayAddrs[i].length > 16) {
            displayAddrs.splice(i, 1)
            i--
          }
        }
        // document.getElementById('list').textContent = displayAddrs[0];
        // IP = displayAddrs[0]
        obj.IP = displayAddrs[0]
        storage.setItem('IpInfo', JSON.stringify(obj))
      }

      function grepSDP(sdp) {
        sdp.split('\r\n').forEach(function(line, index, arr) {
          if (~line.indexOf('a=candidate')) {
            let parts = line.split(' ')
            let addr = parts[4]
            let type = parts[7]
            if (type === 'host') { updateDisplay(addr) }
          } else if (~line.indexOf('c=')) {
            let parts = line.split(' ')
            let addr = parts[2]
            updateDisplay(addr)
          }
        })
      }
    })()
  } else {
    // document.getElementById('list').textContent = "请使用主流浏览器：chrome,firefox,opera,safari";
    // browerMessage = '请使用主流浏览器：chrome,firefox,opera,safari'
    obj.errMessage = '请使用主流浏览器：chrome,firefox,opera,safari'
    storage.setItem('IpInfo', JSON.stringify(obj))
  }
}
