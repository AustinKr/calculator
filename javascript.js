function add(a, b)
{
    return a + b;
}
function subtract(a, b)
{
    return a - b;
}
function divide(a, b)
{
    return a / b;
}
function multiply(a, b)
{
    return a * b;
}

function main()
{
    const displayResult = document.querySelector(".display-result");
    const displayCurrent = document.querySelector(".display-current");

    const panelNumpad = document.querySelector(".panel-numpad");
    panelNumpad.addEventListener("click", event => {
        let index = Array.from(panelNumpad.children).indexOf(event.target);
        if(index >= 0)
            displayCurrent.textContent = index;
    });
}
main();