const datain = document.querySelector("input");
const dataout = document.querySelector("#result");

// Math functions
const basel_inv = (n) => {
    return "\\frac{" + (n * 6) + "}{\\pi^2}\\sum_{k=1}^{\\infty}\\frac{1}{k^2}";
}

const two_three_inv = (n) => {
    if (n >= 9 && n % 3 == 0) {
        const nthird = n / 3;
        return "\\sum_{k=1}^{\\infty}\\frac{" + nthird + "\\cdot k^2}{2^{k+1}}"
    }

    if (n >= 8 && n % 2 == 0) {
        const nhalf = n / 2;
        return "\\sum_{k=1}^{\\infty}\\frac{" + nhalf + "\\cdot k^2}{3 \\cdot 2^{k}}"
    }

    return "";
}

function factorial_inv(n) {
    let product = 1;
    let i = 1;
        
    while (product <= n) {
        if (product === n)
            return `${i}!`;

        product *= ++i;
    }

    return "";
}

function half_inv(n) {
    if (n % 2 == 0) {
        let nhalf = n / 2;
        return "\\lim_{a->0^+}\\int_a^1\\frac{" + nhalf + "dx}{\\sqrt{x}}";
    }

    return "";
}

// UI
const update = () => {
    if (datain.value.length == 0) {
        dataout.innerText = "";
        return;
    }

    const number = parseInt(datain.value);

    let results = [
        basel_inv(number),
        two_three_inv(number),
        factorial_inv(number),
        half_inv(number)
    ].filter(x => x);

    console.log(results);

    const result = results[Math.floor(Math.random() * results.length)]
    dataout.innerText = `$$${result}$$`;
    MathJax.typeset();
}