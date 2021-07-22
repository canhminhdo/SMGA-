import React from 'react'
import * as ProtocolModel from '../model/Protocol'
import * as ProtocolComponent from '../components/Protocol'
import _ from 'lodash'
import Konva from 'konva'
import update from 'react-addons-update'
import FileInput from 'react-file-input';
import { ContextMenu, MenuItem, ContextMenuLayer} from "react-contextmenu"
import Select from 'react-select';
import $ from 'jquery'
import commonFonts from '../data/commonFonts'
import { Button } from 'react-bootstrap'
import * as parser from '../util/stateParser'

import 'react-select/dist/react-select.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import '../style/context-menu.css'
import '../style/main.css'

export const ZOOM_RATIO = 1.2;

var Main = ContextMenuLayer("context_menu_main")(React.createClass({
    componentDidMount: function() {
        // Create Konva Stage fit with browser window size
        this.maxWidth = parseFloat($('#protocol-editor').css('width'))
                        - 2 * parseFloat($('#protocol-editor').css('margin-left'));
        this.maxHeight = window.innerHeight
                        - parseFloat($('#protocol-editor').css('margin-top'))
                        - parseFloat($('#protocol-editor').css('margin-bottom'))
                        - parseFloat($('#protocol-editor').css('border-width')) * 2;
        this.stage = new Konva.Stage({
            container: 'protocol-editor',
            width: this.maxWidth,
            height: this.maxHeight
        });
        window.stage = this.stage;
        this.updateData();
    },
    updateData: function() {
        this.autoScaleStage();
        const { stage } = this;
        stage.destroyChildren();
        const drawInfo = this.state.data.drawInfo;
        let prinLayer = new Konva.Layer(); // for principals
        let msgLayer = new Konva.Layer(); // for messages
        const prins = _.map(this.state.data.protocol.prins, (prinModel) => {
            return ProtocolComponent.getPrinObject(prinModel, drawInfo);
        });
        _.each(prins, (prin) => {
            prinLayer.add(prin);
        });
        const messages = _.map(this.state.data.protocol.messages, (msgModel) => {
            return ProtocolComponent.getMessageObject(msgModel, drawInfo);
        });
        _.each(messages, (msg) => {
            msgLayer.add(msg);
        });
        stage.add(prinLayer);
        stage.add(msgLayer);
        stage.draw();
    },
    autoScaleStage: function() {
        if (window.drawInfo == undefined) {
            return;
        }
        if (window.drawInfo.yPos > this.maxHeight - 100) {
            this.maxHeight = this.maxHeight * 1.5;
            this.stage.setHeight(this.maxHeight);
        }
    },
    getInitialState() {
        return {
            data: _.defaultsDeep(ProtocolModel.getInitial(), {
                drawInfo: {
                    fontSize: ProtocolComponent.DEFAULT_FONT_SIZE,
                    fontFamily: ProtocolComponent.DEFAULT_FONT_FAMILY,
                    scale: {x: 1, y: 1},
                    origin: {x: 0, y: 0}
                },
                protocol: {

                }
            })
        }
    },
    resetZoom: function() {
        this.state.data.drawInfo.scale = { x: 1, y: 1 };
        stage.scale(this.state.data.drawInfo.scale);
        stage.batchDraw();
    },
    zoomIn: function(ratio = ZOOM_RATIO) {
        const prevScale = stage.scale();
        const newScale = { x: prevScale.x * ratio, y: prevScale.y * ratio };
        this.state.data.drawInfo.scale = newScale;
        stage.scale(newScale);
        stage.batchDraw();
    },
    zoomOut: function(ratio = ZOOM_RATIO) {
        const prevScale = stage.scale();
        const newScale = { x: prevScale.x / ratio, y: prevScale.y / ratio };
        this.state.data.drawInfo.scale = newScale;
        stage.scale(newScale);
        stage.batchDraw();
    },
    changeFontSize: function({ value }) {
        this.setState(update(this.state, { data: { drawInfo: { fontSize: { $set: value } } } }));
    },
    changeFontFamily: function({ value }) {
        this.setState(update(this.state, { data: { drawInfo: { fontFamily: { $set: value } } } }));
    },
    renderSelectFontFamily: function({ label, value }) {
        return <div style={{ fontFamily: value }} > { label } </div>
    },
    renderSelectFontSize: function({ label, value }) {
        return <div style={{ fontSize: value }} > { label } </div>
    },
    selectFile: function() {
        $('.importStateSeq').click();
    },
    stateSeqHandler: function(event) {
        var self = this;
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            let result = event.target.result;
            let protocol = parser.fileContent2message(result);
            protocol.current = 0;
            protocol.messages = [];
            // protocol.messages = protocol.network;
            const prins = self.state.data.protocol.prins;
            if (protocol.prins) {
                for (let i = 0; i < protocol.prins.length; i ++) {
                    if (prins[i]) {
                        protocol.prins[i].drawInfo = prins[i].drawInfo;
                    }
                }
            }
            self.setState(update(self.state, { data: { protocol: { $set: protocol } } }));
        };
        reader.readAsText(file);
    },
    next: function(event) {
        let current = this.state.data.protocol.current;
        let messages = this.state.data.protocol.messages;
        let network = this.state.data.protocol.network;
        if (current < network.length) {
            messages.push(network[current]);
            current ++;
            this.setState(update(this.state, { data: { protocol: { current: {$set: current}, messages : {$set: messages} } } }));
            this.updateData();
        }
    },
    prev: function(event) {
        let current = this.state.data.protocol.current;
        let messages = this.state.data.protocol.messages;
        if (current > 0) {
            messages.pop();
            current --;
            this.setState(update(this.state, { data: { protocol: { current: {$set: current}, messages : {$set: messages} } } }));
            this.updateData();
        }
    },
    render() {
        const { fontFamily, fontSize } = this.state.data.drawInfo;
        return (
            <div>
                <div id="panel">
                    <Button className="btn btn-primary" onClick={this.selectFile}>Select File</Button>
                    <Button className="btn btn-default"><i className="fa fa-play" aria-hidden="true"></i> Play</Button>
                    <Button className="btn btn-default"><i className="fa fa-pause" aria-hidden="true"></i> Pause</Button>
                    <Button className="btn btn-default"><i className="fa fa-stop" aria-hidden="true"></i> Stop</Button>
                    <Button className="btn btn-default" onClick={ this.prev }><i className="fa fa-step-backward" aria-hidden="true"></i> Prev</Button>
                    <Button className="btn btn-default" onClick={ this.next }><i className="fa fa-step-forward" aria-hidden="true"></i> Next</Button>
                    <Select className="select-font-family"
                        name="select-font-family"
                        value={ fontFamily }
                        searchable={ true }
                        clearable={ false }
                        placeholder={ "Font family" }
                        options={ commonFonts.map((font) => ({ value: font, label: font })) }
                        onChange={ this.changeFontFamily }
                        autoBlur={ true }
                        optionRenderer={ this.renderSelectFontFamily }
                        valueRenderer={ this.renderSelectFontFamily }
                        />
                    <Select className="select-font-size"
                        name="select-font-size"
                        placeholder={ "Font size" }
                        value={ fontSize }
                        searchable={ true }
                        clearable={ false }
                        options={ _.range(6, 51).map((i) => ({ value: i, label: `${i}px` })) }
                        onChange={ this.changeFontSize }
                        autoBlur={ true }
                        optionRenderer={ this.renderSelectFontSize }
                    />
                    <div style={ { visibility: 'hidden', height: 0 } }>
                        <FileInput className="importStateSeq"
                        placeholder="Import State Sequence"
                        onChange={ this.stateSeqHandler }
                        />
                    </div>

                </div>
                <div id="protocol-editor" ></div>
                <div>
                    <ContextMenu identifier="context_menu_main" currentItem={ this.currentItem }>
                        <MenuItem onClick={ () => this.zoomIn() } >Zoom in</MenuItem>
                        <MenuItem onClick={ () => this.zoomOut() } >Zoom out</MenuItem>
                        <MenuItem onClick={ () => this.resetZoom() } >Reset Zoom</MenuItem>
                    </ContextMenu>
                </div>
            </div>
        )
    },
    componentDidUpdate() {
        this.updateData();
    }
}));

export default Main;