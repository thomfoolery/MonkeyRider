import {HttpClient} from 'aurelia-http-client';

export class EditScene_Index {

  static inject() { return [HttpClient]; }

  constructor( http ){

    this.http = http;
    this.heading = 'Scene Editor';

  }

}