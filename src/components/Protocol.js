import Konva from 'konva'
import _, { startCase } from 'lodash'

export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_FONT_FAMILY = "Arial";

const STROKE_WIDTH_DEFAULT = "1";
const VLINE_COLOR_DEFAULT = "#ccc";
const VLINE_STROKE_WIDTH_DEFAULT = "2";

const MESSGAGE_PADDING = 70;
const MESSAGE_STROKE_COLOR_DEFAULT = "black";
const MESSAGE_STROKE_WIDTH_DEFAULT = 2;
const INTRDR_ID = "intrdr";

// messages colors
const MESSAGE_COLORS = {
    "default": { backgroundColor: "black", color: "white" },
    "m1": {
        // "send": { backgroundColor: "red", color: "white" },
        // "rev": { backgroundColor: "red", color: "white" },
    },
    "m2": {
        // "send": { backgroundColor: "red", color: "white" },
        // "rev": { backgroundColor: "red", color: "white" },
    },
    "m3": {
        // "send": { backgroundColor: "red", color: "white" },
        // "rev": { backgroundColor: "red", color: "white" },
    }
};

function textTitle(text, options = {}) {
    const label = new Konva.Label({...options});
    label.add(new Konva.Tag({
      fill: options.background || '#ccc',
      stroke: options.border || '#333',
      strokeWidth: options.borderWidth || STROKE_WIDTH_DEFAULT,
      lineJoin: 'round'
    }));
    label.add(new Konva.Text({
      text: _.capitalize(text),
      padding: 20,
      fill: options.color || "black",
      fontStyle: 'bold',
      align: 'center',
      ...options
    }));
    return label;
}

function lifeTimeLine(options = {}) {
    const vline = new Konva.Line({
        stroke: VLINE_COLOR_DEFAULT,
        strokeWidth: VLINE_STROKE_WIDTH_DEFAULT,
        ...options
    });
    return vline;
}

function getMsgColor(msg = {}, isRev = false) {
    if (isRev) {
        if (msg.type != undefined) {
            if (MESSAGE_COLORS[msg.type].rev != undefined) {
                return MESSAGE_COLORS[msg.type].send;
            }
        }
    } else {
        if (msg.type != undefined) {
            if (MESSAGE_COLORS[msg.type].send != undefined) {
                return MESSAGE_COLORS[msg.type].send;
            }
        }
    }
    return MESSAGE_COLORS.default;
}

function messageTooltip(msg = {}, options = {}, isRev = false) {
    let tooltip = new Konva.Label({...options});
    let {backgroundColor, color} = getMsgColor(msg, isRev);
    tooltip.add(
        new Konva.Tag({
            fill: backgroundColor || MESSAGE_COLORS.default.backgroundColor,
            pointerDirection: 'down',
            pointerWidth: 10,
            pointerHeight: 10,
            lineJoin: 'round'
        })
    );

    tooltip.add(
        new Konva.Text({
            text: msg.ciphertext || "empty",
            fill: color || MESSAGE_COLORS.default.color,
            padding: 10,
            ...options
        })
    );
    return tooltip;
}

function getRevPos(msg, drawInfo) {
    let xStart = drawInfo[msg.sender].x;
    let yStart = drawInfo.yPos;
    let xEnd = drawInfo[msg.receiver].x;
    let yEnd = 0;
    const isL2R = drawInfo.prins.indexOf(msg.sender) < drawInfo.prins.indexOf(msg.receiver);
    if (msg.sender == msg.receiver) {
        xEnd = 0;
    } else {
        if (isL2R) {
            if (msg.receiver == INTRDR_ID) {
                const length = (drawInfo[msg.receiver].x - drawInfo[msg.sender].x) / 2;
                xStart = drawInfo[msg.sender].x + length;
                xEnd = length;
            } else {
                const length = (drawInfo[msg.receiver].x - drawInfo[INTRDR_ID].x) / 2;
                xStart = drawInfo[msg.receiver].x - length;
                xEnd = length;
            }
        } else {
            if (msg.receiver == INTRDR_ID) {
                const length = (drawInfo[msg.sender].x - drawInfo[msg.receiver].x) / 2;
                xStart = drawInfo[msg.receiver].x + length;
                xEnd = -length;
            } else {
                const length = (drawInfo[INTRDR_ID].x - drawInfo[msg.receiver].x) / 2;
                xStart = drawInfo[msg.receiver].x + length;
                xEnd = -length;
            }
        }
    }
    return [xStart, yStart, xEnd, yEnd];
}

function getSendPos(msg, drawInfo) {
    let xStart = drawInfo[msg.sender].x;
    let yStart = drawInfo.yPos;
    let xEnd = drawInfo[msg.receiver].x;
    let yEnd = 0;
    if (msg.sender == msg.receiver) {
        xEnd = 0;
    } else {
        if (msg.sender != INTRDR_ID && msg.receiver != INTRDR_ID) {
            xEnd = drawInfo[INTRDR_ID].x - xStart;
            const padding = (drawInfo[msg.receiver].x - drawInfo[INTRDR_ID].x) / 2
            xEnd += padding;
        } else {
            xEnd = (drawInfo[msg.receiver].x - xStart) / 2;
        }
    }
    return [xStart, yStart, xEnd, yEnd];
}

export function getMessageObject(msg = {}, options = {}, isRev = false) {
    let drawInfo = window.drawInfo;
    let xStart, yStart, xEnd, yEnd;
    if (isRev) {
        [xStart, yStart, xEnd, yEnd] = getRevPos(msg, drawInfo);
    } else {
        [xStart, yStart, xEnd, yEnd] = getSendPos(msg, drawInfo);
    }
    let group = new Konva.Group({x: xStart, y: yStart});
    let labelX = xEnd / 2 ;
    let msgLabel = messageTooltip(msg, {x: labelX, y: 0, ...options}, isRev);
    const arrowMsg = new Konva.Arrow({
        x: 0,
        y: 0,
        points: [0, 0, xEnd, yEnd],
        lineCap: "round",
        pointerLength: 5,
        pointerWidth: 5,
        stroke: MESSAGE_STROKE_COLOR_DEFAULT,
        strokeWidth: MESSAGE_STROKE_WIDTH_DEFAULT,
    });
    window.drawInfo.yPos += MESSGAGE_PADDING;
    group.add(msgLabel);
    group.add(arrowMsg);
    return group;
}

export function getPrinObject(prinModel, drawInfo = {}) {
    const {name: prinName, id: prinId, drawInfo: prinInfo} = prinModel;
    const prin = new Konva.Group({
        id: prinId
    });
    drawInfo = {...prinInfo, ...drawInfo};
    const nameText = textTitle(prinName, drawInfo);
    const {x, y} = nameText.getPosition();
    const w = nameText.getWidth();
    const h = nameText.getHeight();
    const xStart = parseFloat(x + w / 2);
    const xEnd = xStart;
    const yStart = parseFloat(y + h);
    const yEnd = parseFloat(window.stage.getHeight());
    const points = [xStart, yStart, xEnd, yEnd];
    const vline = lifeTimeLine({
        points: points,
        stroke: prinInfo.vborder || VLINE_COLOR_DEFAULT
    });
    prin.add(nameText);
    prin.add(vline);
    window.drawInfo = window.drawInfo || {prins: []};
    if (window.drawInfo.prins.indexOf(prinId) == -1) {
        window.drawInfo.prins.push(prinId);
        window.drawInfo[prinId] = {x: xStart, y: yStart};
    }
    window.drawInfo.yPos = yStart + MESSGAGE_PADDING;
    return prin;
}