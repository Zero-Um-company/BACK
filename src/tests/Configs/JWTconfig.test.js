const JWTconfig = require('../../config/JWTconfig');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('JWTconfig', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'secret';
        process.env.JWT_EXPIRATION = '1h';
    });

    describe('generateToken', () => {
        it('deve gerar um token para o usuário', () => {
            const user = { id: '1', email: 'teste@gmail.com', role: 'admin' };
            const mockSecret = 'ZER0UM'; 
            const mockExpiration = '1h'; 
            process.env.JWT_SECRET = mockSecret;
            process.env.JWT_EXPIRATION = mockExpiration;

            jwt.sign.mockReturnValue('mockedToken');

            const token = JWTconfig.generateToken(user);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user.id, email: user.email, role: user.role },
                mockSecret, 
                { expiresIn: mockExpiration } 
            );
            expect(token).toBe('mockedToken');
        });
    });

    describe('verifyToken', () => {
        it('deve verificar um token válido', () => {
            const token = 'validToken';
            const decoded = { id: '1', email: 'teste@gmail.com', role: 'admin' };
            jwt.verify.mockReturnValueOnce(decoded);

            const result = JWTconfig.verifyToken(token);
            expect(result).toEqual(decoded);
        });

        it('deve lançar um erro se o token for inválido', () => {
            const token = 'invalidToken';
            jwt.verify.mockImplementationOnce(() => {
                throw new Error('Token inválido');
            });

            expect(() => JWTconfig.verifyToken(token)).toThrow('Token inválido');
        });
    });

    describe('decodeToken', () => {
        it('deve decodificar um token', () => {
            const token = 'validToken';
            const decoded = { id: '1', email: 'teste@gmail.com', role: 'admin' };
            jwt.decode.mockReturnValueOnce(decoded);

            const result = JWTconfig.decodeToken(token);
            expect(result).toEqual(decoded);
        });

        it('deve lançar um erro se o token não for fornecido', () => {
            expect(() => JWTconfig.decodeToken()).toThrow('Token não fornecido');
        });

        it('deve lançar um erro se a decodificação falhar', () => {
            const token = 'invalidToken';
            jwt.decode.mockReturnValueOnce(null);

            expect(() => JWTconfig.decodeToken(token)).toThrow(`Erro ao decodificar token: ${token}`);
        });
    });

    describe('jwtMiddleware', () => {
        it('deve permitir acesso com um token válido', () => {
            const req = { headers: { authorization: 'Bearer validToken' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            const decoded = { id: '1', email: 'teste@gmail.com', role: 'admin' };

            jwt.verify.mockImplementationOnce((token, secret, callback) => {
                callback(null, decoded);
            });

            JWTconfig.jwtMiddleware(req, res, next);
            expect(req.user).toEqual(decoded);
            expect(next).toHaveBeenCalled();
        });

        it('deve retornar 401 se o token não for fornecido', () => {
            const req = { headers: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            JWTconfig.jwtMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
        });

        it('deve retornar 403 se o token for inválido', () => {
            const req = { headers: { authorization: 'Bearer invalidToken' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            jwt.verify.mockImplementationOnce((token, secret, callback) => {
                callback(new Error('Token inválido'));
            });

            JWTconfig.jwtMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
        });
    });

    describe('jwtSupervisorMiddleware', () => {
        it('deve permitir acesso se o usuário for supervisor ou admin', () => {
            const req = { headers: { authorization: 'Bearer validToken' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            const decoded = { id: '1', email: 'teste@gmail.com', role: 'supervisor' };

            jwt.verify.mockImplementationOnce((token, secret, callback) => {
                callback(null, decoded);
            });

            JWTconfig.jwtSupervisorMiddleware(req, res, next);
            expect(req.user).toEqual(decoded);
            expect(next).toHaveBeenCalled();
        });

        it('deve retornar 403 se o usuário não for supervisor ou admin', () => {
            const req = { headers: { authorization: 'Bearer validToken' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            const decoded = { id: '1', email: 'teste@gmail.com', role: 'user' };

            jwt.verify.mockImplementationOnce((token, secret, callback) => {
                callback(null, decoded);
            });

            JWTconfig.jwtSupervisorMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Acesso negado' });
        });

        it('deve retornar 401 se o token não for fornecido', () => {
            const req = { headers: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            JWTconfig.jwtSupervisorMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
        });

        it('deve retornar 403 se o token for inválido', () => {
            const req = { headers: { authorization: 'Bearer invalidToken' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            jwt.verify.mockImplementationOnce((token, secret, callback) => {
                callback(new Error('Token inválido'));
            });

            JWTconfig.jwtSupervisorMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
        });
    });
});
