// カウンターのHTML生成を担当するファイル

export function createCounterHTML(
    name = "",
    count = 0,
    checked = false
) {
    return `
    <div class="counter">

        <div class="counterHeader">
            <input class="select"
                   type="checkbox"
                   ${checked ? "checked" : ""}>

            <input
                class="counterName"
                type="text"
                value="${name}"
                placeholder="新しいカウンター">
        </div>

        <div class="counterBody">
            <button class="minus">-</button>

            <input
                class="count"
                type="number"
                value="${count}">

            <button class="plus">+</button>
        </div>

    </div>
    `;
}