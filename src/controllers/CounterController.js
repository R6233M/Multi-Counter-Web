// アプリ全体の動きを制御するファイル

// Model・View・Service・Utilsを連携させる
import Counter from "../models/CounterModel";
import { createCounterHTML } from "../views/CounterView";
import { save, load } from "../services/StorageService";
import { getCounters, getCounterElements } from "../utils/CounterUtils";

// アプリの起動に関する関数
export function initialize() {
    bindSelectAll();
    bindAddCounter();
    bindDeleteCounter();
    bindResetButtons();
    bindCounterEvents();
    loadCounters();
}

// 全選択チェックボックスのイベント登録機能
function bindSelectAll() {
    const selectAll = document.getElementById("selectAll");      // HTMLの<input id="selectAll">を取得
    selectAll.onchange = () => {                                 // 全選択チェックボックスの状態変化時に処理を実行
        const checked = selectAll.checked;                       // 全選択チェックボックスのON・OFFを取得
        getCounters().forEach(counter => {                       // 全てのカウンターを順番に処理
            getCounterElements(counter).check.checked = checked; // 各カウンターのチェック状態を全選択チェックボックスの状態と同じにする
        });
        updateTotal();         // 数値の合計を最新の状態に更新
        updateSelectAll();     // 全選択チェックボックスの表示状態を更新
        saveCounters();        // 現在の状態をLocalStorageに保存
    };
}

// 『カウンター追加ボタン』が押された時のイベントを登録する関数
function bindAddCounter() {
    const addCounter = document.getElementById("addCounter");    // 「カウンター追加」ボタンを取得
    const counterList = document.getElementById("counterList");  // カウンターを表示する親要素を取得
    addCounter.onclick = () => {                                 // 追加ボタンが押された時に処理を実行
        counterList.insertAdjacentHTML(                          // 生成したHTMLを画面へ追加
            "beforeend",                                         // 生成したHTMLをcounterListの最後に追加
            createCounterHTML()                                  // 新しいカウンターを作成（CounterViewの<div class="counter">のHTMLを作成）
        );
        updateTotal();
        updateSelectAll();
        saveCounters();
    };
}

// 『カウンター削除ボタン』が押された時のイベントを登録する関数
function bindDeleteCounter() {
    const deleteButton = document.getElementById("deleteCounters");  // 「カウンター削除」ボタンを取得
    deleteButton.onclick = () => {                                   // 削除ボタンが押された時に処理を実行
        getCounters().forEach(counter => {                           // 全てのカウンターを順番に処理
            const { check } = getCounterElements(counter);           // 現在処理しているカウンターの『チェック』を取得
            if (check.checked) {                                     // チェックされているカウンターのみ対象にする
                counter.remove();                                    // 対象のカウンターを削除する
            }
        });
        updateTotal();
        updateSelectAll();
        saveCounters();
    };
}

// ３種類のリセットボタン（名前・数値・全部）が押された時のイベントを登録する関数
function bindResetButtons() {
    const resetNames = document.getElementById("resetNames");       // 名前リセットボタンを取得
    const resetCounts = document.getElementById("resetCounts");     // 数値リセットボタンを取得
    const resetSelected = document.getElementById("resetSelected"); // 全部リセットボタンを取得
    resetNames.onclick = () => {                                    // 名前リセットボタンが押された時に処理を実行
        getCounters().forEach(counter => {                          // 全てのカウンターを順番に処理
            const { name, check } = getCounterElements(counter);    // 現在処理しているカウンターの『名前』と『チェック』を取得
            if (check.checked) {                                    // チェックされているカウンターのみ対象にする
                name.value = "";                                    // 対象のカウンターの名前を空文字にする
            }
        });
        saveCounters();
    };
    resetCounts.onclick = () => {                                   // 数値リセットボタンが押された時に処理を実行
        getCounters().forEach(counter => {                          // 全てのカウンターを順番に処理
            const { count, check } = getCounterElements(counter);   // 現在処理しているカウンターの『数値』と『チェック』を取得
            if (check.checked) {                                    // チェックされているカウンターのみ対象にする
                count.value = 0;                                    // 対象のカウンターの数値を0にする
            }
        });
        updateTotal();
        saveCounters();
    };
    resetSelected.onclick = () => {                                     // 全部リセットボタンが押された時に処理を実行
        getCounters().forEach(counter => {                              // 全てのカウンターを順番に処理
            const { name, count, check } = getCounterElements(counter); // 現在処理しているカウンターの『名前』『数値』『チェック』を取得                        
            if (check.checked) {                                        // チェックされているカウンターのみ対象にする
                name.value = "";                                        // 対象のカウンターの名前を空文字にする
                count.value = 0;                                        // 対象のカウンターの数値を0にする
            }
        });
        updateTotal();
        saveCounters();
    };
}

