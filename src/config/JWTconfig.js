require('dotenv').config();
const jwt = require('jsonwebtoken');

class JWTconfig {
    constructor() {
        this.secret = process.env.JWT_SECRET;
        this.expiration = process.env.JWT_EXPIRATION;

        this.jwtMiddleware = (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                jwt.verify(token, this.secret, (err, user) => {
                    if (err) {
                        return res.status(403).json({ message: 'Token inválido' });
                    }
                    req.user = user;
                    next();
                });
            } else {
                res.status(401).json({ message: 'Token não fornecido' });
            }
        };

        this.jwtSupervisorMiddleware = (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                jwt.verify(token, this.secret, (err, user) => {
                    if (err) {
                        return res.status(403).json({ message: 'Token inválido' });
                    }
                    if (user.role !== 'supervisor' && user.role !== 'admin') {
                        return res.status(403).json({ message: 'Acesso negado' });
                    }
                    req.user = user;
                    next();
                });
            } else {
                res.status(401).json({ message: 'Token não fornecido' });
            }
        };
        

        this.generateToken = (user) => {
            return jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role
            }, this.secret, { expiresIn: this.expiration });  
        };

        this.verifyToken = (token) => {
            try {
                return jwt.verify(token, this.secret);
            } catch (err) {
                throw new Error('Token inválido');
            }
        };

        this.decodeToken = (token) => {
            try {
                if (!token) {
                    throw new Error('Token não fornecido');
                }
                const decoded = jwt.decode(token);
                if (!decoded) {
                    throw new Error(`${token}`);
                }
                return decoded;
            } catch (err) {
                throw new Error(`Erro ao decodificar token: ${err.message}`);
            }
        }
    }
}

module.exports = new JWTconfig();
