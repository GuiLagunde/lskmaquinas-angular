import * as textMaskAddons from 'text-mask-addons/dist/textMaskAddons';

export class ProjectMask{

    //Input Masks 
    maskCPF = {
        mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
      };
    
      maskEmail= {
        mask: textMaskAddons.emailMask
      };
    
      maskTelefone = {
        mask: ['(', /[1-9]/, /\d/, ')', ' ', /\d/,/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      };
    
      maskCEP = {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]
      };

      maskCNPJ = {
        mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
      };

      maskDate = {
        mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
      };

      maskDateMonthYear = {
        mask: [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
      };

      integerMaskOptions = {
        mask: textMaskAddons.createNumberMask({
          allowDecimal:false,
          decimalLimit:0,
          requireDecimal:false,
          guide:true,
          keepCharPositions:false,
          showMask:true,
          thousandsSeparatorSymbol: '.',
          integerLimit: 7,
          prefix: ''
        })
      };

      numberMaskOptions = {
        mask: textMaskAddons.createNumberMask({
          allowDecimal:true,
          decimalSymbol:',',
          decimalLimit:2,
          requireDecimal:true,
          guide:true,
          keepCharPositions:false,
          showMask:true,
          thousandsSeparatorSymbol: '.',
          integerLimit: 7,
          prefix: ''
        })
      };

      currencyMaskOptions = {
        mask: textMaskAddons.createNumberMask({
          allowDecimal:true,
          decimalSymbol:',',
          decimalLimit:2,
          requireDecimal:true,
          guide:true,
          keepCharPositions:false,
          showMask:true,
          thousandsSeparatorSymbol: '.',
          integerLimit: 7,
          prefix: 'R$'
        })
      };
     

      public maskValue(value : number) : string{
        return String(value.toFixed(2)).replace(",","").replace(".",",");
      }

      public unmaskCNPJ(value : string) : string{
        return String(value.toString().replace(".","").replace(".","").replace("-","").replace("/",""));
      }

      public unmaskNumber(value : string) : number{
        return Number(value.toString().replace(".","").replace(".","").replace(".","").replace(",","."));
      }

      public unmaskCurrency(value : string) : number{
        return this.unmaskNumber(value);
      }
}