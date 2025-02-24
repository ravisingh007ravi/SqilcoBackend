exports.validName = (name) => {
    const validName = /^[A-Za-z ]+$/;
    return validName.test(name)
}

exports.validEmail = (email) => {
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return validEmail.test(email)
}

exports.validPassword = (password) => {
    const validPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return validPassword.test(password)
}