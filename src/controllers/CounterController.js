import Counter from "../models/CounterModel";
import { createCounterHTML } from "../views/CounterView";
import { save, load } from "../services/StorageService";
import { getCounters, getCounterElements } from "../utils/CounterUtils";


export function initialize() {
    bindSelectAll();
    bindAddCounter();
    bindDeleteCounter();
    bindResetButtons();
    bindCounterEvents();
    loadCounters();
}

function bindSelectAll() {
    const selectAll = document.getElementById("selectAll");
    selectAll.onchange = () => {
        const checked = selectAll.checked;
        getCounters().forEach(counter => {
            getCounterElements(counter).check.checked = checked;
        });
        updateTotal();
        updateSelectAll();
        saveCounters();
    };
}

function bindAddCounter() {
    const addCounter = document.getElementById("addCounter");
    const counterList = document.getElementById("counterList");
    addCounter.onclick = () => {
        counterList.insertAdjacentHTML(
            "beforeend",
            createCounterHTML()
        );
        updateTotal();
        updateSelectAll();
        saveCounters();
    };
}

function bindDeleteCounter() {
    const deleteButton = document.getElementById("deleteCounters");
    deleteButton.onclick = () => {
        getCounters().forEach(counter => {
            const { check } = getCounterElements(counter);
            if (check.checked) {
                counter.remove();
            }
        });
        updateTotal();
        updateSelectAll();
        saveCounters();
    };
}

function bindResetButtons() {
    const resetNames = document.getElementById("resetNames");
    const resetCounts = document.getElementById("resetCounts");
    const resetSelected = document.getElementById("resetSelected");
    resetNames.onclick = () => {
        getCounters().forEach(counter => {
            const { name, check } =
                getCounterElements(counter);
            if (check.checked) {
                name.value = "";
            }
        });
        saveCounters();
    };
    resetCounts.onclick = () => {
        getCounters().forEach(counter => {
            const { count, check } =
                getCounterElements(counter);
            if (check.checked) {
                count.value = 0;
            }
        });
        updateTotal();
        saveCounters();
    };
    resetSelected.onclick = () => {
        getCounters().forEach(counter => {
            const { name, count, check } =
                getCounterElements(counter);
            if (check.checked) {
                name.value = "";
                count.value = 0;
            }
        });
        updateTotal();
        saveCounters();
    };
}

function bindCounterEvents() {
    const counterList =
        document.getElementById("counterList");
    counterList.onclick = (event) => {
        const target = event.target;
        if (target.classList.contains("plus")) {
            const counter =
                target.closest(".counter");
            const { count } =
                getCounterElements(counter);
            count.value =
                String(Number(count.value) + 1);
            updateTotal();
            saveCounters();
        }
        else if (target.classList.contains("minus")) {
            const counter =
                target.closest(".counter");
            const { count } =
                getCounterElements(counter);
            count.value =
                String(Number(count.value) - 1);
            updateTotal();
            saveCounters();
        }
        else if (target.classList.contains("select")) {
            updateTotal();
            updateSelectAll();
            saveCounters();
        }
    };

    counterList.oninput = (event) => {
        const target = event.target;
        if (
            target.classList.contains("count") ||
            target.classList.contains("counterName")
        ) {
            updateTotal();
            saveCounters();
        }
    };
}


// カウンターの保存
async function saveCounters() {
    const counters = getCounters().map(counter => {
        const { name, count, check } = 
            getCounterElements(counter);
        
            return new Counter(
                name.value,
                +count.value,
                check.checked
            );
    });
    await save(counters);
}

// カウンターの読み込み
async function loadCounters() {
    const counterList = document.getElementById("counterList");
    const counters = (await load()) ?? [];
    counterList.innerHTML = counters
    .map(counter => 
        createCounterHTML(
            counter.name,
            counter.count,
            counter.checked
        )
    )
    .join("");
    updateTotal();
    updateSelectAll();
}


// 合計を計算して画面に表示する
function updateTotal() {
    const total = document.getElementById("total");
    const sum = getCounters().reduce((total, counter) => {
        const { count, check } = getCounterElements(counter);
        return check.checked 
            ? total + +count.value
            : total;
    }, 0);

    total.textContent = sum;
}


// チェックボックスの選択状況UIを改善
function updateSelectAll() {
    const selectAll = document.getElementById("selectAll");
    const checks = getCounters().map(counter =>
        getCounterElements(counter).check
    );
    const checkedCount = checks.filter(check => check.checked).length;

    if (checkedCount === 0) {
        // 全てOFFの場合
        selectAll.checked = false;
        selectAll.indeterminate = false;

    } else if (checkedCount === checks.length) {
        // 全てONの場合
        selectAll.checked = true;
        selectAll.indeterminate = false;

    } else {
        // 一部だけONの場合
        selectAll.checked = false;
        selectAll.indeterminate = true;
    }
}