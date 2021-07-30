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
import { ToastContainer, ToastMessage } from "react-toastr"
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

import 'react-select/dist/react-select.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import 'animate.css'
import '../style/toastr.min.css'
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
        this.createStage();
        this.updateData();
    },
    createStage: function() {
        this.stage = new Konva.Stage({
            container: 'protocol-editor',
            width: this.maxWidth,
            height: this.maxHeight
        });
        window.stage = this.stage;
    },
    updateData: function() {
        this.autoScaleStage();
        const { stage } = this;
        stage.destroyChildren();
        const drawInfo = this.state.data.drawInfo;
        const self = this;
        let prinLayer = new Konva.Layer(); // for principals
        let msgLayer = new Konva.Layer(); // for messages
        let numPrins = this.state.data.protocol.prins.length;
        let startX = this.maxWidth / (numPrins + 1);
        const prins = _.map(this.state.data.protocol.prins, (prinModel, idx) => {
            prinModel.drawInfo.x = startX * (idx + 1);
            if (prinModel.drawInfo.y == undefined)
                prinModel.drawInfo.y = 50;
            return ProtocolComponent.getPrinObject(prinModel, drawInfo);
        });
        _.each(prins, (prin) => {
            prinLayer.add(prin);
        });
        let currMessages = _.filter(this.state.data.protocol.network, (msg, idx) => {
            return idx < self.state.data.protocol.current;
        });
        let messages = _.map(currMessages, (msgModel) => {
            let revMsg = _.map(msgModel.revMsg, (msg) => {
                return ProtocolComponent.getMessageObject(msg, drawInfo, true);
            });
            let sendMsg = _.map(msgModel.sendMsg, (msg) => {
                return ProtocolComponent.getMessageObject(msg, drawInfo, false);
            })
            return _.concat(revMsg, sendMsg);
        });
        const fmessages = _.flatten(messages);
        _.each(fmessages, (msg) => {
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
        const currHeight = this.stage.getHeight();
        if (window.drawInfo.yPos > currHeight - 100) {
            this.stage.setHeight(currHeight  * 1.2);
            window.scrollTo(0, document.body.scrollHeight);
        }
    },
    resetStage: function() {
        this.stage.setHeight(this.maxHeight);
        delete window.drawInfo;
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
        $('.importStateSeq').trigger("click");
    },
    stateSeqHandler: function(event) {
        var self = this;
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            try {
                let result = event.target.result;
                let protocol = parser.fileContent2message(result);
                protocol.current = 0;
                protocol.interval = null;
                protocol.speed = 500;
                const prins = self.state.data.protocol.prins;
                if (protocol.prins) {
                    for (let i = 0; i < protocol.prins.length; i ++) {
                        if (prins[i]) {
                            protocol.prins[i].drawInfo = prins[i].drawInfo;
                        }
                    }
                }
                self.setState(update(self.state, { data: { protocol: { $set: protocol } } }));
                self.reset();
                self.refs.toast.success("Load state sequence successfully.");
            } catch (error) {
                self.refs.toast.success("Cannot parse state sequence.");
            }
        };
        reader.onerror = function(event) {
            self.refs.toast.error("Cannot state sequence.");
        };
        reader.readAsText(file);
    },
    next: function(event) {
        let current = this.state.data.protocol.current;
        let network = this.state.data.protocol.network;
        if (current < network.length) {
            current ++;
            this.setState(update(this.state, { data: { protocol: { current: {$set: current} } } }));
            this.updateData();
            return true;
        }
        return false;
    },
    prev: function(event) {
        let current = this.state.data.protocol.current;
        if (current > 0) {
            current --;
            this.setState(update(this.state, { data: { protocol: { current: {$set: current} } } }));
            this.updateData();
        }
    },
    reset: function() {
        this.pause();
        $('html,body').scrollTop(0);
        this.setState(update(this.state, { data: { protocol: {
            isPlaying: {$set: false},
            current: {$set: 0}
        } } }));
        this.resetStage();
    },
    play: function() {
        const self = this;
        const interval = setInterval(() => {
            if (!self.next()) {
                self.pause();
            }
        }, this.state.data.protocol.speed);
        self.setState(update(this.state, { data: { protocol: {
            isPlaying: {$set: true},
            interval: {$set: interval}
        } } }));
    },
    pause: function() {
        clearInterval(this.state.data.protocol.interval);
        this.setState(update(this.state, { data: { protocol: { isPlaying: {$set: false} } } }));
    },
    sliderChange: function(event) {
        const newSpeed = event.target.value;
        this.setState(update(this.state, { data: { protocol: { speed: {$set: newSpeed} } } }));
    },
    render() {
        const { fontFamily, fontSize } = this.state.data.drawInfo;
        const { isPlaying, speed } = this.state.data.protocol;
        return (
            <div>
                <div id="panel">
                    <Button disabled={ isPlaying } className="btn btn-primary" onClick={this.selectFile}>Select File</Button>
                    { !isPlaying && <Button onClick={this.play} className="btn btn-success"><i className="fa fa-play" aria-hidden="true"></i> Play</Button> }
                    { isPlaying && <Button onClick={this.pause} className="btn btn-danger"><i className="fa fa-pause" aria-hidden="true"></i> Pause</Button> }
                    <Button className="btn btn-info" disabled={ isPlaying } onClick={ this.prev }><i className="fa fa-step-backward" aria-hidden="true"></i> Prev</Button>
                    <Button className="btn btn-info" disabled={ isPlaying } onClick={ this.next }><i className="fa fa-step-forward" aria-hidden="true"></i> Next</Button>
                    <Button className="btn btn-warning" onClick={this.reset}><i className="fa fa-refresh" aria-hidden="true"></i> Reset</Button>
                    <div className="slidecontainer">
                        <input type="range" min="0" max="1000" onChange={this.sliderChange} value={speed} className="slider" />
                        <span>Value: {speed}ms</span>
                    </div>
                    <Select className="select-font-family hidden"
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
                    <Select className="select-font-size hidden"
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
                <ToastContainer ref="toast"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-right"/>
            </div>
        )
    },
    componentDidUpdate() {
        this.updateData();
    }
}));

export default Main;