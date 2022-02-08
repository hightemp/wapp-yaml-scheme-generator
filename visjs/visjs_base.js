import { fnPrepare } from './lib.js'

/**
 * Метод подгатавливает схему для отрисовки обычной visjs диаграмм
 * ы
 * @param string sText  
 * @param array aErrors 
 */

function fnRunVisJS(oYAML, aErrors) {
    var oA = window.oApp;

    oA.aNodes = [];
    oA.aEdges = [];
    oA.oOptions = {};
    oA.oNetwork.setOptions(oA.oDefaultOptions);

    if (oYAML.scheme) {
        if (oYAML.scheme.nodes) {
            oA.aNodes = Object.entries(oYAML.scheme.nodes).map((aI) => {
                aI[1].id = aI[0];
                return aI[1];
            })
        } else {
            aErrors.push("oYAML.scheme.nodes - empty")
        }
        if (oYAML.scheme.edges) {
            oA.aEdges = Object.values(oYAML.scheme.edges);
        } else {
            aErrors.push("oYAML.scheme.edges - empty")
        }
        if (oYAML.scheme.options) {
            oOptions = oYAML.scheme.options;
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
}



export {
    fnRunVisJS
}