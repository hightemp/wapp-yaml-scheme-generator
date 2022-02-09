import { 
    oApp, 
    DEFAULT_SCHEME, YAML_GOJS_FLOWCHART, 
    YAML_VISJS_BASE, YAML_VISJS_PCS, YAML_VISJS_FLOWCHART, q
} from './vars.js'
import { fnPrepareGoJSNetwork, GOJS_ID, GOJS_IFRAME_SRC } from './gojs/lib.js'
import { fnPrepare, fnPrepareVisJSNetwork, VISJS_ID, VISJS_IFRAME_SRC } from './visjs/lib.js'
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

        var oIfr = q(`#graph-iframe`)
        oIfr.onload = () => {}
        // oIfr.src = "about:blank"
        var sParam = `?t=${(new Date()).getTime()}`

        var oYAML = jsyaml.load(oA.sEditorText)
        var sType = oYAML.scheme.type

        if (sType == YAML_VISJS_BASE) {
            console.trace();
            oIfr.src = VISJS_IFRAME_SRC+sParam
        } else if (sType == YAML_VISJS_PCS) {
            console.trace();
            oIfr.src = VISJS_IFRAME_SRC+sParam
        } else if (sType == YAML_VISJS_FLOWCHART) {
            console.trace();
            oIfr.src = VISJS_IFRAME_SRC+sParam
        } else if (sType == YAML_GOJS_FLOWCHART) {
            oIfr.src = GOJS_IFRAME_SRC+sParam
        }
        // oIfr.contentWindow.location.reload()
        ((sText) => {
            oIfr.onload = () => {
                oIfr.contentWindow.postMessage({ sText });
            }
        })(oA.sEditorText)
        console.trace();
    } catch (oE) {
        aErrors.push(oE+'')
    }

    q('.top-message').innerText = aErrors.join(`\n`);
}

function fnRunScript(oMessage) 
{
    console.trace({oMessage});
    var oA = window.oApp;
    var aErrors = []
    try {
        console.error = (...aM) => { aErrors.push(aM.join(`\n`)) }
        // q('.top-message').innerText = '';
        oA.sEditorText = oMessage.sText;

        var oYAML = jsyaml.load(oA.sEditorText)
        var sType = oYAML.scheme.type

        if (sType == YAML_VISJS_BASE) {
            fnRunVisJS(oYAML, aErrors);
        } else if (sType == YAML_VISJS_PCS) {
            fnRunPCS(oYAML, aErrors);
        } else if (sType == YAML_VISJS_FLOWCHART) {
            fnRunFlowchart(oYAML, aErrors);
        } else if (sType == YAML_GOJS_FLOWCHART) {
            fnRunGoJSFlowchart(oYAML, aErrors);
        }
    } catch (oE) {
        aErrors.push(oE+'')
    }

    // q('.top-message').innerText = aErrors.join(`\n`);
    console.log(aErrors);

}

function fnClear() {
    oEditor.setValue('');
}
function fnLog() {

}

function fnSaveCurrentScheme() {
    var oA = window.oApp;
    oA.sFileName = window.prompt("file name");
    fnSaveScheme(sName, oA.sEditorText);
}
function fnLoadCurrentScheme() {
    console.trace();
    var oA = window.oApp;
    var sName = fnGetSchemeSavedSchemeName();
    console.trace(sName);
    oA.sEditorText = fnLoadScheme(sName);
    console.trace(oA.sEditorText);
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
    const link = document.createElement('a');
    link.download = filename;
    link.href = content;
    link.click();
    link.delete;
}

function fnDownloadFile(filename, content) {
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
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
    oA.sFileName = window.prompt("file name")
    fnDownloadFileWithLink(`${oA.sFileName}_${(new Date()).getTime()}.png`, oA.sImageURL);
}
function fnSaveToFile() {
    var oA = window.oApp;
    oA.sFileName = window.prompt("file name")
    fnDownloadFile(`${oA.sFileName}_${(new Date()).getTime()}.yaml`, oA.sEditorText);
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
    if (window.IS_MAIN) {
        window.addEventListener('DOMContentLoaded', () => {
            fnLoadSchemes();
            fnLoadCurrentScheme();
        
            fnPrepareEditor();
        
            fnRun();
        });

        document.body.addEventListener('click', function(e) {
            if (q("#button-run").contains(e.target)) fnRun()
            // if (q("#button-clear").contains(e.target)) fnClear()
            // if (q("#button-log").contains(e.target)) fnLog()
            if (q("#button-save-image-to-file").contains(e.target)) fnSaveImageToFile()
            if (q("#button-save-to-file").contains(e.target)) fnSaveToFile()
        
            if (q("#save-scheme").contains(e.target)) fnSaveCurrentScheme()
            if (q("#load-scheme").contains(e.target)) fnLoadCurrentScheme()
            if (q("#remove-scheme").contains(e.target)) fnRemoveCurrentScheme()

            var oSB = q("#save-dropdown-button");
            if (oSB.contains(e.target)) 
                oSB.parentElement.querySelector(".dropdown-menu").classList.toggle("show")
            var oCB = q("#copy-dropdown-button");
            if (oCB.contains(e.target)) 
                oCB.parentElement.querySelector(".dropdown-menu").classList.toggle("show")
        });
    }
    
    if (window.IS_VISJS) {
        window.addEventListener("message", (oE) => {
            console.trace(oE.data);
            fnPrepareVisJSNetwork();
            fnRunScript(oE.data);
        });
    }

    if (window.IS_GOJS) {
        window.addEventListener("message", (oE) => {
            console.trace(oE.data);
            fnPrepareGoJSNetwork();
            fnRunScript(oE.data);
        });
    }
}

export {
    fnRun,
    fnInit
}