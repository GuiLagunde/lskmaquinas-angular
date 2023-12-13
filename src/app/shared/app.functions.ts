import { FormGroup } from "@angular/forms"

export class ProjectFunctions{

    public getClassValidField(formulario: FormGroup, nameField : string) : string{
        if (formulario.get(nameField).invalid && formulario.get(nameField).touched){
          return 'is-invalid'
        } else if (formulario.get(nameField).valid && formulario.get(nameField).touched){
          return 'is-valid'
        }
        return '' 
      }
    }      