function eval() {
    // Do not use eval!!!
    return;
}
// TypeError: Division by zero.
function expressionCalculator(expr) {

    const checkBrackets = (str) => {
        let count = 0;
        for (let ch of str) {
            if (ch === '(') count += 1;
            if (ch === ')') count -= 1;
        }
        return !!count;
    }

    if (checkBrackets(expr)) {
        throw new Error('ExpressionError: Brackets must be paired')
    }

    const operations = {
        '+': 1,
        '-': 1,
        '/': 2,
        '*': 2,
        '(': 3,
        ')': 3,
    }

    const calculateOperations = {
        '+': (a, b) => Number(b) + Number(a),
        '-': (a, b) => Number(b) - Number(a),
        '*': (a, b) => b * a,
        '/': (a, b) => {
            if (+a === 0) throw new Error('TypeError: Division by zero.');
            return b / a;
        },
    }

    const stackOperations = [];
    const stackNumbers = [];

    function calculateNumbers() {
        let topOperator = stackOperations.pop();
        let fisrtNumber = stackNumbers.pop();
        let secondNumber = stackNumbers.pop();

        stackNumbers.push(calculateOperations[topOperator](fisrtNumber, secondNumber));
    }

    let chunksExpr = [];
    let elem = '';
    // chunksExpr start
    for (let i = 0; i < expr.length; i++) {

        if (expr[i] === ' ' && elem.length === 0) {
            continue;
        }

        if (!(expr[i] in operations) && expr[i] !== ' ') {
            elem += expr[i];
            if (i === expr.length - 1) {
                chunksExpr.push(elem);
                elem = '';
            }
            continue;
        }

        if ((expr[i] in operations) && elem.length === 0) {
            chunksExpr.push(expr[i]);
            continue;
        }

        if (expr[i] in operations) {
            chunksExpr.push(elem);
            chunksExpr.push(expr[i]);
            elem = '';
            continue;
        }

        if (expr[i] === ' ' && elem.length > 0) {
            chunksExpr.push(elem);
            elem = '';
        }
    }
    //chunksExpr end

    for (let i = 0; i < chunksExpr.length; i++) {

        if (!(chunksExpr[i] in operations)) {
            stackNumbers.push(chunksExpr[i]);
        }
        if (chunksExpr[i] in operations) {

            while (
                operations[chunksExpr[i]] <= operations[stackOperations[stackOperations.length - 1]]
                && stackNumbers.length >= 2
                && stackOperations[stackOperations.length - 1] !== '('
                && chunksExpr[i] !== ')') {

                calculateNumbers()
            }

            stackOperations.push(chunksExpr[i])

            if (chunksExpr[i] === ')') {
                stackOperations.pop()
                while (stackOperations[stackOperations.length - 1] !== '(') {
                    calculateNumbers()
                }
                stackOperations.pop()
            }

        }
    }

    while (stackOperations.length >= 1) {
        calculateNumbers()
    }

    return Number(stackNumbers[0])
}

module.exports = {
    expressionCalculator
}