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
  }




   
