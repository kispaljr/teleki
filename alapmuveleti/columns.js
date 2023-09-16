// Generates the next random operation in a column
class Column {
    constructor(x, all_op_generators) {
        this.op_generators = all_op_generators.filter(
            op => {
                return get_bool_input(`${op.short_name}_${x + 1}`);
            }
        );

        if (0 == this.op_generators.length) {
            this.op_generators = all_op_generators.slice(); // shallow copy
        }

        this.random_missing_operand = get_bool_input(`random_missing_operand_${x + 1}`);
    }

    next() {
        let missing_pos = 4;
        if (this.random_missing_operand) {
            missing_pos = rando([0, 2, 4]).value;
        }

        let op = rando(this.op_generators).value.next(missing_pos / 2);
        op[missing_pos] = "__";
        return op;
    }
}

function rebuild_all() {
    let interval = get_radiobutton_value("allowed_interval");
    switch (interval) {
        case "100-beginner": {
            max_num = 100;
            max_2nd_operand = 9;
            break;
        }
        case "100": {
            max_num = 100;
            max_2nd_operand = max_num;
            break;
        }
        case "20": {
            max_num = 20;
            max_2nd_operand = max_num;
            break;
        }
        default:
            max_num = 10;
            max_2nd_operand = max_num;
            console.error("Invalid allowed_interval (szamkor) value:", interval);
            break;
    }
    precompute_add_sub_operands();
    rebuild_table();
}


function rebuild_table() {
    // create a generator for all valid operations
    var op_generators = [
        new Addition(),
        new Subtraction(),
        new Multiplication(),
        new Division()
    ];

    // collect operation generators for each column
    let columns = [];
    for (let x = 0; x < column_cnt; x++) {
        columns.push(new Column(x, op_generators));
    }

    // save settings to cookie
    // NOTE: the lines above can actually modify the settings
    save_settings();

    // rewrite the table of exercises
    for (let x = 0; x < column_cnt; x++) {
        var tbl = document.getElementById(`exercises_${x + 1}`);
        tbl.innerHTML = '';
        for (let y = 0; y < 25; y++) {
            const tr = tbl.insertRow();
            parts = columns[x].next();
            for (const part of parts) {
                const td = tr.insertCell();
                td.appendChild(document.createTextNode(part));
            }
        }
    }
}

function build_column_settings() {

    var tbl = document.getElementById('per_column_settings');
    tbl.innerHTML = `
      <tr>
        <th colspan="${column_cnt}" style="padding-bottom: 10px;padding-top: 15px;">Művelettípusok kiválasztása oszloponként
          (egyszerre több is választható):
        </th>
      </tr>
`;
    const tr = tbl.insertRow();
    for (let x = 1; x <= column_cnt; x++) {
        const td = tr.insertCell();
        td.innerHTML = `
          <table class="settings">
            <tr>
              <td>
                <input type="checkbox" id="add_${x}" name="add_${x}" checked="true" onclick="rebuild_table()" />
                <label for="add_${x}">Összeadás</label>
              </td>
            </tr>
            <tr>
              <td>
                <input type="checkbox" id="sub_${x}" name="sub_${x}" checked="true" onclick="rebuild_table()" />
                <label for="sub_${x}">Kivonás</label>
              </td>
            </tr>
            <tr>
              <td>
                <input type="checkbox" id="mul_${x}" name="mul_${x}" checked="true" onclick="rebuild_table()" />
                <label for="mul_${x}">Szorzás</label>
              </td>
            </tr>
            <tr>
              <td>
                <input type="checkbox" id="div_${x}" name="div_${x}" checked="true" onclick="rebuild_table()" />
                <label for="div_${x}">Osztás</label>
              </td>
            </tr>
          </table>
          <div>
            <input type="checkbox" id="random_missing_operand_${x}" name="random_missing_operand_${x}" onclick="rebuild_table()" />
            <label for="random_missing_operand_${x}">Kitöltendő hely véletlenszerű pozícióban</label>
          </div>
`;
    }
}
