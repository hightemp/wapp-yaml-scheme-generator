import { 
    oApp, 
    DEFAULT_SCHEME, YAML_GOJS_FLOWCHART, 
    YAML_VISJS_BASE, YAML_VISJS_PCS, YAML_VISJS_FLOWCHART, q
} from './vars.js'
import { fnPrepareGoJSNetwork, GOJS_ID } from './gojs/lib.js'
import { fnPrepare, fnPrepareVisJSNetwork, VISJS_ID } from './visjs/lib.js'
import { fnRunVisJS } from './visjs/visjs_base.js'
import { fnRunPCS } from './visjs/visjs_pcs.js'
import { fnRunFlowchart } from './visjs/visjs_flowchart.js'
import { fnRunGoJSFlowchart } from './gojs/gojs_flowchart.js'

function fnRun() {
    var oA = window.oApp;
    var aErrors = []
    try {
        console.error = (...aM) => { aErrors.push(aM.join(`\n`)) }
        q('.top-message').innerText = '';
        oA.sEditorText = oA.oEditor.getValue();

        var oV = q(`#${VISJS_ID}`).style
        var oG = q(`#${GOJS_ID}`).style

        oV.display = "none"
        oG.display = "none"

        var oYAML = jsyaml.load(oA.sEditorText)
        var sType = oYAML.scheme.type

        if (sType == YAML_VISJS_BASE) {
            oV.display = "block"
            fnRunVisJS(oYAML, aErrors);
        } else if (sType == YAML_VISJS_PCS) {
            oV.display = "block"
            fnRunPCS(oYAML, aErrors);
        } else if (sType == YAML_VISJS_FLOWCHART) {
            oV.display = "block"
            fnRunFlowchart(oYAML, aErrors);
        } else if (sType == YAML_GOJS_FLOWCHART) {
            oG.display = "block"
            fnRunGoJSFlowchart(oYAML, aErrors);
        }
    } catch (oE) {
        aErrors.push(oE+'')
    }

    q('.top-message').innerText = aErrors.join(`\n`);
}

function fnClear() {
    oEditor.setValue('');
}
function fnLog() {

}

function fnSaveCurrentScheme() {
    var oA = window.oApp;
    var sName = fnGetSchemeName();
    fnSaveScheme(sName, oA.sEditorText);
}
function fnLoadCurrentScheme() {
    var oA = window.oApp;
    var sName = fnGetSchemeSavedSchemeName();
    oA.sEditorText = fnLoadScheme(sName);
    if (!oA.sEditorText) oA.sEditorText = oA.aDefaultSchemes[0].sValue;
    if (oA.oEditor) oA.oEditor.setValue(oA.sEditorText);
}
function fnRemoveCurrentScheme() {
    var sName = fnGetSchemeSavedSchemeName();
    fnRemoveScheme(sName);
}

function fnSaveSchemes() {
    var oA = window.oApp;
    localStorage.setItem('aSchemes', JSON.stringify(oA.aSchemes));
}
function fnLoadSchemes() {
    var oA = window.oApp;
    try {
        oA.aSchemes = JSON.parse(localStorage.getItem('aSchemes'));
        if (!oA.aSchemes) oA.aSchemes = oA.aDefaultSchemes;
    } catch(oE) {
        oA.aSchemes = oA.aDefaultSchemes;
    }
    fnRenderSchemes();
}
function fnRenderSchemes() {
    var oA = window.oApp;
    var sHTML = ``;
    for (var oI of oA.aSchemes) {
        sHTML += `<option value="${oI.sName}" ${oI.sName == DEFAULT_SCHEME ? 'selected' : ''}>${oI.sName}</option>`
    }
    q('#saved-scheme-select').innerHTML = sHTML;
}

function fnSaveScheme(sName, sValue) {
    var oA = window.oApp;
    fnRemoveScheme(sName);
    oA.aSchemes.push({sName, sValue});
    fnSaveSchemes();
    fnLoadSchemes();
}
function fnLoadScheme(sName) {
    var oA = window.oApp;
    return oA.aSchemes.filter((oI) => oI.sName == sName)[0].sValue
}
function fnRemoveScheme(sName) {
    var oA = window.oApp;
    oA.aSchemes = oA.aSchemes.filter((oI) => oI.sName != sName)
}

function fnDownloadFileWithLink(filename, content) {
    const link = q('a');
    link.download = filename;
    link.href = content;
    link.click();
    link.delete;
}

function fnDownloadFile(filename, content) {
    var blob = new Blob([content]);
    var evt = q("HTMLEvents");
    evt.initEvent("click");

    fnDownloadFileWithLink(filename, webkitURL.createObjectURL(blob));
}

function fnGetSchemeName() {
    return q('#scheme-name').value
}
// function fnGetSchemeType() {
//     return q('#scheme-type-select').value
// }
function fnGetSchemeSavedSchemeName() {
    return q('#saved-scheme-select').value
}

function fnSaveImageToFile() {
    var oA = window.oApp;
    fnDownloadFileWithLink(`${fnGetSchemeName()}_${(new Date()).getTime()}.png`, oA.sImageURL);
}
function fnSaveToFile() {
    var oA = window.oApp;
    fnDownloadFile(`${fnGetSchemeName()}_${(new Date()).getTime()}.yaml`, oA.sEditorText);
}

function fnPrepareEditor() 
{
    var oA = window.oApp;

    oA.oEditor = ace.edit("editor");
    oA.oEditor.getSession().setUseWorker(false);
    oA.oEditor.setTheme("ace/theme/chrome");
    oA.oEditor.getSession().setMode("ace/mode/yaml");
    oA.oEditor.setValue(oA.sEditorText);

    oA.oEditor.setOptions({
        fontFamily: "Consolas",
        fontSize: "10px"
    });

    oA.oEditor.on('change', () => {
        fnRun();
    })
}

function fnInit() {
    document.body.addEventListener('click', function(e) {
        var sID = e.target.id;
    
        switch (sID) {
            case "button-run": fnRun(); break;
            case "button-clear": fnClear(); break;
            case "button-log": fnLog(); break;
            case "button-save-image-to-file": fnSaveImageToFile(); break;
            case "button-save-to-file": fnSaveToFile(); break;
    
            case "save-scheme": fnSaveCurrentScheme(); break;
            case "load-scheme": fnLoadCurrentScheme(); break;
            case "remove-scheme": fnRemoveCurrentScheme(); break;
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        fnLoadSchemes();
        fnLoadCurrentScheme();
    
        fnPrepareEditor();
        
        fnPrepareVisJSNetwork();
        fnPrepareGoJSNetwork();
    
        fnRun();
    });
}

export {
    fnRun,
    fnInit
}