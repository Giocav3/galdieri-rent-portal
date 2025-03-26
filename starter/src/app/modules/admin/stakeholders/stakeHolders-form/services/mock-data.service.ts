import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  constructor(private http: HttpClient) {}

  getPersonalDataByCF(cf: string) {
    return this.http.get<any[]>('assets/mocks/personal-data.json').pipe(
      map(items => items.find(p => p.fiscalCode.toLowerCase() === cf.toLowerCase()))
    );
  }
  
  getCompanyDataByVat(vat: string) {
    return this.http.get<any[]>('assets/mocks/company-data.json').pipe(
      map(items => items.find(c => c.vatNumber === vat))
    );
  }
  
}
