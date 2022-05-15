// DOM elements
const datain = document.querySelector("input");
const dataout = document.querySelector("#result");
const refreshbtn = document.querySelector("#refresh");
const wabtn = document.querySelector("#wolframalpha");
const copybtn = document.querySelector("#copy");
const pref_multiple = document.querySelector("#multiterm");
const pref_complex = document.querySelector("#complex");
const bounce = document.querySelector(".bounce");
const raw = document.querySelector("#raw");

// Randomness
function Random(seed) {
    this._seed = seed % 997;
    if (this._seed <= 0) 
        this._seed += 996;
}

Random.prototype.next = function(min, max) {
    this._seed = this._seed * 67 % 997;
    let r = (this._seed % (max - min)) + min;
    return r;
};

var random = new Random(Math.floor(Math.random() * 10000 + 1));

// Inverse functions
const basel_inv = (n, prefs) => {
    return "\\frac{" + (n * 6) + "}{\\pi^2}\\sum_{k=1}^{\\infty}\\frac{1}{k^2}";
}

const basel2_inv = (n, prefs) => {
    return "\\frac{" + (n * 90) + "}{\\pi^4}\\sum_{k=1}^{\\infty}\\frac{1}{k^4}";
}

const two_three_inv = (n, prefs) => {
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

const square_inv = (n, prefs) => {
    if (Number.isInteger(Math.sqrt(n))) {
        return Math.sqrt(n) + "^2";
    }

    return "";
}

const powerten_inv = (n, prefs) => {
    if (Number.isInteger(Math.log10(n))) {
        return "10^{" + Math.log10(n) + "}";
    }

    return "";
}
Math.log10

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
    if (n % 2 == 0 && n > 2) {
        let nhalf = n / 2;
        return "\\lim_{a \\rightarrow 0^+}\\int_a^1\\frac{" + nhalf + "dx}{\\sqrt{x}}";
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

const sqrt_inv = (n, prefs) => {
    if (n < 1) {
        return "";
    }

    return "\\sqrt{" + n*n + "}";
}

const euler_inv = (n, prefs) => {
    if (!prefs.complex || n < 2) {
        return "";
    }

    return "\\frac{" + n + "e^{\\pi \\cdot i}}{i^2}";
}

const tanprod_inv = (n, prefs) => {
    if (n % 2 == 0 || n < 3) {
        return "";
    }

    let m = (n-1)/2;

    return "\\left( \\prod_{k=1}^{" + m + "} \\tan{ \\frac{k \\pi}{2 \\cdot" + m + " + 1}} \\right)^2";
}

const simpledouble_inv = (n, prefs) => {
    return "\\frac{" + (n * 2) + "}{2}"
}

const simplethird_inv = (n, prefs) => {
    return "\\frac{" + (n * 3) + "}{3}"
}

const ln_inv = (n, prefs) => {
    return "\\ln\\left( \\sum_{k=0}^{\\infty} \\frac{" + n + "}{k!} \\right)"
}

const all_inv_functions = [
    basel_inv,
    basel2_inv,
    two_three_inv,
    factorial_inv,
    half_inv,
    square_inv,
    power_two_inv,
    euler_inv,
    tanprod_inv,
    simpledouble_inv,
    simplethird_inv,
    ln_inv,
    sqrt_inv,
    powerten_inv,
];

// Computation functions
const _compute = (n, prefs) => {
    let results = all_inv_functions.map(x => x(n, prefs)).filter(x => x);
    if (!prefs.complex) {
        results = results.filter(x => !x.includes("\\sum"));
        results = results.filter(x => !x.includes("\\lim"));
        results = results.filter(x => !x.includes("\\int"));
        results = results.filter(x => !x.includes("\\prod"));
    }
    return results[random.next(0, results.length)];
}

const compute = (number, parts, prefs) => {
    let negative = number < 0;
    number = Math.abs(number);

    if (prefs.multiterm === false) {
        parts = 1;
    } else {
        parts = random.next(2, parts + 1);
    }

    subresults = [];

    while (parts-- > 0) {
        if (number / parts < 3 || parts == 0) {
            subresults.push(_compute(number, prefs));
            break;
        }
        let term = random.next(2, Math.floor(number / parts));
        subresults.push(_compute(term, prefs));
        number -= term;
    }

    const result = subresults.join(" + ");

    return negative ? "-\\left(" + result + "\\right)" : result;
}

// UI
const closeBouncer = () => {
    bounce.classList.add("hidden");
}

const focusin = () => {
    bounce.classList.add("hidden");
    setTimeout(focusout, 10000);
}

const focusout = () => {
    bounce.classList.remove("hidden");
}

let writeTextFunc = null;
const writeText = (newtext, wait) => {
    dataout.classList.remove("lineup");
    raw.classList.remove("lineup");
    writeTextFunc = setTimeout(() => {
        dataout.innerText = `$$${newtext}$$`;
        MathJax.typeset();
        raw.innerText = newtext;
        dataout.classList.add("lineup");
        raw.classList.add("lineup");
    }, wait);
}

const update = () => {
    if (writeTextFunc) {
        clearTimeout(writeTextFunc);
        writeTextFunc = null;
    }

    refreshbtn.classList.remove("visible");
    wabtn.classList.remove("visible");
    copybtn.classList.remove("visible");

    if (datain.value.length == 0) {
        dataout.innerText = "-";
        raw.innerText = "-";
        return;
    }

    const number = parseInt(datain.value.trim());

    if (number.toString() != datain.value.trim()) {
        dataout.innerText = "Bara heltal (än så länge!)";
        raw.innerText = "-";
        return;
    }

    const prefs = {
        complex: complex.checked,
        multiterm: multiterm.checked,
    }

    let newUrl = new URL(window.location.href);
    newUrl.searchParams.set("q", number);
    newUrl.searchParams.set("seed", random._seed);
    history.pushState(null, null, newUrl.toString());
    const result = compute(number, 4, prefs);
    wabtn.childNodes[0].href = "https://www.wolframalpha.com/input?i=" + encodeURIComponent(result);
    writeText(result, 750);

    refreshbtn.classList.add("visible");
    copybtn.classList.add("visible");
    wabtn.classList.add("visible");
    
}

const copy = () => {
    let copyText = document.createElement("input");
    copyText.type = "text";
    copyText.value = raw.innerText;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Kopierat till urklipp: " + copyText.value);
}

// Search
const searchFromUrl = () => {
    let params = new URLSearchParams(window.location.search);
    let searchterm = params.get("q");
    let seed = params.get("seed");
    if (searchterm) {
        datain.value = searchterm;
        if (seed) {
            random = new Random(seed);
        }
        update();
    }
}

window.addEventListener('load', searchFromUrl);