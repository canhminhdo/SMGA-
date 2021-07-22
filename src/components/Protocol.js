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

function messageTooltip(msg = {}, options = {}) {
    let tooltip = new Konva.Label({...options});

    tooltip.add(
        new Konva.Tag({
            fill: 'black',
            pointerDirection: 'down',
            pointerWidth: 10,
            pointerHeight: 10,
            lineJoin: 'round'
        })
    );

    tooltip.add(
        new Konva.Text({
            text: msg.ciphertext || "empty",
            fill: 'white',
            padding: 10,
            ...options
        })
    );
    return tooltip;
}

export function getMessageObject(msg = {}, options = {}) {
    const stage = window.stage;
    let drawInfo = window.drawInfo;
    const isR2L = drawInfo.prins.indexOf(msg.sender) < drawInfo.prins.indexOf(msg.receiver);
    const xStart = drawInfo[msg.sender].x;
    const yStart = drawInfo.yPos;
    let xEnd, yEnd;
    if (msg.sender != INTRDR_ID && msg.receiver != INTRDR_ID) {
        xEnd = drawInfo[INTRDR_ID].x - xStart;
        const padding = (drawInfo[msg.receiver].x - drawInfo[INTRDR_ID].x) / 2
        xEnd += padding;
    } else {
        xEnd = drawInfo[msg.receiver].x - xStart;
    }
    let group = new Konva.Group({x: xStart, y: yStart});
    let labelX = xEnd / 2 ;
    let msgLabel = messageTooltip(msg, {x: labelX, y: 0});
    const arrowMsg = new Konva.Arrow({
        x: 0,
        y: 0,
        points: [0, 0, xEnd, 0],
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
    window.drawInfo.prins.push(prinId);
    window.drawInfo[prinId] = {x: xStart, y: yStart};
    window.drawInfo.yPos = yStart + MESSGAGE_PADDING;
    return prin;
}