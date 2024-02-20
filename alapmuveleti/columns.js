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
    let interval = get_radiobutton_value("allowed_numberset");
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
            max_num = 20;
            max_2nd_operand = max_num;
            console.error("Invalid allowed_numberset (szamkor) value:", interval);
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

    var column_settings_table = document.getElementById('per_column_settings');
    column_settings_table.innerHTML = `
      <tr>
        <th colspan="${column_cnt}" style="padding-bottom: 10px;padding-top: 15px;">Művelettípusok kiválasztása oszloponként
          (egyszerre több is választható):
        </th>
      </tr>`;

    const settings = [
        { "id": "add", "label": "Összeadás" },
        { "id": "sub", "label": "Kivonás" },
        { "id": "mul", "label": "Szorzás" },
        { "id": "div", "label": "Osztás" },
        { "id": "random_missing_operand", "label": "Kitöltendő hely véletlenszerű pozícióban" }
    ];

    const tr = column_settings_table.insertRow();
    for (let x = 1; x <= column_cnt; x++) {
        const td = tr.insertCell();
        let rows = "";
        for (const setting of settings) {
            rows += `
            <tr>
              <td>
                <input type="checkbox" id="${setting.id}_${x}" name="${setting.id}_${x}" checked="true" onclick="rebuild_table()" />
                <label for="${setting.id}_${x}">${setting.label}</label>
              </td>
            </tr>`;
        }
        td.innerHTML = `<table class="settings">${rows}</table>`;
    }


    var multable_settings_div = document.getElementById('multable_settings');
    let multable_inputs = "";
    for (let x = 0; x <= 9; x++) {
        multable_inputs += `
            <input type="checkbox" id="mul_table_${x}" name="mul_table_${x}" checked="true" onclick="rebuild_table()" />
            <label for="mul_table_${x}">${x}</label>`
    }
    multable_settings_div.innerHTML = multable_inputs;

}
