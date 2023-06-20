import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { defineCustomElement } from 'planartest-game/dist/components/component-game-planar';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  defineCustomElement();
