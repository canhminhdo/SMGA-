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

export const ZOOM_RATIO = 1.2;

var Main = ContextMenuLayer("context_menu_main")(React.createClass({
    componentDidMount: function() {
        // Create Konva Stage fit with browser window size
        this.maxWidth = window.innerWidth
                        - 2 * parseFloat($('body').css('padding'))
                        - parseFloat($('#protocol-editor').css('border-width')) * 2;
        this.maxHeight = window.innerHeight
                        - $('#panel').height()
                        - parseFloat($('#panel').css("padding-bottom"))
                        - $('#control-buttons').height()
                        - parseFloat($('#control-buttons').css("margin-bottom"))
                        - 2 * parseFloat($('body').css('padding'))
                        - parseFloat($('#protocol-editor').css('border-width')) * 2;
        this.stage = new Konva.Stage({
            container: 'protocol-editor',
            width: this.maxWidth,
            height: this.maxHeight
        });
        window.stage = this.stage;
        const stage = this.stage;
        this.updateData();
    },
    getInitialState() {
        // Loading default data
        return {
            data: _.defaultsDeep(ProtocolModel.getInitial(), {
                drawInfo: {
                    fontSize: ProtocolComponent.COLUMN_DEFAULT_FONT_SIZE,
                    fontFamily: ProtocolComponent.DEFAULT_FONT_FAMILY,
                    scale: {x: 1, y: 1},
                    origin: {x: 0, y: 0}
                },
                tables: []
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
    updateData: function() {
        const { stage } = this;
        const self = this;
        stage.destroyChildren();
        let layer = new Konva.Layer();
        let rect = new Konva.Rect({x: 20, y: 50, width: 100, height: 100, fill: "red"});
        layer.add(rect);
        stage.add(layer);
        stage.draw();
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
    render() {
        const { fontFamily, fontSize } = this.state.data.drawInfo;
        return (
            <div>
                <div id="panel">
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
                        <FileInput className="importJson"
                        accept=".json"
                        placeholder="Import JSON"
                        onChange={ this.loadFileJsonHandler }
                        />
                    </div>
                </div>
                <div id="control-buttons" className="text-center mb-10">
                    <Button>Prev</Button>{' '}
                    <Button>Play</Button>{' '}
                    <Button>Pause</Button>{' '}
                    <Button>Stop</Button>{' '}
                    <Button>Next</Button>
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