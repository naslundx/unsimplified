// DOM elements
const datain = document.querySelector("input");
const dataout = document.querySelector("#result");
const refreshbtn = document.querySelector("#refresh");
const pref_multiple = document.querySelector("#multiterm");
const pref_complex = document.querySelector("#complex");

// Helper functions
const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat()))).filter(x => x[0] != x[2]);
const randint = (min, max) => Math.floor(Math.random() * (max - min) + min);

// Inverse functions
const basel_inv = (n, prefs) => {
    if (!prefs.complex) {
        return "";
    }

    return "\\frac{" + (n * 6) + "}{\\pi^2}\\sum_{k=1}^{\\infty}\\frac{1}{k^2}";
}

const two_three_inv = (n, prefs) => {
    if (!prefs.complex) {
        return "";
    }

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

const factorial_inv = (n, prefs) => {
    let product = 1;
    let i = 1;
        
    while (product <= n) {
        if (product === n)
            return `${i}!`;

        product *= ++i;
    }

    return "";
}

const half_inv = (n, prefs) => {
    if (!prefs.complex) {
        return "";
    }

    if (n % 2 == 0 && n > 2) {
        let nhalf = n / 2;
        return "\\lim_{a->0^+}\\int_a^1\\frac{" + nhalf + "dx}{\\sqrt{x}}";
    }

    return "";
}

const power_two_inv = (n, prefs) => {
    if (n && !(n & (n - 1))) {
        let nlog = Math.log2(n);
        return "2^{" + nlog + "}";
    }

    return "";
}

const euler_inv = (n, prefs) => {
    if (!prefs.complex) {
        return "";
    }

    return "\\frac{" + n + "e^{\\pi \\cdot i}}{i^2}";
}

const tanprod_inv = (n, prefs) => {
    if (!prefs.complex) {
        return "";
    }

    if (n % 2 == 0) {
        return "";
    }

    let m = (n-1)/2;

    return "\\left( \\prod_{k=1}^{" + m + "} \\frac{k \\pi}{2 \\cdot" + m + " + 1} \\right)^2";
}

const simpledouble_inv = (n, prefs) => {
    return "\\frac{" + (n * 2) + "}{2}"
}

const all_inv_functions = [
    basel_inv,
    two_three_inv,
    factorial_inv,
    half_inv,
    power_two_inv,
    euler_inv,
    tanprod_inv,
    simpledouble_inv,
];

// Computation functions
const _compute = (n, prefs) => {
    let results = all_inv_functions.map(x => x(n, prefs)).filter(x => x);
    return results[randint(0, results.length)];
}

const compute = (number, parts, prefs) => {
    if (prefs.multiterm === false || number < 3) {
        parts = 1;
    } else {
        parts = randint(1, parts + 1);
    }

    subresults = [];

    while (parts-- > 1) {
        let term = randint(2, number / parts);
        subresults.push(_compute(term, prefs));
        number -= term;
        console.log(subresults);
    }

    subresults.push(_compute(number, prefs));
    return subresults.join(" + ");
}

// UI
const update = () => {
    refreshbtn.classList.remove("visible");

    if (datain.value.length == 0) {
        dataout.innerText = "";
        return;
    }

    const number = parseInt(datain.value);

    if (number < 1) {
        dataout.innerText = "Bara positiva heltal (än så länge)";
    }

    let prefs = {
        complex: complex.checked,
        multiterm: multiterm.checked
    }

    console.log(prefs);

    const result = compute(number, 3, prefs);
    dataout.innerText = `$$${result}$$`;
    refreshbtn.classList.add("visible");
    MathJax.typeset();
}