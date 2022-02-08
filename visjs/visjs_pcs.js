import { fnPrepare } from './lib.js'

var oPCSStyles = {
    request: {
        color: "orange",
        shape: "dot"
    },
    method: {
        color: "#639AF2",
        shape: "square"
    },
    sql: {
        color: "#E6E6E6",
        shape: "triangle" 
    },
    tpl: {
        color: "#00FA9A",
        shape: "square" 
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

var sURLPrefix = `vscode://file/`
var sProjectPath = ``

function fnExtractCalls(aCalls, aNodes) {
    if (!Array.isArray(aCalls)) return;
    for (var mRow of aCalls) {
        if (typeof mRow == "string") {
            aNodes.push({...oPCSStyles.method, label: mRow});
        } else if (Array.isArray(mRow)) {
            if (mRow[0] in { "GET":1, "POST":1 }) {
                var sL = mRow[0]+`\n`+mRow[1]
                aNodes.push({...oPCSStyles.request, label: sL});
                fnExtractCalls(mRow[2], aNodes);
            } else if (mRow[0] == "sql_fields_select") {
                var sL = `SQL: `+mRow[1]+"."+mRow[2]+`\n`+mRow[3]+":"+mRow[4];
                aNodes.push({...oPCSStyles.sql, label: sL});
                fnExtractCalls(mRow[5], aNodes);
            } else if (mRow[0] == "tpl") {
                var sL = ``+mRow[1]+`\n`+mRow[2]+":"+mRow[3];
                aNodes.push({...oPCSStyles.tpl, label: sL});
                fnExtractCalls(mRow[4], aNodes);
            } else {
                var sL = mRow[0]+"::"+mRow[1]+`\n`+mRow[2]+":"+mRow[3];
                var sURL = `${sURLPrefix}${sProjectPath}${mRow[2]+":"+mRow[3]}`;
                aNodes.push({...oPCSStyles.method, label: sL, url: sURL});
                fnExtractCalls(mRow[4], aNodes);
            }
        }
    }
}

function fnFindNode(sID) {
    return oA.aNodes.filter((oI) => oI.id == sID)[0]
}

function fnFindEdge(sID) {
    return oA.aEdges.filter((oI) => oI.id == sID)[0]
}

function fnPrepareEdgesForCalls(aNodes, aEdges) {
    var oNodes = {}
    var oPrevNode = null;
    for (var [iIndex, oNode] of Object.entries(aNodes)) {
        oNodes[oNode.label] = iIndex;
        oNode.id = iIndex;

        if (oPrevNode) {
            var sFrom = oNodes[oPrevNode.label];
            var sTo = oNodes[oNode.label];

            aEdges.push({
                ...oPCSStyles.inner_edge,
                from: sFrom,
                to: sTo
            });
        }

        oPrevNode = oNode;
    }
}

function fnRunPCS(oYAML, aErrors) {
    var oA = window.oApp;

    oA.aNodes = [];
    oA.aEdges = [];
    oA.oOptions = {};
    oA.oNetwork.setOptions(oA.oDefaultOptions);

    if (oYAML.scheme) {
        if (oYAML.scheme.calls) {
            fnExtractCalls([oYAML.scheme.calls], oA.aNodes)
            fnPrepareEdgesForCalls(oA.aNodes, oA.aEdges);
        } else {
            aErrors.push("oYAML.scheme.calls - empty")
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

    oA.oNetwork.setData(oA.oData);
    oA.oNetwork.setOptions(oA.oOptions);

    oA.oNetwork.fit();
}

export {
    fnRunPCS
}