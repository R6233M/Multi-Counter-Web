// 保存・読み込みだけを担当するファイル

const STORAGE_KEY = "multi-counter";

export async function save(counters) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(counters)
    );
}

export async function load() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}