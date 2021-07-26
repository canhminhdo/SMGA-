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
            current: 1,
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
            messages: [
                {
                    revMsg : [
                        {sender: "p", receiver: "p", seemSender: "intrdr", ciphertext: "from P", type: "m1", isFake: false},
                        {sender: "q", receiver: "q", seemSender: "intrdr", ciphertext: "from Q", type: "m2", isFake: false},
                        {sender: "intrdr", receiver: "intrdr", seemSender: "intrdr", ciphertext: "from Intrdr", type: "m3", isFake: false},
                        {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "from P", type: "m1", isFake: false},
                        {sender: "intrdr", receiver: "q", seemSender: "intrdr", ciphertext: "from Intrdr", type: "m2", isFake: false},
                        {sender: "q", receiver: "p", seemSender: "intrdr", ciphertext: "from Q", type: "m3", isFake: false},
                        {sender: "intrdr", receiver: "p", seemSender: "intrdr", ciphertext: "from Intrdr", type: "m1", isFake: false},
                        {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "from P", type: "m2", isFake: false},
                        {sender: "q", receiver: "intrdr", seemSender: "intrdr", ciphertext: "from Q", type: "m3", isFake: false},
                    ],
                    sendMsg: [
                        {sender: "p", receiver: "p", seemSender: "intrdr", ciphertext: "to P", type: "m1", isFake: false},
                        {sender: "q", receiver: "q", seemSender: "intrdr", ciphertext: "to Q", type: "m2", isFake: false},
                        {sender: "intrdr", receiver: "intrdr", seemSender: "intrdr", ciphertext: "to Intrdr", type: "m3", isFake: false},
                        {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "to Intrdr", type: "m1", isFake: false},
                        {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "to Q", type: "m2", isFake: false},
                        {sender: "q", receiver: "intrdr", seemSender: "intrdr", ciphertext: "to Intrdr", type: "m3", isFake: false},
                        {sender: "q", receiver: "p", seemSender: "intrdr", ciphertext: "to P", type: "m1", isFake: false},
                        {sender: "intrdr", receiver: "p", seemSender: "intrdr", ciphertext: "to P", type: "m2", isFake: false},
                        {sender: "intrdr", receiver: "q", seemSender: "intrdr", ciphertext: "to Q", type: "m3"}
                    ]
                }
            ],
            network: [
                {
                    revMsg : [
                        {sender: "p", receiver: "p", seemSender: "intrdr", ciphertext: "from P", type: "m1", isFake: false},
                        {sender: "q", receiver: "q", seemSender: "intrdr", ciphertext: "from Q", type: "m2", isFake: false},
                        {sender: "intrdr", receiver: "intrdr", seemSender: "intrdr", ciphertext: "from Intrdr", type: "m3", isFake: false},
                        {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "from P", type: "m1", isFake: false},
                        {sender: "intrdr", receiver: "q", seemSender: "intrdr", ciphertext: "from Intrdr", type: "m2", isFake: false},
                        {sender: "q", receiver: "p", seemSender: "intrdr", ciphertext: "from Q", type: "m3", isFake: false},
                        {sender: "intrdr", receiver: "p", seemSender: "intrdr", ciphertext: "from Intrdr", type: "m1", isFake: false},
                        {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "from P", type: "m2", isFake: false},
                        {sender: "q", receiver: "intrdr", seemSender: "intrdr", ciphertext: "from Q", type: "m3", isFake: false},
                    ],
                    sendMsg: [
                        {sender: "p", receiver: "p", seemSender: "intrdr", ciphertext: "to P", type: "m1", isFake: false},
                        {sender: "q", receiver: "q", seemSender: "intrdr", ciphertext: "to Q", type: "m2", isFake: false},
                        {sender: "intrdr", receiver: "intrdr", seemSender: "intrdr", ciphertext: "to Intrdr", type: "m3", isFake: false},
                        {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "to Intrdr", type: "m1", isFake: false},
                        {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "to Q", type: "m2", isFake: false},
                        {sender: "q", receiver: "intrdr", seemSender: "intrdr", ciphertext: "to Intrdr", type: "m3", isFake: false},
                        {sender: "q", receiver: "p", seemSender: "intrdr", ciphertext: "to P", type: "m1", isFake: false},
                        {sender: "intrdr", receiver: "p", seemSender: "intrdr", ciphertext: "to P", type: "m2", isFake: false},
                        {sender: "intrdr", receiver: "q", seemSender: "intrdr", ciphertext: "to Q", type: "m3"}
                    ]
                },
                {
                    revMsg : [
                        {sender: "p", receiver: "p", seemSender: "intrdr", ciphertext: "from P", type: "m1", isFake: false},
                        {sender: "q", receiver: "q", seemSender: "intrdr", ciphertext: "from Q", type: "m2", isFake: false},
                        {sender: "intrdr", receiver: "intrdr", seemSender: "intrdr", ciphertext: "from Intrdr", type: "m3", isFake: false},
                        {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "from P", type: "m1", isFake: false},
                        {sender: "intrdr", receiver: "q", seemSender: "intrdr", ciphertext: "from Intrdr", type: "m2", isFake: false},
                        {sender: "q", receiver: "p", seemSender: "intrdr", ciphertext: "from Q", type: "m3", isFake: false},
                        {sender: "intrdr", receiver: "p", seemSender: "intrdr", ciphertext: "from Intrdr", type: "m1", isFake: false},
                        {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "from P", type: "m2", isFake: false},
                        {sender: "q", receiver: "intrdr", seemSender: "intrdr", ciphertext: "from Q", type: "m3", isFake: false},
                    ],
                    sendMsg: [
                        {sender: "p", receiver: "p", seemSender: "intrdr", ciphertext: "to P", type: "m1", isFake: false},
                        {sender: "q", receiver: "q", seemSender: "intrdr", ciphertext: "to Q", type: "m2", isFake: false},
                        {sender: "intrdr", receiver: "intrdr", seemSender: "intrdr", ciphertext: "to Intrdr", type: "m3", isFake: false},
                        {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "to Intrdr", type: "m1", isFake: false},
                        {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "to Q", type: "m2", isFake: false},
                        {sender: "q", receiver: "intrdr", seemSender: "intrdr", ciphertext: "to Intrdr", type: "m3", isFake: false},
                        {sender: "q", receiver: "p", seemSender: "intrdr", ciphertext: "to P", type: "m1", isFake: false},
                        {sender: "intrdr", receiver: "p", seemSender: "intrdr", ciphertext: "to P", type: "m2", isFake: false},
                        {sender: "intrdr", receiver: "q", seemSender: "intrdr", ciphertext: "to Q", type: "m3", isFake: false}
                    ]
                },
            ]
        }
    };
}