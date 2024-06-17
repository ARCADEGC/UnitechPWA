export type TRegisterProps = {
    username: string;
    email: string;
    password: string;
    salt: string;
};

export type TLoginProps = {
    email: string;
    password: string;
};
