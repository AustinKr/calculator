function evaluate(a, b, sign)
{
    switch(sign)
    {
        case 0:
            return a + b;
        case 1:
            return a - b;
        case 2:
            return a * b;
        case 3:
            return a / b;
    }
    return NaN;
}
function isEntryEmpty(entry) {
    let float = parseFloat(entry); 
    return float === null || Number.isNaN(float) || float === Infinity || float === -Infinity;
}
function marshalEntry(entry) {
    return isEntryEmpty(entry) ? "" : entry.toString();
}
function removeDigitFromEntry(entry, digitCount = 1, defaulToNull = true)
{
    let str = marshalEntry(entry);
    let newCount = str.length - digitCount;
    if(newCount <= 0)
        return defaulToNull ? null : "0";
    return str.substring(0, newCount);
}

let entries = ["0", null, null];
let shouldAddDecimalPoint = false;

function setEntry(index, digit)
{
    if (digit !== null)
    {
        let digitStr = digit.toString();
        if (shouldAddDecimalPoint && !marshalEntry(entries[index]).includes("."))
            digitStr = ".".concat(digitStr);
        shouldAddDecimalPoint = false;
        
        entries[index] = marshalEntry(entries[index]).concat(digitStr);
        return;
    }
    entries[index] = removeDigitFromEntry(entries[index], 1, index === 2);
}

function getCurrentEntryID()
{
    for(let i = 0; i < entries.length; i++)
    {
        if (isEntryEmpty(entries[i]))
            return i;
    }
    return entries.length;
}
function getEntriesDisplayText()
{
    let sign = "";
    switch(entries[1])
    {
        case 0:
            sign = "+";
            break;
        case 1:
            sign = "-";
            break;
        case 2:
            sign = "X";
            break;
        case 3:
            sign = "÷";
            break;
    }
    let a = entries[0] !== null ? parseFloat(entries[0]) : "";;
    let b = entries[2] !== null ? parseFloat(entries[2]) : "";

    return `${a} ${sign} ${b}`;
}

const displayResult = document.querySelector(".display-result");
const displayCurrent = document.querySelector(".display-current");

function enterDigit(digit)
{
    let currentID = getCurrentEntryID();
    if (currentID <= 1)
        setEntry(0, digit);
    else if (currentID > 1)
        setEntry(2, digit);

    displayCurrent.textContent = getEntriesDisplayText();
}
function enterDeleteDigit()
{
    let id = getCurrentEntryID() - 1;
    switch (id) {
        case -1: // No entries in current line
            displayResult.textContent = "";
        case 0: // A has a value
        case 2: // B has a value
            setEntry(id, null);
            break;

        default: // Operator has a value
            entries[id] = null;
    }
    displayCurrent.textContent = getEntriesDisplayText();
}
function enterClear()
{
    entries = ["0", null, null];
    displayCurrent.textContent = "0";
    displayResult.textContent = "";
}
function enterOperator(operatorID)
{
    let currentID = getCurrentEntryID();
    if (currentID < 1) {
        displayResult.textContent = "enter a number";
        return;
    }
    entries[1] = operatorID;
    displayCurrent.textContent = getEntriesDisplayText();
}
function enterEvaluate()
{
    if (getCurrentEntryID() < 2) {
        displayResult.textContent = "enter an expression";
        return;
    }

    let result = evaluate(parseFloat(entries[0]), parseFloat(entries[2]), entries[1]);
    displayResult.textContent = result;
    displayCurrent.textContent = "";
    entries = [result, null, null];
}

function main()
{
    document.querySelector("body").addEventListener("keyup", event =>
    {
        switch (event.key)
        {
            case "0":
                enterDigit(0);
                break;
            case "1":
                enterDigit(1);
                break;
            case "2":
                enterDigit(2);
                break;
            case "3":
                enterDigit(3);
                break;
            case "4":
                enterDigit(4);
                break;
            case "5":
                enterDigit(5);
                break;
            case "6":
                enterDigit(6);
                break;
            case "7":
                enterDigit(7);
                break;
            case "8":
                enterDigit(8);
                break;
            case "9":
                enterDigit(9);
                break;

            case "+":
                enterOperator(0);
                break;
            case "-":
                enterOperator(1);
                break;
            case "*":
                enterOperator(2);
                break;
            case "/":
                enterOperator(3);
                break;

            case "=":
                enterEvaluate();
                break;
            case "Backspace":
                if (event.shiftKey)
                    enterClear();
                else
                    enterDeleteDigit();
                break;

            case ".":
                shouldAddDecimalPoint = true;
                break;
        }
    });

    const panelNumpad = document.querySelector(".panel-numpad");
    panelNumpad.addEventListener("click", event =>
    {
        let index = Array.from(panelNumpad.children).indexOf(event.target);
        if(index < 0)
            return;
        enterDigit(index);
    });
    document.getElementById("delete-button").addEventListener("click", () => enterDeleteDigit());

    const panelArithmetic = document.querySelector(".panel-arithmetic");
    panelArithmetic.addEventListener("click", event =>
    {
        let index = Array.from(panelArithmetic.children).indexOf(event.target);
        if (index < 0)
            return;
        enterOperator(index);
    });

    document.getElementById("clear-button").addEventListener("click", () => enterClear());
    document.getElementById("evaluate-button").addEventListener("click", () => enterEvaluate());
    document.getElementById("decimal-button").addEventListener("click", () => shouldAddDecimalPoint = true);

    const darkModeButton = document.getElementById("dark-mode-button");
    darkModeButton.addEventListener("click", () =>
    {
        darkModeButton.children[0].classList.toggle("light-mode-button");
        document.querySelector("body").classList.toggle("dark-mode-background");

        for (let node of document.getElementById("main-column").querySelectorAll("*")) {
            switch (node.tagName)
            {
                case "DIV":
                    node.classList.toggle("dark-mode-panel");
                    break;
                case "BUTTON":
                    node.classList.toggle("dark-mode-button");
                default:
                    node.classList.toggle("dark-mode-text");
            }
        }
    });
}
main();