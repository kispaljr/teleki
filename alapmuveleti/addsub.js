var crossing_10s = [];
var not_crossing_10s = [];

// NOTE: the number of all possible operations is quite small (if max_num == 20, then 231 for all possibilities, and only 190: if you exclude 0 and 1)
// this makes pregenerating all possible combinations viable
function precompute_add_sub_operands() {
    // a,b,c, so that: min_num <= a, b <= c <= max_num and a + b = c

    let a, b, c;
    crossing_10s = [];
    not_crossing_10s = [];
    for (c = 2 * min_num; c <= max_num; c++) {
        for (a = min_num; a <= c - min_num; a++) {
            b = c - a;
            if (b > max_2nd_operand) {
                continue
            } 
            // count things like 20-13 as a "10 crossing" (although it is technically not)
            if ((max_num == 20) && (c == 20) && (a > 10)) {
                crossing_10s.push({ a, b, c });
                continue
            }
            // partition by "10 crossing"
            if ((a % 10) + (b % 10) > 10) {
                crossing_10s.push({ a, b, c });
            } else {
                not_crossing_10s.push({ a, b, c });
            }
        }
    }
}

// returns the elements of a sequence in random order 
class InRandomOrder {
    constructor(sequence) {
        this.sequence = randoSequence(sequence);
        this.next_i = 0; // next index in the sequence
    }

    next() {
        let i = this.next_i;
        this.next_i = (this.next_i + 1) % this.sequence.length;
        return this.sequence[i].value;
    }
}

// Common base class for generating random additions and subtractions
class AddSub {
    constructor() {
        this.operands_crossing_10 = new InRandomOrder(crossing_10s);
        this.operands_not_crossing_10 = new InRandomOrder(not_crossing_10s);
        this.crossing_10_ratio = get_float_input(this.short_name + "_10crossings_ratio") / 100.0;
    }

    // returns the next random operation
    next(_) {
        if (Math.random() < this.crossing_10_ratio) {
            var { a, b, c } = this.operands_crossing_10.next();
        } else {
            var { a, b, c } = this.operands_not_crossing_10.next();
        }
        return this.render(a, b, c);
    }
}

// Generates random additions
class Addition extends AddSub {
    render(a, b, c) {
        return [a, '+', b, '=', c];
    }

    get short_name() { return "add"; }
}

// Generates random substractions
class Subtraction extends AddSub {
    render(a, b, c) {
        return [c, '-', b, '=', a];
    }

    get short_name() { return "sub"; }
}
