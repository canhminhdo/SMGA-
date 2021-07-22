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
                        x: 500,
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
                        x: 800,
                        y: 50,
                        border: "black",
                        background: "green",
                        color: "white",
                        vborder: "black"
                    }
                }
            ],
            messages: [
                {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "M1", type: "m1"},
                {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "M2", type: "m2"},
                {sender: "intrdr", receiver: "q", seemSender: "p", ciphertext: "M3", type: "m3"},
                {sender: "q", receiver: "intrdr", seemSender: "p", ciphertext: "M4", type: "m4"},
                {sender: "q", receiver: "p", seemSender: "p", ciphertext: "M4", type: "m4"},
                {sender: "intrdr", receiver: "p", seemSender: "p", ciphertext: "M4", type: "m4"},
            ],
            network: [
                {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "M1", type: "m1"},
                {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "M2", type: "m2"},
                {sender: "intrdr", receiver: "q", seemSender: "p", ciphertext: "M3", type: "m3"},
                {sender: "q", receiver: "intrdr", seemSender: "p", ciphertext: "M4", type: "m4"},
                {sender: "q", receiver: "p", seemSender: "p", ciphertext: "M4", type: "m4"},
                {sender: "intrdr", receiver: "p", seemSender: "p", ciphertext: "M4", type: "m4"},
                {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "M1", type: "m1"},
                {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "M2", type: "m2"},
                {sender: "intrdr", receiver: "q", seemSender: "p", ciphertext: "M3", type: "m3"},
                {sender: "q", receiver: "intrdr", seemSender: "p", ciphertext: "M4", type: "m4"},
                {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "M1", type: "m1"},
                {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "M2", type: "m2"},
                {sender: "intrdr", receiver: "q", seemSender: "p", ciphertext: "M3", type: "m3"},
                {sender: "q", receiver: "intrdr", seemSender: "p", ciphertext: "M4", type: "m4"},
                {sender: "q", receiver: "p", seemSender: "p", ciphertext: "M4", type: "m4"},
                {sender: "intrdr", receiver: "p", seemSender: "p", ciphertext: "M4", type: "m4"},
                {sender: "p", receiver: "q", seemSender: "intrdr", ciphertext: "M1", type: "m1"},
                {sender: "p", receiver: "intrdr", seemSender: "intrdr", ciphertext: "M2", type: "m2"},
                {sender: "intrdr", receiver: "q", seemSender: "p", ciphertext: "M3", type: "m3"},
                {sender: "q", receiver: "intrdr", seemSender: "p", ciphertext: "M4", type: "m4"},
            ]
        }
    };
}