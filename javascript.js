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
    return float === null || Number.isNaN(float) || float === Infinity;
}
function floatEntryToString(float) {
    let isEmpty = isFloatEntryEmpty(float);
    return isEmpty ? "" : float.toString();
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

let entries = [null, null, null];
function setEntry(index, digit)
{
    if (digit !== null)
    {
        entries[index] = appendDigitToFloat(entries[index], digit);
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

function main()
{
    const displayResult = document.querySelector(".display-result");
    const displayCurrent = document.querySelector(".display-current");

    const panelNumpad = document.querySelector(".panel-numpad");
    panelNumpad.addEventListener("click", event =>
    {
        let index = Array.from(panelNumpad.children).indexOf(event.target);
        if(index < 0)
            return;

        let currentID = getCurrentEntryID();
        if (currentID <= 1)
            setEntry(0, index);
        else if(currentID > 1)
            setEntry(2, index);
        else
        {
            alert("Please enter a difference type of value");
            return;
        }
        displayCurrent.textContent = getEntriesDisplayText();
    });
    document.getElementById("delete-button").addEventListener("click", event =>
    {
        let id = getCurrentEntryID() - 1;
        switch (id)
        {
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
    });

    const panelArithmetic = document.querySelector(".panel-arithmetic");
    panelArithmetic.addEventListener("click", event =>
    {
        let index = Array.from(panelArithmetic.children).indexOf(event.target);
        if(index < 0)
            return;

        let currentID = getCurrentEntryID();
        if(currentID < 1)
        {
            alert("Please enter a difference type of value");
            return;
        }
        entries[1] = index;
        displayCurrent.textContent = getEntriesDisplayText();
    });

    document.getElementById("evaluate-button").addEventListener("click", event =>
    {
        if (getCurrentEntryID() < 2)
        {
            alert("Please enter a difference type of value");
            return;
        }

        let result = evaluate(entries[0], entries[2], entries[1]);
        displayResult.textContent = result;
        displayCurrent.textContent = "";
        entries = [result, null, null];
    });

    document.getElementById("decimal-button").addEventListener("click", event =>
    {

    });
}
main();