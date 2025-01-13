function NewSessionToken(id){
    let token = sessionStorage.getItem('sessionToken')
    if (!token){
        token = GenerateSessionToken(id)
        sessionStorage.setItem('sessionToken', token)
    }
    return token
}

function GenerateSessionToken(id){
    let newToken = { 
        id, 
        date: getCurrentDate(),
    }
    let encryptedToken = tokenEncrypt(newToken)
    return encryptedToken
}

function getCurrentDate(){
    let date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${date.getFullYear()}${month}${day}`
}

function tokenEncrypt(token){
    let encrypted = token
    return encrypted
}

function tokenIsValid(uuid){
    const storedToken = sessionStorage.getItem('sessionToken')
    if (!storedToken) {
        console.error('No session token found')
        //401 - failed auth err?
        return false
    }
    if (storedToken.id === uuid){
        console.log('This guy seems fine...');
        return true;
    }
    console.error('Somethings wrong I can feel it...Its just a feling Ive got...')
    return false
}

export{NewSessionToken,GenerateSessionToken,tokenIsValid}