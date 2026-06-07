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
function isFloatEntryEmpty(float) {
    return float === null || Number.isNaN(float) || float === Infinity || float === -Infinity;
}
function floatEntryToString(float) {
    return isFloatEntryEmpty(float) ? "" : float.toString();
}
function appendDigitToFloat(float, digitToAppend) {
    return parseFloat(floatEntryToString(float).concat(digitToAppend));
}
function removeDigitFromFloat(float, digitCount = 1)
{
    let str = floatEntryToString(float);
    let newCount = str.length - digitCount;
    if(newCount <= 0)
        return null;
    return parseFloat(str.substring(0, newCount));
}
function containsDecimalPoint(float) {
    return (float - Math.floor(float)) !== 0;
}

let entries = [null, null, null]; // TODO: make entries A and B store string instead of floats
let shouldAddDecimalPoint = false;

function setEntry(index, digit)
{
    if (digit !== null)
    {
        let digitStr = digit.toString();
        if (shouldAddDecimalPoint && !containsDecimalPoint(entries[index]))
            digitStr = ".".concat(digitStr);
        shouldAddDecimalPoint = false;

        entries[index] = appendDigitToFloat(entries[index], digitStr);
        return;
    }
    entries[index] = removeDigitFromFloat(entries[index]);
}

function getCurrentEntryID()
{
    for(let i = 0; i < entries.length; i++)
    {
        if (isFloatEntryEmpty(entries[i]))
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
    let a = entries[0] !== null ? entries[0] : "";;
    let b = entries[2] !== null ? entries[2] : "";

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
        displayResult.textContent = "enter a expression";
        return;
    }

    let result = evaluate(entries[0], entries[2], entries[1]);
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

            case "Enter":
            case "=":
                enterEvaluate();
                break;
            case "Backspace":
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

    document.getElementById("evaluate-button").addEventListener("click", () => enterEvaluate());
    document.getElementById("decimal-button").addEventListener("click", () => shouldAddDecimalPoint = true);
}
main();