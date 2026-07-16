export default class Counter {
    constructor(
        name = "",
        count = 0,
        checked = false
    ){
        this.name = name;
        this.count = count;
        this.checked = checked;
    }
}