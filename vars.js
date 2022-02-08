
export const YAML_VISJS_BASE = "yaml_visjs_base"
export const YAML_VISJS_PCS = "yaml_visjs_pcs"
export const YAML_VISJS_FLOWCHART = "yaml_visjs_flowchart"
export const YAML_GOJS_FLOWCHART = "yaml_gojs_flowchart"

export const TYPES = [
    YAML_VISJS_BASE,
    YAML_VISJS_PCS,
    YAML_VISJS_FLOWCHART,
    YAML_GOJS_FLOWCHART,
]

export const DEFAULT_SCHEME = 'default_gojs_flowchart.yaml';

window.q = document.querySelector.bind(document)

window.oApp = {
    oEditor: null,
    oNetwork: null,
    aNodes: [],
    aEdges: [],
    oEl: null,
    oData: {},
    sImageURL: "",
    oOptions: {},
    aDefaultSchemes: window.aDefaultSchemes,
    oDefaultOptions: {},
    aSchemes: [],
    sEditorText: "",
    iNodeIndex: 0
}

export var q = window.q;
export var oApp = window.oApp;