// 各カウンターで発生する操作のイベントを登録する関数（イベント委譲）
function bindCounterEvents() {
    const counterList =
        document.getElementById("counterList");         // カウンターの親要素を取得
        
    counterList.onclick = (event) => {                  // クリックに関するイベントを登録
        const target = event.target;                    // クリックされた要素を取得
        if (target.classList.contains("plus")) {        // ＋ボタンがクリックされた場合
            const counter =
                target.closest(".counter");             // クリックされたボタンのカウンター（.counter）を対象
            const { count } =
                getCounterElements(counter);            // そのカウンターの数値入力欄のみ取得
            count.value =
                String(Number(count.value) + 1);        // CounterViewのinput.valueは文字列の為、Number()で数値へ変換して加算し、最後にString()で文字列に戻す
            updateTotal();
            saveCounters();
        }
        else if (target.classList.contains("minus")) {  // －ボタンがクリックされた場合
            const counter =
                target.closest(".counter");
            const { count } =
                getCounterElements(counter);
            count.value =
                String(Number(count.value) - 1);
            updateTotal();
            saveCounters();
        }
        else if (target.classList.contains("select")) { // チェックがクリックされた場合
            updateTotal();
            updateSelectAll();
            saveCounters();
        }
    };

    counterList.oninput = (event) => {                  // 入力に関するイベントを登録 
        const target = event.target;                    // 入力された要素を取得
        if (
            target.classList.contains("count") ||
            target.classList.contains("counterName")    // 数値入力欄・名前入力欄のどちらかを判定
        ) {
            updateTotal();
            saveCounters();
        }
    };
}


// カウンターの保存処理機能
async function saveCounters() {
    const counters = getCounters().map(counter => {   // 画面に表示されているすべてのカウンターを取得し、map()で保存用のデータに変換
        const { name, count, check } = 
            getCounterElements(counter);              // 各カウンターの『名前』『数値』『チェック』を取得
        
            return new Counter(                       // 取得した情報をCounterクラスのオブジェクトに変換
                name.value,
                +count.value,                         // 数値入力欄の値は文字列のため、+を使って数値へ変換（Number(count.value)と同じ意味）
                check.checked
            );
    });
    await save(counters);                             // 変換したデータをStorageServiceへ渡し、LocalStorageへ保存
}

// 保存されたデータを画面に復元する処理
async function loadCounters() {
    const counterList = document.getElementById("counterList"); // カウンターを表示する親要素を取得
    const counters = (await load()) ?? [];                      // loadでStorageServiceから保存データを読み込み、awaitで処理が終わるまで待つ。?? []で、保存データがない場合でもエラーにならないように空配列を使う
    counterList.innerHTML = counters                            // 生成したHTMLを画面に表示する
    .map(counter =>                                             // 保存されているカウンターを1件ずつHTMLに変換
        createCounterHTML(                                      // CounterViewのcreateCounterHTML()を呼び出す
            counter.name,
            counter.count,
            counter.checked
        )
    )
    .join("");          // mapで生成したHTMLの配列を、画面に表示する為に1つのHTML文字列にする
    updateTotal();
    updateSelectAll();
}


// チェックされているカウンターの合計を計算して画面に表示する
function updateTotal() {
    const total = document.getElementById("total");            // 合計を表示する要素を取得（mainの<span id="total">0</span>）
    const sum = getCounters().reduce((total, counter) => {     // reduce()を使って、取得したカウンターの要素を順番に処理し、合計を計算する。
        const { count, check } = getCounterElements(counter);  // 現在処理しているカウンターの『数値』『チェック』を取得
        return check.checked                                   // チェックの有無を判定し、チェックされているカウンターのみ合計対象にする
            ? total + +count.value                             // 三項演算子（条件式 ? 真の場合 : 偽の場合）を使用。
            : total;                                           // 入力欄の値は文字列のため、+を使って数値へ変換。チェックされていない場合は合計を更新しない。
    }, 0);                                                     // 合計の初期値を0に設定する

    total.textContent = sum;                                   // 計算した合計を画面に表示する
}


// 全選択チェックボックスの状態を管理する関数
function updateSelectAll() {
    const selectAll = document.getElementById("selectAll");             // 全選択チェックボックスを取得
    const checks = getCounters().map(counter =>
        getCounterElements(counter).check                               // 全カウンターからチェックボックスのみ取得し、map()でcounterをcheckだけの配列に変換
    );
    const checkedCount = checks.filter(check => check.checked).length;  // filter()で条件に一致するものだけ取得し、lengthで数をかぞえる

    if (checkedCount === 0) {                     // チェックが1つも無い場合
        selectAll.checked = false;                // 全選択：OFF
        selectAll.indeterminate = false;          // 一部チェック：OFF（☐→全てOFF、☑→全てON、◩→一部だけON）

    } else if (checkedCount === checks.length) {  // 全てチェックされている場合
        selectAll.checked = true;                 // 全選択：ON
        selectAll.indeterminate = false;          // 一部チェック：OFF

    } else {                                      // それ以外の場合（チェックが1つ以上、全部未満）
        selectAll.checked = false;                // 全選択：OFF
        selectAll.indeterminate = true;           // 一部チェック：ON
    }
}