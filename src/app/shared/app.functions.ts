import { FormGroup } from "@angular/forms";
import { format, addDays } from 'date-fns';
import { parse, isValid } from 'date-fns';

export class ProjectFunctions{

    public getClassValidField(formulario: FormGroup, nameField : string) : string{
        if (formulario.get(nameField).invalid && formulario.get(nameField).touched){
          return 'is-invalid'
        } else if (formulario.get(nameField).valid && formulario.get(nameField).touched){
          return 'is-valid'
        }
        return '' 
      }

       addDays(data : Date, days : number) : Date{
        const dataPrevisao = new Date(data);
        const dataPrevisaoMaisUmDia = addDays(dataPrevisao, days);
        return dataPrevisaoMaisUmDia;
    }

    getValidDate(dateStr: string | Date): Date | null {
      if(isValid(dateStr)){
        return dateStr as Date;
      }

      const date = parse(dateStr as string, 'dd/MM/yyyy', new Date());
            
      return isValid(date) ? date : null;      
    }
    
    getValidDateList(dateStr: string | Date): string | null {
      if(isValid(dateStr)){
        return format(dateStr as Date, 'yyyy-MM-dd')
      }

      let date = parse(dateStr as string, 'dd/MM/yyyy', new Date());
      let date2 = format(date, 'yyyy-MM-dd');
                  
      return date2;      
    }

  abrirPdfEmNovaAba(base64: string, fileName: string): void {
    // Converte a string base64 para um array de bytes
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Cria um Blob a partir do array de bytes
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Cria uma URL a partir do Blob
    const url = URL.createObjectURL(blob);

    // Abre a URL em uma nova aba
    const novaAba = window.open('', '_blank');
    if (novaAba) {
        novaAba.document.title = fileName;

        // Adiciona um iframe para exibir o PDF
        const iframe = novaAba.document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.src = url;
        novaAba.document.body.appendChild(iframe);

        // Adiciona um botão de download ao documento
        const button = novaAba.document.createElement('button');
        button.textContent = 'Baixar PDF';
        button.onclick = () => {
            const link = novaAba.document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
        };
        novaAba.document.body.appendChild(button);
    } else {
        alert('Por favor, permita pop-ups para este site.');
    }
}


}




   
