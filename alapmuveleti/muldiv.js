





// Common base class for generating random multiplications and divisions
class MulDiv {
    constructor() {
        let triplets = [];
        let a, b, c;
        for (a = min_mul_operand; a <= max_mul_operand; a++) {
            if (mul_tables.includes(a)) {
                for (b = min_mul_operand; b <= max_mul_operand; b++) {
                    c = a * b;
                    triplets.push({ a, b, c });
                }
            }
        }
        this.operands = new InRandomOrder(triplets);
    }

    // returns the next random operation
    next(missing_pos) {
        var { a, b, c } = this.operands.next();
        return this.render(a, b, c, missing_pos);
    }
}

// Generates random additions
class Multiplication extends MulDiv {
    render(a, b, c, missing_pos) {
        if (missing_pos == 0) {
            return [b, '⋅', a, '=', c];
        } 
        return [a, '⋅', b, '=', c];
    }

    get short_name() { return "mul"; }
}

// Generates random substractions
class Division extends MulDiv {
    render(a, b, c, missing_pos) {
        if (missing_pos == 1) {
            return [c, ':', b, '=', a];
        } 
        return [c, ':', a, '=', b];
    }

    get short_name() { return "div"; }
}
