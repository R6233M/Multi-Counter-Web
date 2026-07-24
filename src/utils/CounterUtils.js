// DOM取得処理を共通化

export function getCounters() {
    return [...document.querySelectorAll(".counter")];
}

export function getSelectedCounters() {
    return getCounters().filter(counter =>
        counter.querySelector(".select").checked
    );
}

export function getCounterElements(counter) {
    return {
        name: counter.querySelector(".counterName"),
        count: counter.querySelector(".count"),
        check: counter.querySelector(".select")
    };
}