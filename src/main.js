// アプリを起動するためのファイル

import { initialize } from './controllers/CounterController'; // CounterController.jsのinitialize関数を読み込みアプリを初期化
import './style.css';
import './app.css';

// HTMLを生成
// index.htmlの<div id="app"></div>にHTMLを代入する
document.querySelector('#app').innerHTML = `
<h2>
  合計：<span id="total">0</span>
</h2>

<div class="buttonArea">
  <div class="buttonRow">
    <button id="addCounter">追加</button>
    <button id="deleteCounters">削除</button>
  </div>

  <div class="buttonRow">
    <button id="resetSelected">全てリセット</button>
    <button id="resetNames">名前リセット</button>
    <button id="resetCounts">数値リセット</button>
  </div>
</div>

<div class="contentArea">
  <label id="selectAllArea">
    <input type="checkbox" id="selectAll">
    全選択
  </label>

  <div id="counterList">
  </div>
  
</div>

`;

// アプリを起動する（＊これが無いと画面だけ表示されてボタンは動かない）
initialize();