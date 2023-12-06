// Thực hiện ẩn hiện các nút và form
function appear() {
    clear();
    document.querySelector(".btn-login").style.display = "none";
    document.getElementById("form-1").style.display = "block";
}

function clear() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("oldpassword").value = "";
    document.getElementById("newpassword").value = "";
}

function hide() {
    document.getElementById("form-1").style.display = "none";
    document.getElementById("form-2").style.display = "none";
    document.querySelector(".btn-login").style.display = "block";
}

function forgot() {
    clear();
    document.getElementById("form-1").style.display = "none";
    document.getElementById("form-2").style.display = "block";
}

function back() {
    document.getElementById("form-2").style.display = "none";
    document.getElementById("form-1").style.display = "block";
}

// Loading
const loading = function loading() {
    const textLogin = document.querySelector(".text-login");
    const loadingIcon = document.querySelector("#loading-icon");

    textLogin.innerText = "";
    loadingIcon.style.display = "block";
    loadingIcon.classList.add("spin");

    // Đặt thời gian chờ 2 giây trước khi hiện lại nút "Login" và ẩn biểu tượng
    setTimeout(function () {
        textLogin.innerText = "Login";
        loadingIcon.style.display = "none";
    }, 2000);
};

// Validate
function Validator(options) {
    // Hàm lấy ra thẻ cha của input
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    // Hàm validate
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = getParent(
            inputElement,
            options.formGroupSelector
        ).querySelector(options.errorSelector);

        // Lấy các rules của input
        var rules = selectorRules[rule.selector];
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case "radio":
                case "checkbox":
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ":checked")
                    );
                    break;

                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add(
                "invalid"
            );
        } else {
            errorElement.innerText = "";
            getParent(inputElement, options.formGroupSelector).classList.remove(
                "invalid"
            );
        }
        return errorMessage;
    }

    // Lấy ra form cần validate
    var formElement = document.querySelector(options.form);
    var selectorRules = {};

    if (formElement) {
        // Thực hiện submit
        formElement.onsubmit = (e) => {
            var isFormValid = true;
            e.preventDefault();
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (isValid) {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                if (typeof options.onSubmit === "function") {

                    // Lấy tất cả các trường input có attribute "name"
                    var inputElements = formElement.querySelectorAll("[name]");
                    var inputValues = {};
                    inputElements.forEach((input) => {
                        switch (input.type) {
                            case "radio":
                                inputValues[input.name] =
                                    formElement.querySelector(
                                        "input[name='" +
                                            input.name +
                                            "']:checked"
                                    ).value;
                                break;
                            case "checkbox":
                                if (!Array.isArray(inputValues[input.name])) {
                                    inputValues[input.name] = [];
                                }
                                if (input.checked) {
                                    inputValues[input.name].push(input.value);
                                }
                                break;
                            default:
                                inputValues[input.name] = input.value;
                        }
                    });
                }
                options.onSubmit(inputValues);
            }
        };

        // Xử lý xự kiện trong DOM
        options.rules.forEach(function (rule) {
            // Lấy ra các input
            var inputElements = formElement.querySelectorAll(rule.selector);

            // Lưu lại các rules
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            Array.from(inputElements).forEach((inputElement) => {
                // Thực hiện blur
                var errorElement = getParent(
                    inputElement,
                    options.formGroupSelector
                ).querySelector(options.errorSelector);
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                };
                // Khi gõ sẽ mất thông báo lỗi
                inputElement.oninput = () => {
                    errorElement.innerText = "";
                    getParent(
                        inputElement,
                        options.formGroupSelector
                    ).classList.remove("invalid");
                };
            });
        });
    }
}

// Định nghĩa các Rules
Validator.isRequired = function (selector, message) {
    return {
        selector,
        test: (value) => {
            return value ? undefined : message || "Vui lòng nhập trường này";
        },
    };
};

Validator.minLength = function (selector, min) {
    return {
        selector,
        test: (value) => {
            return value.length >= min
                ? undefined
                : `Nhập tối thiểu ${min} ký tự`;
        },
    };
};
