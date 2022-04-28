// DOM elements
const datain = document.querySelector("input");
const dataout = document.querySelector("#result");

// Helper functions
const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

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

const factorial_inv = (n) => {
    let product = 1;
    let i = 1;
        
    while (product <= n) {
        if (product === n)
            return `${i}!`;

        product *= ++i;
    }

    return "";
}

const half_inv = (n) => {
    if (n % 2 == 0) {
        let nhalf = n / 2;
        return "\\lim_{a->0^+}\\int_a^1\\frac{" + nhalf + "dx}{\\sqrt{x}}";
    }

    return "";
}

const power_two_inv = (n) => {
    if (n && !(n & (n - 1))) {
        let nlog = Math.log2(n);
        return "2^{" + nlog + "}";
    }

    return "";
}

const euler_inv = (n) => {
    return "-" + n + "e^{\\pi \\cdot i}";
}

const all_inv_functions = [
    basel_inv,
    two_three_inv,
    factorial_inv,
    half_inv,
    power_two_inv,
    euler_inv
]

// Computation functions
const compute = (n) => {
    return all_inv_functions.map(x => x(n)).filter(x => x);
}

const divided_compute = (n) => {
    // TODO do this with any factorization
    // and any number of parts (use random up to log10?)

    // TODO support settings for multiple parts, allowing series, etc.

    if (n < 4) {
        return [];
    }

    if (n % 2 == 0) {
        let halves = compute(n / 2);

        return cartesian(halves, ['+'], halves).map(x => x.join(" "));
    }

    return [];
}

// UI
const update = () => {
    if (datain.value.length == 0) {
        dataout.innerText = "";
        return;
    }

    const number = parseInt(datain.value);

    let results_full = compute(number);

    let results_test = divided_compute(number);

    let results = [...results_full, ...results_test];

    console.log(results);

    const result = results[Math.floor(Math.random() * results.length)]
    dataout.innerText = `$$${result}$$`;
    MathJax.typeset();
}