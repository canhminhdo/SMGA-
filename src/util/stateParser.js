import _ from 'lodash'

// Stack class
class Stack {

    // Array is used to implement stack
    constructor()
    {
        this.items = [];
        this.size = 0;
    }

    // Functions to be implemented
    // push function
    get getSize(){
        return this.items.length;
    }
    push(element)
    {
        // push element into the items
        this.items.push(element);
        this.size++;
    }
    // pop function
    pop()
    {
        // return top most element in the stack
        // and removes it from the stack
        // Underflow if stack is empty

        if (this.items.length == 0)
            return "Underflow";
        this.size--;
        return this.items.pop();
    }
    // peek function
    peek()
    {
        // return the top most element from the stack
        // but does'nt delete it.
        return this.items[this.items.length - 1];
    }
    // isEmpty function
    isEmpty()
    {
        // return true if stack is empty
        return this.items.length == 0;
    }
    // printStack function
    printStack()
    {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }
}

class Message {
    constructor(data) {
        this._value = data;
        this._para = [];
        this.isMessage = false;
    }
}

export function fileContent2message(fileContent){
    let contents = fileContent;
    let allKeys = contents.split('###textDisplay')[0].split('###keys')[1].trim().split(' ');
    contents = contents.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ");
    contents = contents.replace(/\s+/g, " ").replace(/\s+/g, " ");
    var states = contents.split('###states')[1].trim();
    let lines = states.trim().split('||');
    var dataset = loadDataSet(lines, allKeys);
    let result = {
        prins: [
            {name: "p", id: "p"},
            {name: "intrdr", id: "intrdr"},
            {name: "q", id: "q"}
        ],
        network: [],
        messages: []
        // {sender: "p", receiver: "q", seemSender: "intrd", ciphertext: "m1(abc)", type: "m1"}
    };
    let prins = dataset[0]['prins'].split('(')[1].split(')')[0].split(' ');
    result.prins[0].name = prins[0];
    result.prins[1].name = prins[2];
    result.prins[2].name = prins[1];
    let formatOneMessage = function(){
        let temp = {
            sendMsg: [],
            revMsg: []
        }
        return temp;
    };

    let tempResult = function(){
        let temp = {
            sender: "",
            receiver: "",
            seemSender: "",
            ciphertext: "",
            type: "",
            isFake: Boolean
        }
        return temp;
    }

    for (let i = 0; i < dataset.length; i++){
        // get newmsg
        let messContent = dataset[i]['newmsg'];
        let parseResult = Parser(messContent);
        let rs = tempResult();
        rs.type = messContent[0] + messContent[1];
        rs.seemSender = getElementParserByIndexArray(parseResult, [1]);
        rs.sender = getElementParserByIndexArray(parseResult, [0]);
        rs.receiver = getElementParserByIndexArray(parseResult, [2]);
        rs.ciphertext = getElementParserByIndexArray(parseResult, [3]);
        rs.isFake = dataset[i]['isFake'].trim() == "true";
        let cloneFormatOneMessage = formatOneMessage();

        cloneFormatOneMessage.sendMsg.push(rs);
        // get recmsg1
        messContent = dataset[i]['recmsg1'];
        parseResult = Parser(messContent);
        let rs1 = tempResult();
        if (parseResult.isMessage !== false){
            rs1.type = messContent[0] + messContent[1];
            rs1.seemSender = getElementParserByIndexArray(parseResult, [1]);
            rs1.sender = getElementParserByIndexArray(parseResult, [0]);
            rs1.receiver = getElementParserByIndexArray(parseResult, [2]);
            rs1.ciphertext = getElementParserByIndexArray(parseResult, [3]);
            rs1.isFake = dataset[i]['isFake'].trim() == "true";
            cloneFormatOneMessage.revMsg.push(rs1);
        }
        result.network.push(cloneFormatOneMessage);
    }
    return result;
}

function checkUndefined(variable) {
    if (variable === undefined || variable === null)
        return true;
    else
        return false;
}
function formatString(value) {

    if (value.endsWith(" (")) {
        value = value.substring(0, value.length - 2);
    }
    var equal = 0;
    if (value.endsWith(")")) {

        if (value.split("(").length == value.split(")").length) {
            equal = 1;
            // if (value.startsWith("(") && Object.keys(texDisplays).length == 0) {
            //     value = value.substring(1, value.length - 1);
            // }
        }
        else
            value = value.substring(0, value.length - 1);
    }
    return value;
}

