import {fnPrepareGoJSFlowChartDiagram} from './gojs_flowchart.js'

const GOJS_ID = "gojs-network"

function fnObjCopy(oO) {
    return JSON.parse(JSON.stringify(oO))
}

function showLinkLabel(e) {
    var label = e.subject.findObject("LABEL");
    if (label !== null)
        label.visible = e.subject.fromNode.data.category === "Conditional";
}

function fnPrepareGoJSNetwork()
{
    window.oApp.myDiagram = {}
    const $ = go.GraphObject.make; 

    var myDiagram = $(
        go.Diagram,
        GOJS_ID, // must name or refer to the DIV HTML element
        {
            LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
            LinkRelinked: showLinkLabel,
            "undoManager.isEnabled": true, // enable undo & redo
            layout: $(go.TreeLayout,
                { angle: 90, nodeSpacing: 10, layerSpacing: 30 }),
        }
    );

    window.oApp.myDiagram = myDiagram
}

export {
    GOJS_ID,
    fnObjCopy,
    fnPrepareGoJSNetwork
}
