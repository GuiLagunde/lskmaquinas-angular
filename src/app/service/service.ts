export abstract class Service {
  
    constructor() { }

    public getHeaders(): Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        if (localStorage.getItem('access_token')) {
            try {
                headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));                           
            } catch (e) {
            }
        }
        return headers;
    }

    public getHeadersWithoutAuthorization(): Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        return headers;
    }

    public getParams(params: object): string {        
        return this.extractParams('', params);
    }

    public getSearchParams(termobusca? : string) {
        let filter = {      
          pesquisa: ! termobusca ? null : termobusca
        }
    
        if (termobusca) {
          Object.keys(termobusca).forEach(
            key => {
              filter[key] = termobusca[key];
            });
        }
    
        return filter;
      }

    public toJSON(obj : object) : string{
        return JSON.stringify(obj);
    }

    // public downloadFile(blob, filename) {
    //     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //         window.navigator.msSaveOrOpenBlob(blob, filename);
    //     } else {
    //         const url = window.URL.createObjectURL(blob);
    //         let a = document.createElement('a');
    //         document.body.appendChild(a);
    //         a.href = url;
    //         a.download = filename;
    //         a.click();
    //         window.URL.revokeObjectURL(url);
    //         a.remove();
    //     }
    // }

    private extractParams(paramsUrl: string, params: object) {
        Object.keys(params).forEach(key => {
            paramsUrl += paramsUrl ? '&' : '?';
            paramsUrl += params[key] ? key + '=' + encodeURIComponent(params[key]) : '';
        });
        return paramsUrl;
    }
}