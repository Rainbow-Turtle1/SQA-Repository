function NewSessionToken(){
    let token = sessionStorage.getItem('sessionToken')
    if (!token){
        token = GenerateSessionToken()
        sessionStorage.setItem('sessionToken',token)
    }
    return token
}

function GenerateSessionToken(){
    let date = new Date()
    let generation = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`+Math.floor(Math.random()*(99999)).toString(16)
    return generation
}

export{NewSessionToken,GenerateToken}