function loadDataSet(lines, keys) {
    var numOfLines = lines.length;
    var dataset = [];
    var numOfKeys = keys.length;
    for (var i = 0; i < numOfLines; i++) {
        if ((i == numOfLines - 1) && lines[i].trim() == "nil") {
            // do nothing.
        }
        else {

            var trimedLine = lines[i].trim();

            var line = trimedLine.substring(1, trimedLine.length - 1) || ""; // each state include "()" except last state: (..) || (..) || ..

            // in case last line
            if ((i == numOfLines - 1) && checkUndefined(lines[i]) === false) {
                var str = trimedLine;
                if (str[0] != "(") line = trimedLine || "";
            }
            if (i == numOfLines - 1) line = trimedLine || "";
            var state = {};
            for (var j = 0; j < numOfKeys; j++) {
                //remove cac space thanh 1 space
                var tmp = (line.replace(/\s+/g, " ").split(keys[j] + ":"))[1];

                if (checkUndefined(tmp)) {
                    tmp = (line.replace(/\s+/g, " ").split(keys[j] + " :"))[1];
                }
                var value;
                if ((j + 1) == numOfKeys) { // last substate

                    value = tmp.trim();
                }
                else {
                    var arrValue = tmp.split(keys[(j + 1)] + ":");
                    if (arrValue && arrValue.length > 1) {
                        value = arrValue[0].trim();
                    }
                    else {
                        arrValue = tmp.split(keys[(j + 1)] + " :");
                        value = arrValue[0].trim();
                    }

                }
                value = formatString(value);
                state[keys[j]] = value;

            }
            dataset.push(state);
        }

    }

    return dataset;

}

function Parser(str){
    // return tree parsing
    var mess = new Message(str);
    let tmp = "";
    let n = str.length;
    let stack = new Stack();
    let nComma = 0;
    for (let i = 0; i < n; i++){
        if (str[i] === '('){
            if (nComma === 0 && mess.isMessage === false) {
                mess.isMessage = true;
                stack.push(str[i]);
                tmp = "";
                continue;
            }
            else{stack.push(str[i]);}
        }
        else if (str[i] === ')'){
            stack.pop();
            // case in the last message
            if (stack.isEmpty() && i === n - 1){
                if (tmp !== ""){
                    var tmpMess = new Message(tmp.trim());
                    tmp = "";
                    mess._para.push(tmpMess);
                    nComma++;
                    break;
                }
            }
            // case if mess is a fucntion
            else if (stack.size === 1 && mess.isMessage === true){
                if (tmp !== ""){
                    tmp = tmp + str[i];
                    var tmpMess = new Message(tmp.trim());
                    tmp = "";
                    mess._para.push(tmpMess);
                    nComma++;
                    continue;
                }
            }
        }
        else if (str[i] === ','){
            if (stack.isEmpty() || (stack.size === 1 && mess.isMessage === true)){
                if (tmp !== ""){
                    var tmpMess = new Message(tmp.trim());
                    tmp = "";
                    mess._para.push(tmpMess);
                    nComma++;
                    continue;
                }
                else{
                    if (tmp.length === 0) continue;
                }
            }
        }
        tmp = tmp + str[i];
        // case last parameters and no ')'
        if (i === n-1 && mess._para.length > 0 && mess.isMessage === false){
            if (tmp !== ""){
                var tmpMess = new Message(tmp.trim());
                tmp = "";
                mess._para.push(tmpMess);
                nComma++;
                break;
            }
        }
    }
    if (mess._para.length > 0) {
        for (let i = 0; i < mess._para.length; i++){
            mess._para[i] = Parser(mess._para[i]._value);
        }
    }
    return mess;

}

function getElementParserByIndexArray(mess, array2compare){
    let tmp = mess;
    for (let i = 0; i < array2compare.length; ++i){
        if (tmp._para[array2compare[i]] === undefined){
            return null;
        }
        tmp = tmp._para[array2compare[i]];
    }
    return tmp._value;
}