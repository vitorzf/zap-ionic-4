export class Helper{
    traduzir(erro){

        switch (erro) {
            case "auth/invalid-email":
                return "Email inválido";
                break;

            case "auth/wrong-password":
                return "Senha incorreta ou usuário não cadastrado";
                break;
        
            default:
                return "erro"
                break;
        }

    }

    checaUndefined(texto, min = 999){

        if(texto == undefined){
            return true;
        }
      
        if(texto.length < min){
            return true;
        }

        return false;

    }
}