export class Model {
    static propertyTypes = [];

    static fromArray(array) {
        let r = new ModelCollection;
        for (let m of array) r.push(new this(m));
        return r;
    }

    constructor(data) {
        this.parse(data);
    }

    parse(data) {
        for (let name in data) {
            let type = this.constructor.propertyTypes[name];
            if (!type) continue;
            if (type == Date)
                this[name] = new Date(data[name]);
            else if (type.name == 'uint' || type == 'int')
                this[name] = BigInt(data[name]);
            else this[name] = type(data[name]);
        }
    }

    toJSON() {
        let o = {};
        let pss = this.constructor.propertyTypes;
        for (let name in this) {
            let ps = pss[name];
            if (ps == String || ps == Boolean || ps == Number || ps == BigInt) o[name] = this[name];
            else if (ps._enum) o[name] = this[name].number;
            else if (ps == Date) o[name] = this[name].valueOf();
            else if (ps.name == 'uint' || ps.name == 'int') o[name] = this[name];
            else o[name] = String(this[name]);
        }
        return o;
    }
}

export class ModelCollection extends Array {
    toJSON() {
        let r = [];
        for (let m of this) r.push(m.toJSON());
        return r;
    }
}