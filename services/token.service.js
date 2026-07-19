const tokensEnMemoria = new Map();

const guardarToken = (correo, token) => {
    tokensEnMemoria.set(correo, {
        token,
        expires: Date.now() + 600000 // 10 minutos
    });
};

const validarToken = (correo, tokenRecibido) => {
    const info = tokensEnMemoria.get(correo);
    if (!info || Date.now() > info.expires) return false;
    return info.token === tokenRecibido;
};

module.exports = { guardarToken, validarToken };