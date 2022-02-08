import { fnPrepare, fnObjCopy } from './lib.js'

var font = { face: "Monospace", align: 'left'}

var oFlowChartStyles = {
    condition: {
        color: "orange",
        shape: "diamond",
        font,
    },
    method: {
        color: "#639AF2",
        shape: "square",
        font,
    },
    begin_end: {
        color: "#E6E6E6",
        shape: "dot",
        font,
    },
    action: {
        color: "#00FA9A",
        shape: "dot" ,
        font,
    },
    inner_edge: {
        length: 400,
        arrows: {
            to: {
                enabled: true
            }
        }
    }
}

// var iNodeIndex = 0;

function fnExtractFlowchartNodes(aCalls, aNodes, aEdges, oPrevNode=null, sEdgeLabel="") {
    if (!Array.isArray(aCalls)) return;
    // var oPrevNode = null;
    var oA = window.oApp;

    for (var mRow of aCalls) {

        oA.iNodeIndex++;
        var sID = oA.iNodeIndex.toString();
        var sE = '';

        if (typeof mRow == "string") {
            // METHOD

            // LABEL: ...
            if (mRow.match(/^\w+:/)) {
                [sE, sID, mRow] = [...mRow.match(/^(\w+):\s*(.*?)$/)]
            }

            aNodes.push({...oFlowChartStyles.method, label: mRow, id: sID });
            if (oPrevNode) {
                aEdges.push({
                    ...oFlowChartStyles.inner_edge,
                    label: sEdgeLabel,
                    from: oPrevNode.id,
                    to: sID
                });
                sEdgeLabel = "";
            }
            
            oPrevNode = aNodes[aNodes.length-1];
        } else if (Array.isArray(mRow)) {
            // CONDITION
            aNodes.push({...oFlowChartStyles.condition, label: mRow[0], id: sID});
            
            if (oPrevNode) {
                aEdges.push({
                    ...oFlowChartStyles.inner_edge,
                    label: sEdgeLabel,
                    from: oPrevNode.id,
                    to: sID
                });
                sEdgeLabel = "";
            }

            oPrevNode = aNodes[aNodes.length-1];

            // YES
            var sYesID = (++oA.iNodeIndex)+'';
            if (typeof mRow[1] == "string") {
                aNodes.push({...oFlowChartStyles.method, label: mRow[1], id: sYesID});
            } else if (Array.isArray(mRow[1])) {
                fnExtractFlowchartNodes(mRow[1], aNodes, aEdges, fnObjCopy(oPrevNode), "YES");
            }

            // NO
            var sNoID = (++oA.iNodeIndex)+'';
            if (typeof mRow[2] == "string") {
                aNodes.push({...oFlowChartStyles.method, label: mRow[2], id: sNoID});
            } else if (Array.isArray(mRow[2])) {
                fnExtractFlowchartNodes(mRow[2], aNodes, aEdges, fnObjCopy(oPrevNode), "NO");
            }

            // YES
            aEdges.push({
                ...oFlowChartStyles.inner_edge,
                label: "YES",
                from: sID,
                to: sYesID
            });

            // NO
            aEdges.push({
                ...oFlowChartStyles.inner_edge,
                label: "NO",
                from: sID,
                to: sNoID
            });

            // fnExtractFlowchartNodes(mRow[3], aNodes, aEdges, JSON.parse(JSON.stringify(oPrevNode)));
        }
    }
}

// function fnPrepareFlowchartEdges(aNodes, aEdges) {
//     var oNodes = {}
//     var oPrevNode = null;
//     for (var [iIndex, oNode] of Object.entries(aNodes)) {
//         oNodes[oNode.label] = iIndex;
//         oNode.id = iIndex;

//         if (oPrevNode) {
//             if (oNode.label.match(/^(#\w+)/)) {
//                 var sFrom = oNodes[oNode.label].id;
//                 var aM = oNode.label.match(/^(#\w+)(.*)/);
//                 var sTo = aM[1].replace(/#/, '');
//                 // oNode.label = aNodes[sTo].label;
//                 oNode.label = aM[2]

//                 aEdges.push({
//                     ...oFlowChartStyles.inner_edge,
//                     from: sFrom,
//                     to: sTo
//                 });
//             }

//             var sFrom = oNodes[oPrevNode.label];
//             var sTo = oNodes[oNode.label];

//             aEdges.push({
//                 ...oFlowChartStyles.inner_edge,
//                 from: sFrom,
//                 to: sTo
//             });
//         }

//         oPrevNode = oNode;
//     }
// }

function fnRunFlowchart(oYAML, aErrors) {
    var oA = window.oApp;

    oA.aNodes = [];
    oA.aEdges = [];
    oA.oOptions = {};
    oA.iNodeIndex = 0;
    oA.oNetwork.setOptions(oA.oDefaultOptions);

    if (oYAML.scheme) {
        if (oYAML.scheme.program) {
            fnExtractFlowchartNodes(oYAML.scheme.program, oA.aNodes, oA.aEdges)
            // fnPrepareFlowchartEdges(aNodes, aEdges);
        } else {
            aErrors.push("oYAML.scheme.program - empty")
        }

        if (oYAML.scheme.options) {
            oA.oOptions = oYAML.scheme.options;
        } else {
            aErrors.push("oYAML.scheme.options - empty")
        }
    } else {
        aErrors.push("oYAML.scheme - empty")
    }

    oA.oData = {
        nodes: fnPrepare(oA.aNodes),
        edges: fnPrepare(oA.aEdges)
    }

    oA.oNetwork.setOptions(oA.oOptions);
    oA.oNetwork.setData(oA.oData);

    oA.oNetwork.fit();
}

export {
    fnRunFlowchart
}