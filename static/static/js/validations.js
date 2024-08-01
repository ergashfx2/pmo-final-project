function loginValidate (){
    document.addEventListener("DOMContentLoaded", function() {
        const formGroups = document.querySelectorAll(".form-group");
        formGroups.forEach(group => {
            const input = group.querySelector("input");
            const errors = group.querySelector(".invalid-feedback");
            if (errors) {
                input.classList.add("is-invalid");
            }
        });
    });
}

try {
    loginValidate()
}catch (e){}