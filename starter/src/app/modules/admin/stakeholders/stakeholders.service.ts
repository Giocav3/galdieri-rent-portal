import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { STAKEHOLDER_COUNT_BY_TYPE } from './graphql/stakeholders.queries';
import { GET_STAKEHOLDERS_BY_TYPE } from './graphql/stakeholders.queries';
import { GET_STAKEHOLDERS_WHITH_SHARED_TAXIDENTIFIER } from './graphql/stakeholders.queries';
import { SEARCH_STAKEHOLDERS } from './graphql/stakeholders.queries';


@Injectable({
  providedIn: 'root'
})
export class StakeholdersService {
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
    getData(): Observable<{ type: string; count: number }[]> {
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


  getStakeholdersByType(type: string, limit: number, skip: number): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_STAKEHOLDERS_BY_TYPE,
        variables: {
          stakeholderType: type,
          limit,
          skip
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(map(result => result.data.stakeholdersByType));
  }

  getStakeholdersWithSharedTaxIdentifier(type: string, limit: number, skip: number): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_STAKEHOLDERS_WHITH_SHARED_TAXIDENTIFIER,
        variables: {
          stakeholderType: type,
          limit,
          skip
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(map(result => result.data.stakeholdersWithSharedTaxIdentifier));
  }

  searchStakeholders(type: string | null, query: string, limit: number, skip: number): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_STAKEHOLDERS_WHITH_SHARED_TAXIDENTIFIER,
        variables: {
          filter: {
            ...(type ? { type } : {}),
            ...(query ? { query } : {})
          },
          limit,
          skip
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(map(result => result.data.stakeholdersWithSharedTaxIdentifier));
  }

  getContactById(id: string): Observable<any> {
          console.log("ottimo")
          return 
      }
  
  
}
