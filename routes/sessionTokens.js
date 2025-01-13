function NewSessionToken(){
    let token = sessionStorage.getItem('sessionToken')
    if (!token){
        token = GenerateSessionToken()
        sessionStorage.setItem('sessionToken',token)
    }
    return token
}
// ${date.getFullYear()}${date.getMonth()}${date.getDate()}+Math.floor(Math.random()*(99999)).toString(16),

function GenerateSessionToken(id){
    let newToken = { 
        id, 
        date: getCurrentDate(),
    }
    //encryptedToken=tokenEncrypt(newToken)
    return newToken //encryptedToken
}

function getCurrentDate(){
    let date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${date.getFullYear()}${month}${day}`
}

function tokenEncrypt(token){
    
    return encrypted
}

export{NewSessionToken,GenerateToken}