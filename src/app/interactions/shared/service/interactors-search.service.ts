import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { InteractorsSearchResult } from '../model/interactions-results/interactor/interactors-search.model';
import { environment } from '../../../../environments/environment';

// const interactorBaseURL = environment.interactor_base_url;

@Injectable()
export class InteractorsSearchService {

  private _totalElements = 0;
  private _page: number = 1;
  private _pageSize: number = 20;

  constructor(private http: HttpClient) { }

  /**
   * Find an interactor based on indexed term
   * @param query
   * @param format
   * @returns {Observable<InteractorsSearchResult>}
   */
  getAllInteractors(): Observable<InteractorsSearchResult> {

    return this.http.get('/interactorService' + '/getAll')
      .catch(this.handleError);
  }

  getAllInteractorsAndFacets(): Observable<InteractorsSearchResult> {
    return this.http.get('/interactorService/getAllTaxIdFacets')
      .catch(this.handleError);
  }

  getAllInteractorsAndFacetsQuery(query: string,
                                  speciesFilter: string[],
                                  interactorTypeFilter: string[],
                                  currentPageIndex = 1, pageSize = 20): Observable<InteractorsSearchResult> {
    query = query.trim();
    this.page = currentPageIndex;

    currentPageIndex = currentPageIndex - 1;

    const params = new HttpParams()
      .set('query', query)
      .set('page', currentPageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('interactorTypeFilter', interactorTypeFilter.toString())
      .set('speciesFilter', speciesFilter.toString());

    const options = query ? {params: params} : {};

    return this.http.get('/interactorService/interactor/findInteractorWithFacet', options)
      .catch(this.handleError);
  }

  get totalPages() {
    try {
      return Math.ceil(this._totalElements / this._pageSize);
    } catch (e) {
      console.error(e);
      return 0;
    }
  }

  get page(): number {
    return this._page;
  }

  set page(value: number) {
    if (value !== this.page) {
      this._page = value;
    }
  }

  get totalElements(): number {
    return this._totalElements;
  }

  set totalElements(value: number) {
    this._totalElements = value;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    this._pageSize = value;
  }

  private handleError(err: HttpErrorResponse | any): Observable<any> {
    if (err.error instanceof Error) {
      return Observable.throw(err);
    } else {
      console.error(err.message ? err.message : err.toString());
    }
  }

}
