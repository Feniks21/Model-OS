window.onload = () => {
    drawParams('sysParams')
    document.getElementById('ioMem').value = ioCmdParams.mem
    document.getElementById('ioTact').value = ioCmdParams.tactCnt
    document.getElementById('exeMem').value = exeCmdParams.mem
    document.getElementById('exeTact').value = exeCmdParams.tactCnt
    document.getElementById('T_OS').value = T_OS
    document.getElementById('T_OS-ro').value = T_OS
}

// Запуск ОС
document.getElementById('launch').addEventListener('click', () => {
    show('main')
    drawParams('taskParams')
    drawParams('autoload')
    startOS()
})

// Завершение ОС
document.getElementById('shutdown').addEventListener('click', () => {
    shutdown()
})

// Загрузить задание
document.getElementById('load').addEventListener('click', () => generateTask())

// Включить / Отключить поступление заданий
document.getElementById('task-autoload').addEventListener('change', function () {
    isAutoloadEnabled = this.checked
})

const mainTable = new Tabulator("#main-table", {

    layout: 'fitColumns',
    minHeight: '37rem',
    maxHeight: '37rem',
    addRowPos: 'top',
    selectable: false,
    
    columns: [
        { field: 'id',       title: '№',               headerHozAlign: 'center', headerSort:false, hozAlign: 'center' },
        { field: 'mem',      title: 'Память',          headerHozAlign: 'center', headerSort:false, hozAlign: 'center' },
        { field: 'tactCnt',  title: 'Такты',           headerHozAlign: 'center', headerSort:false, hozAlign: 'center' },
        { field: 'cmdCnt',   title: 'Осталось команд', headerHozAlign: 'center', headerSort:false, hozAlign: 'center', widthGrow: 2 },
        { field: 'D_InOut',  title: 'ВВ / Команды',    headerHozAlign: 'center', headerSort:false, hozAlign: 'center',
          formatter: cell => Math.trunc(cell.getValue() * 100) + '%' },
        { field: 'state',    title: 'Состояние',       headerHozAlign: 'center', headerSort:false, hozAlign: 'center', widthGrow: 2 },
        { field: 'isActive', title: 'Действия',        headerHozAlign: 'center', headerSort:false, hozAlign: 'center',
            cellClick: (e, cell) => {
                if (e.target.classList.contains('delete')) {
                    deleteTask(cell.getData().id)
                    cell.getRow().delete()
                }
                else {
                    pauseTask(cell.getData().id)
                }
            },
            formatter: cell =>
                `<button class="btn btn-alt p-0"><span class="icon">${(cell.getValue() ? 'pause' : 'play_arrow')}</span></button>
                <button class="btn btn-alt p-0"><span class="icon delete">delete_forever</span></button>`
        }
    ],
})