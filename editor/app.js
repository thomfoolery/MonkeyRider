import { Router } from 'aurelia-router';

export class App {

  static inject() { return [Router]; }

  constructor( router ) {

    this.router = router;
    this.router.configure( config => {

      config.title = 'Monkey Rider';

      config.map([
        {
          route: ['','home'],
          moduleId: 'home',
          nav: true,
          title:'Home'
        },
        {
          route: ['scene'],
          moduleId: 'scene/index',
          nav: true,
          title:'Scene Editor'
        }
      ]);

    });

  }
}