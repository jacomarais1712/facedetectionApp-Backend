const handleRegister = (req, res, database, bcrypt) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json('invalid registration submission')
    } else {
        const hash = bcrypt.hashSync(password);
        database.transaction(trx => {
            trx.insert({
                email: email,
                hash: hash
            })
            .into('public.login')
            .returning('email')
            .then(loginEmail => {
                return trx('public.users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0])
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json('unable to register'
        )})
    }
}

module.exports = {
    handleRegister: handleRegister
}