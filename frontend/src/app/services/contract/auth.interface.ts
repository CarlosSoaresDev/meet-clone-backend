export interface IAuthInterface {
    
    singIn(email: string, password: string);

    singUp(email: string, password: string);

    googleSingIn();

    logout();

}