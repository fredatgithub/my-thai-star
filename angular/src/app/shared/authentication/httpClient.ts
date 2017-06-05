import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { WindowService } from '../windowService/windowService.service';

@Injectable()
export class HttpClient {

    headers: Headers;

    constructor(private auth: AuthService,
                private http: Http,
                private window: WindowService) {
      this.headers = new Headers();
      this.headers.append('Content-Type',  'application/json');
    }

    setHeaderToken(value: string): void {
        this.headers.delete('Authorization');
        if (value) {
          this.headers.append('Authorization', 'Bearer ' + value);
        }
    }

    get(url: string): Observable<any> {
        return new Observable((observer: any) => {
            this.setHeaderToken(this.auth.getToken());
            this.http.get(url, {withCredentials: true, headers: this.headers})
                .subscribe( (data: any) => {
                    return observer.next(data);
                }, (error: any) => {
                    if (error.status === 400 || error.status === 500) {
                        this.auth.logout();
                        this.headers.delete('Authorization');
                        this.window.reloadWindow();
                    }
            });
        });
    }

    post(url: string, data: any): Observable<any> {
        return new Observable((observer: any) => {
            this.setHeaderToken(this.auth.getToken());
            this.http.post(url, data, {withCredentials: true, headers: this.headers})
                .subscribe( (result: any) => {
                    return observer.next(result);
                }, (error: any) => {
                    if (error.status === 400 || error.status === 500) {
                        this.auth.logout();
                        this.headers.delete('Authorization');
                        this.window.reloadWindow();
                    }
                });
        });
    }
}
