import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { STAKEHOLDER_COUNT_BY_TYPE } from '../stakeholders/graphql/stakeholders.queries';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private apollo: Apollo) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/stakeholders_analytics').pipe(
            tap((response: any) => {
                this._data.next(response);
                console.log(response)
            })
        );
    }

    getStakeholderCountByType(): Observable<{ type: string; count: number }[]> {
          return this.apollo
              .watchQuery<any>({
                  query: STAKEHOLDER_COUNT_BY_TYPE
              })
              .valueChanges.pipe(
                  map(result => result.data.stakeholderCountByType),
                  tap((data) => {
                      this._data.next(data);
                      console.log(data);
                  })
              );
      }
}





