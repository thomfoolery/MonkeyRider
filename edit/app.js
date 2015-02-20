import { Router } from 'aurelia-router';

export class App {

  static inject() { return [Router]; }

  constructor( router ) {

    this.router = router;
    this.router.configure( config => {

      config.title = 'Monkey Rider';
      // config.options.pushState = true;

      config.map([
        {
          route: [''],
          moduleId: 'home',
          title:'Home',
          nav: true
        },{
          route: ['scene'],
          moduleId: 'scene/index',
          title:'Scene Editor',
          nav: true
        },{
          route: ['scene/:sceneID'],
          moduleId: 'scene/index'
        },{
          route: ['script/:sceneID/:spriteID'],
          moduleId: 'script/index'
        }
      ]);

    });

  }
}