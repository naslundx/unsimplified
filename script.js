const datain = document.querySelector("input");
const dataout = document.querySelector("#result");

// Inverse functions
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

function power_two_inv(n) {
    if (n && !(n & (n - 1))) {
        let nlog = Math.log2(n);
        return "2^{" + nlog + "}";
    }

    return "";
}

function euler_inv(n) {
    return "-" + n + "e^{\\pi \\cdot i}";
}

// Splitting functions

function split(n) {
    let i = Math.round(Math.sqrt(n)) - 1;
// TODO
}

// UI
const update = () => {
    if (datain.value.length == 0) {
        dataout.innerText = "";
        return;
    }

    const number = parseInt(datain.value);

    let functions = [
        basel_inv,
        two_three_inv,
        factorial_inv,
        half_inv,
        power_two_inv,
        euler_inv
    ]

    let results_full = functions.map(x => x(number)).filter(x => x);

    console.log(results_full);

    // TODO Try to divide the number and print more options

    let results = [...results_full];

    const result = results[Math.floor(Math.random() * results.length)]
    dataout.innerText = `$$${result}$$`;
    MathJax.typeset();
}