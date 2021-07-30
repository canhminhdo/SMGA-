export function getInitial() {
   return {
       "drawInfo": {
           "scale": {
               "x": 1,
               "y": 1
           },
           "origin": {
               "x": 0,
               "y": 0
           }
       },
       "protocol": {
           interval: null,
           isPlaying: false,
           speed: 500,
           current: 6,
           prins: [
               {
                   name: "P",
                   id: "p",
                   drawInfo: {
                       x: 200,
                       y: 50,
                       border: "black",
                       background: "green",
                       color: "white",
                       vborder: "black"
                   }
               },
               {
                   name: "Intrdr",
                   id: "intrdr",
                   drawInfo: {
                       x: 600,
                       y: 50,
                       border: "red",
                       background: "red",
                       color: "white",
                       vborder: "red"
                   }
               },
               {
                   name: "Q",
                   id: "q",
                   drawInfo: {
                       x: 1000,
                       y: 50,
                       border: "black",
                       background: "green",
                       color: "white",
                       vborder: "black"
                   }
               }
           ],
           network: [
               {
                   "sendMsg":[
                      {
                         "sender":"p",
                         "receiver":"intrdr",
                         "seemSender":"p",
                         "ciphertext":"enc1(intrdr, n(p, intrdr, r1), p)",
                         "type":"m1",
                         "isFake":false
                      }
                   ],
                   "revMsg":[

                   ]
                },
                {
                   "sendMsg":[
                      {
                         "sender":"intrdr",
                         "receiver":"q",
                         "seemSender":"p",
                         "ciphertext":"enc1(q, n(p, intrdr, r1), p)",
                         "type":"m1",
                         "isFake":true
                      }
                   ],
                   "revMsg":[

                   ]
                },
                {
                   "sendMsg":[
                      {
                         "sender":"q",
                         "receiver":"p",
                         "seemSender":"q",
                         "ciphertext":"enc2(p, n(p, intrdr, r1), n(q, p, r2))",
                         "type":"m2",
                         "isFake":false
                      }
                   ],
                   "revMsg":[
                      {
                         "sender":"intrdr",
                         "receiver":"q",
                         "seemSender":"p",
                         "ciphertext":"enc1(q, n(p, intrdr, r1), p)",
                         "type":"m1",
                         "isFake":true
                      }
                   ]
                },
                {
                   "sendMsg":[
                      {
                         "sender":"intrdr",
                         "receiver":"p",
                         "seemSender":"intrdr",
                         "ciphertext":"enc2(p, n(p, intrdr, r1), n(q, p, r2))",
                         "type":"m2",
                         "isFake":false
                      }
                   ],
                   "revMsg":[

                   ]
                },
                {
                   "sendMsg":[
                      {
                         "sender":"p",
                         "receiver":"intrdr",
                         "seemSender":"p",
                         "ciphertext":"enc3(intrdr, n(q, p, r2))",
                         "type":"m3",
                         "isFake":false
                      }
                   ],
                   "revMsg":[
                      {
                         "sender":"intrdr",
                         "receiver":"p",
                         "seemSender":"intrdr",
                         "ciphertext":"enc2(p, n(p, intrdr, r1), n(q, p, r2))",
                         "type":"m2",
                         "isFake":false
                      }
                   ]
                },
                {
                   "sendMsg":[
                      {
                         "sender":"intrdr",
                         "receiver":"q",
                         "seemSender":"p",
                         "ciphertext":"enc3(q, n(q, p, r2))",
                         "type":"m3",
                         "isFake":true
                      }
                   ],
                   "revMsg":[

                   ]
                }
           ]
       }
   };
}