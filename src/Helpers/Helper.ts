
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

    semFoto(){
        return 'data:image/jpeg;base64,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'        
    }

    hash(msg) {
        function rotate_left(n,s) {
            var t4 = ( n<<s ) | (n>>>(32-s));
            return t4;
        };
        function lsb_hex(val) {
            var str='';
            var i;
            var vh;
            var vl;

            for( i=0; i<=6; i+=2 ) {
            vh = (val>>>(i*4+4))&0x0f;
            vl = (val>>>(i*4))&0x0f;
            str += vh.toString(16) + vl.toString(16);
            }
            return str;
        };
        function cvt_hex(val) {
            var str='';
            var i;
            var v;
            for( i=7; i>=0; i-- ) {
            v = (val>>>(i*4))&0x0f;
            str += v.toString(16);
        }
        return str;
        };
        function Utf8Encode(string) {
        string = string.replace(/\r\n/g,'\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
        utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
        }
        }
        return utftext;
        };
        var blockstart;
        var i, j;
        var W = new Array(80);
        var H0 = 0x67452301;
        var H1 = 0xEFCDAB89;
        var H2 = 0x98BADCFE;
        var H3 = 0x10325476;
        var H4 = 0xC3D2E1F0;
        var A, B, C, D, E;
        var temp;
        msg = Utf8Encode(msg);
        var msg_len = msg.length;
        var word_array = new Array();
        for( i=0; i<msg_len-3; i+=4 ) {
        j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
        msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
        word_array.push( j );
        }
        switch( msg_len % 4 ) {
        case 0:
        i = 0x080000000;
        break;
        case 1:
        i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
        break;
        case 2:
        i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
        break;
        case 3:
        i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8 | 0x80;
        break;
        }
        word_array.push( i );
        while( (word_array.length % 16) != 14 ) word_array.push( 0 );
        word_array.push( msg_len>>>29 );
        word_array.push( (msg_len<<3)&0x0ffffffff );
        for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
        for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
        for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for( i= 0; i<=19; i++ ) {
        temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
        }
        for( i=20; i<=39; i++ ) {
        temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
        }
        for( i=40; i<=59; i++ ) {
        temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
        }
        for( i=60; i<=79; i++ ) {
        temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
        }
        var temp: any = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    
        return temp.toLowerCase();
    }
}