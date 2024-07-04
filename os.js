let isAutoloadEnabled = true
let isSystemStarted = false
let totalMem = 0
let taskCnt = 0
let tactCnt = 0
let tasks = []
let compTact = 0
let timer
var losses = 0
var perfCoeff = 0
var T_OS = 2

let exeCmdParams = { mem: 2, tactCnt: 4 }
let ioCmdParams  = { mem: 6, tactCnt: 40 }

var taskParams = {
    cmdNum: 50,
    state: 'Активен',
    quant: 20,
    D_InOut: 0.1 // кол-во команд ВВ к общ. числу команд задания
}

var sysParams = {
    speed: 1000,
    mem: 10240,
}

class exeCmd {
    constructor() {
        this.mem = exeCmdParams.mem
        this.tactCnt = exeCmdParams.tactCnt
    }
}

class ioCmd {
    constructor() {
        this.mem = ioCmdParams.mem
        this.tactCnt = ioCmdParams.tactCnt
    }
}

class Task {
    constructor() {
        this.id = ++taskCnt  // идентификатор задания
        this.mem = 0         // размер задания
        this.cmds = []       // команды задачи
        this.cmdsCnt = 0     // количество команд в задаче
        this.tactCnt = 0     // количество тактов
        this.D_InOut = 0     // количество команд ВВ в отн-ии к общ. числу команд задания
        this.N_InOut = 0     // длительность команд ВВ по отношению к вычисл. командам        
        this.isActive = true // задача активна
    }
}

function pauseTask(id) {
    const task = tasks.find(task => task.id === id)
    if (task) task.isActive = !task.isActive
}

function deleteTask(id) {
    const idx = tasks.findIndex(task => task.id === id)
    if (idx !== -1) {
        totalMem -= tasks[idx].mem
        tasks.splice(idx, 1)
    }
}

function loadTblData() {

    let data = []
    for (let i = 0; i < tasks.length; i++) {
        data.push({
            id:       tasks[i].id,
            mem:      tasks[i].mem,
            tactCnt:  tasks[i].tactCnt,
            cmdCnt:   tasks[i].cmds.length,
            D_InOut:  tasks[i].D_InOut,
            state:    tasks[i].state,
            isActive: tasks[i].isActive,
        })
    }
    mainTable.updateOrAddData(data).catch(e => {})
}

function outData(){
    loadTblData()
    drawParams('tactCnt')
    drawParams('totalMem')
    drawParams('perfCoeff')
    drawParams('losses')
}

// Создание новой задачи
function generateTask() {

    tactCnt += T_OS
    losses += T_OS
    let task = new Task
    let memSum = 0
    let tactsSum = 0
    let D_InOutCnt = 0

    for (let i = 0; i < taskParams.cmdNum; i++) {
        if (Math.random() < taskParams.D_InOut) {
            task.cmds[i] = new ioCmd
            D_InOutCnt++
        }
        else {
            task.cmds[i] = new exeCmd
        }
        memSum += task.cmds[i].mem
        tactsSum += task.cmds[i].tactCnt
    }
    task.D_InOut = D_InOutCnt / taskParams.cmdNum
    task.tactCnt = tactsSum
    task.mem = memSum
    task.cmdsCnt = taskParams.cmdNum

    if (totalMem + task.mem > sysParams.mem) {
        taskCnt--
        toastBootstrap.show() // показать предупреждение
    }
    else {
        // Добавить задачу в начало массива
        tasks.unshift(task)
        totalMem += task.mem
    }
}

// Завершение работы
function shutdown() {
    isAutoloadEnabled = false
    isSysActive = false
}

// Планировщик
function Manager() {
    let cmdTactSum = 0
    let taskCnt = 0
    let tacts = []
    let check = true
    let i = 0

    if (!isSysActive && tasks.length == 0) {
        clearInterval(timer)
        show('launch')
    }

    if (isAutoloadEnabled && !tasks[0])
        generateTask()

    while (taskCnt < tasks.length) {

        if (tasks[taskCnt].isActive == false) {
            taskCnt++
            continue
        }

        if (!tasks[taskCnt].cmds[i]) {
            losses += taskParams.quant - cmdTactSum
            compTact += cmdTactSum
            tacts[taskCnt] = cmdTactSum
            taskCnt++
            i = 0
            cmdTactSum = 0
            continue
        }

        if (tasks[taskCnt].cmds[0] instanceof ioCmd) {

            if (tasks[taskCnt].cmds[0].tactCnt > taskParams.quant) {
                tacts[taskCnt] = taskParams.quant
                compTact += taskParams.quant
            }
            else {
                tacts[taskCnt] = tasks[taskCnt].cmds[0].tactCnt
                compTact += tasks[taskCnt].cmds[0].tactCnt
            }
            taskCnt++
        }
        else if (tasks[taskCnt].cmds[i].tactCnt + cmdTactSum <= taskParams.quant && check) {
            cmdTactSum += tasks[taskCnt].cmds[i].tactCnt
            i++
        }
        else {
            losses += taskParams.quant - cmdTactSum
            compTact += cmdTactSum
            tacts[taskCnt] = cmdTactSum
            taskCnt++
            check = false
            cmdTactSum = 0
            i = 0
        }
    }

    State(tacts)

    return tacts
}

function State(tacts) {
    tactCnt += T_OS
    losses += T_OS
    for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].isActive) {
            tasks[i].state = 'Приостановлен'
        }
        else if (tacts[i] > 0) {

            if (tasks[i].cmds[0] instanceof ioCmd)
                tasks[i].state = 'Блокирован по ВВ'

            if (tasks[i].cmds[0] instanceof exeCmd)
                tasks[i].state = 'Вычисл. операция'
        }
        else {
            tasks[i].state = 'Ожидание'
        }
    }
}

function Process() {
    tactCnt += T_OS
    losses += T_OS
    const tacts = Manager()
    
    perfCoeff = (compTact / (tactCnt + taskParams.quant)).toFixed(5)

    for (let j = 0; j < taskParams.quant; j++) {

        tactCnt++
        for (let i = 0; i < tacts.length; i++) {

            if (tacts[i] > 0) {
                tacts[i]--
                tasks[i].cmds[0].tactCnt--

                if (tasks[i].cmds[0].tactCnt == 0) {
                    tasks[i].cmds.shift() // удалить 1-ый элемент
                    tasks[i].cmdsCnt--
                }
            }
        }
    }
    tasks.forEach((task, index) => {
        if (task.cmds.length == 0 ) {
            totalMem -= task.mem
            mainTable.deleteRow(task.id)
            tasks.splice(index, 1) // удалить задачу
        }
    })
}

function reSetInterval() { 
    clearInterval(timer)
    timer = setInterval(() => { Process(); outData() } , 100000 / sysParams.speed)
}

function startOS() {

    isSysActive = true
    isAutoloadEnabled = true

    totalMem = 0
    taskCnt = 0
    tactCnt = 0
    compTact = 0
    losses = 0

    reSetInterval()
}