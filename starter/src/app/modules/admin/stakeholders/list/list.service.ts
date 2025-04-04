import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_STAKEHOLDER_BY_ID, GET_STAKEHOLDERS_MATCHES, STAKEHOLDER_COUNT_BY_TYPE } from '../graphql/stakeholders.queries';
import { GET_STAKEHOLDERS_BY_TYPE } from '../graphql/stakeholders.queries';
import { GET_STAKEHOLDERS_WHITH_SHARED_TAXIDENTIFIER } from '../graphql/stakeholders.queries';
import { SEARCH_STAKEHOLDERS } from '../graphql/stakeholders.queries';


@Injectable({
  providedIn: 'root'
})
export class StakeholdersListService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _contact: BehaviorSubject<any> = new BehaviorSubject(
      null
    );
    private _relatedStakeholders: BehaviorSubject<any> = new BehaviorSubject(
      null
    );

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


     /**
     * Getter for signle contact
     */
     get contact$(): Observable<any> {
        return this._contact.asObservable();
    }

    /**
     * Getter for signle contact
     */
    get relatedStakeholders$(): Observable<any> {
      return this._relatedStakeholders.asObservable();
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

    getStakeholderById(id: string): Observable<any> {
      return this.apollo
        .query<any>({
          query: GET_STAKEHOLDER_BY_ID,
          variables: { stakeholderId:id },
          fetchPolicy: 'network-only'
        })
        .pipe(map(result => {
          this._contact.next(result.data.stakeholder); 
          return result.data.stakeholder;
        }));
    }

    getStakeholdersByCompanyAndPersonal(companyData: any, personalData: any): Observable<any> {
      return this.apollo
        .query<any>({
          query: GET_STAKEHOLDERS_MATCHES,
          variables: { companyData: companyData, personalData: personalData },
          fetchPolicy: 'network-only'
        })
        .pipe(map(result => {
          this._relatedStakeholders.next(result.data.stakeholdersByCompanyAndPersonal); 
          console.log(result)
          return result.data.stakeholdersByCompanyAndPersonal;
        }));
    }


    /**
     * Update data
     */
    
}
