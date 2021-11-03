"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;

function vltl() {
    // rules
    this.require = (value) => {
        return value + "".trim() === "";
    };

    this.email = (value) => {
        return value.trim() === "" ||
            value.match(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
            ? false
            : true;
    };

    this.phone = (value) => {
        return value.trim() === "" ||
            value.match(/^(?:\(?\?)?(?:[-\.\(\)\s]*(\d)){9}\)?$/)
            ? false
            : true;
    };

    this.postCode = (value) => {
        return value.trim() === "" || value.match(/^([0-9]{2}\-[0-9]{3})$/)
            ? false
            : true;
    };

    this.requireGroupState = {};

    this.requireGroup = (value, group) => {
        if (
            value.trim() &&
            value !== false &&
            !this.requireGroupState.hasOwnProperty(group)
        ) {
            this.requireGroupState[group] = false;
        }

        return false;
    };

    this.equalGroupState = {};

    this.equalGroup = (value, group) => {
        if (
            value.trim() &&
            value !== false &&
            !this.equalGroupState.hasOwnProperty(group)
        ) {
            this.equalGroupState[group] = value;
        } else if (
            value.trim() &&
            value !== false &&
            value !== this.equalGroupState[group]
        ) {
            delete this.equalGroupState[group];
        }

        return false;
    };

    this.min = (value, val) => {
        return value.trim() === "" || value.length >= val ? false : true;
    };

    this.max = (value, val) => {
        return value.trim() === "" || value.length <= val ? false : true;
    };

    this.minVal = (value, val) => {
        return String(value).trim() === "" || value >= val ? false : true;
    };

    this.maxVal = (value, val) => {
        return String(value).trim() === "" || value <= val ? false : true;
    };

    this.number = (value) => {
        return String(value).trim() === "" || String(value).match(/^([0-9 -]+)$/)
            ? false
            : true;
    };

    this.text = (value) => {
        return value.trim() === "" || value.match(/^([a-zA-Z _-]+)$/)
            ? false
            : true;
    };

    this.regex = (value, val) => {
        return value.trim() === "" || value.match(new RegExp(val)) ? false : true;
    };

    this.callback = (value, cb) => {
        return cb(this);
    }; // check

    this.rules = {};
    this.messages = {};
    this.results = {};

    this.prepareResults = () => {
        for (let r in this.results) {
            if (!Object.keys(this.results[r]).indexOf("requireGroup")) {
                let g = this.requireGroupState[this.rules[r].requireGroup];
                this.results[r].requireGroup =
                    g === true || g === undefined ? true : false;
            }

            if (
                Object.keys(this.results[r]).indexOf("equalGroup") > -1 &&
                !this.equalGroupState[this.rules[r].equalGroup]
            ) {
                let g = this.equalGroupState[this.rules[r].equalGroup];
                this.results[r].equalGroup = g === undefined ? true : false;
            }

            let e = Object.values(this.results[r]).indexOf(true);
            this.results[r].errors = e == -1 ? false : true;
            this.results[r].message =
                e == -1 ? "" : this.messages[r][Object.keys(this.rules[r])[e]];
        }

        let e = Object.keys(this.results)
            .map((e) => {
                return this.results[e].errors;
            })
            .indexOf(true);
        this.results.errors = e !== -1 ? true : false;
    };

    (this.check = (data) => {
        this.results = {};
        var t = this;

        for (let r in t.rules) {
            this.results[r] = {};
            var error = false;
            Object.keys(t.rules[r]).forEach((rule) => {
                let v = t.rules[r][rule];

                if (v === true) {
                    var error =
                        typeof data[r] !== "undefined" ? this[rule](data[r]) : false;
                } else if (v !== false) {
                    var error =
                        typeof data[r] !== "undefined" ? this[rule](data[r], v) : false;
                }

                this.results[r][rule] = error;
            });
        }

        this.prepareResults();
        this.requireGroupState = {};
        this.equalGroupState = {};
        return this.results;
    }),
        (this.getError = (data) => {
            return this.results[data]
                ? this.results[data]
                : {
                    message: ""
                };
        });
    this.isValid = this.errors ? !this.errors.errors : false;
}

const vaLittle = {
    install(Vue, options) {
        Vue.prototype.$vaLittle = () => false;

        Vue.mixin({
            created() {
                this.$vaLittle = new vltl();
                const plugin = this.$vaLittle;
                let validate = this.$options.validate;

                if (validate) {
                    plugin.rules = validate.rules;
                    plugin.messages = validate.messages;
                }
            }
        });
    }
};
var _default = vaLittle;
exports.default = _default;
