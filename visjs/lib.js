const VISJS_ID = 'visjs-network'

function fnPrepare(oN) {
    return new window.vis.DataSet(oN);
}

function fnObjCopy(oO) {
    return JSON.parse(JSON.stringify(oO))
}

function fnPrepareVisJSNetwork()
{
    var oA = window.oApp;

    oA.oEl = q(`#${VISJS_ID}`)
    oA.oData = {
        nodes: fnPrepare([]),
        edges: fnPrepare([])
    }

    oA.oNetwork = new vis.Network(oA.oEl);

    try {
        oA.oDefaultOptions = oNetwork.getOptions();
    } catch (oE) {
        oA.oDefaultOptions = {}
    }

    oA.oNetwork.on("beforeDrawing", function(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.restore();
    })

    oA.oNetwork.on("afterDrawing", function (ctx) {
        oA.sImageURL = ctx.canvas.toDataURL();
    })

    oA.oNetwork.on("click", function(params) {
        if (params.nodes.length == 1) {
            var nodeId = params.nodes[0];
            var oN = fnFindNode(nodeId)
            if (oN.url != null) {
                window.open(oN.url, '_blank');
            }           
        } else if (params.edges.length==1) {
            var edgeId = params.edges[0];
            var oE = fnFindEdge(edgeId)
            if (oE.url != null) {
                window.open(oE.url, '_blank');
            }           
        } 
    });
}

export {
    fnPrepare,
    VISJS_ID,
    fnObjCopy,
    fnPrepareVisJSNetwork
}