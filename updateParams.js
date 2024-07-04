document.getElementById('applySysParams').addEventListener('click', () => {
    sysParams.speed = parseInt(document.getElementById('speed-launch').value)
    sysParams.mem   = parseInt(document.getElementById('mem').value)
    T_OS            = parseInt(document.getElementById('T_OS').value)
})

document.getElementById('applyTaskParams').addEventListener('click', () => {
    taskParams.cmdNum  = parseInt(document.getElementById('cmdNum').value)
    taskParams.D_InOut = parseFloat(document.getElementById('D_InOut').value)
    taskParams.quant   = parseInt(document.getElementById('quant').value)
    sysParams.speed    = parseInt(document.getElementById('speed').value)
    reSetInterval()
})

document.getElementById('applyCmdParams').addEventListener('click', () => {
    ioCmdParams.mem      = parseInt(document.getElementById('ioMem').value)
    ioCmdParams.tactCnt  = parseInt(document.getElementById('ioTact').value)
    exeCmdParams.mem     = parseInt(document.getElementById('exeMem').value)
    exeCmdParams.tactCnt = parseInt(document.getElementById('exeTact').value)
})

function drawParams(param) {
    switch (param) {
        case 'sysParams':
            document.getElementById('speed-launch').value = sysParams.speed
            document.getElementById('mem').value    = sysParams.mem
            document.getElementById('mem-ro').value = sysParams.mem
            break

        case 'taskParams':
            document.getElementById('cmdNum').value  = taskParams.cmdNum
            document.getElementById('D_InOut').value = taskParams.D_InOut
            document.getElementById('quant').value   = taskParams.quant
            document.getElementById('speed').value   = sysParams.speed
            break

        case 'autoload':
            document.getElementById('task-autoload').checked = isAutoloadEnabled
            break

        case 'tactCnt':
            document.getElementById('tactCnt').value = tactCnt
            break

        case 'totalMem':
            document.getElementById('totalMem').value = totalMem
            break
        
        case 'perfCoeff':
            document.getElementById('perfCoeff').value = perfCoeff
            break
        
        case 'losses':
            document.getElementById('losses').value = losses
            break
    }
}