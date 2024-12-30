import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

@Component({
  selector: 'app-button-wrapper',
  template: '<div #buttonContainer></div>',
  styleUrls: ['./button-wrapper.component.css'],
})
export class ButtonWrapperComponent implements AfterViewInit {
  @ViewChild('buttonContainer', { static: true }) buttonContainer!: ElementRef;

  async ngAfterViewInit() {
    const ButtonModule = await loadRemoteModule({
      remoteEntry: 'http://localhost:3000/remoteEntry.js',
      remoteName: 'react_remote',
      exposedModule: './Button',
    });

    const ReactButton = ButtonModule.default;
    const reactElement = React.createElement(ReactButton, {});

    const container = this.buttonContainer.nativeElement;
    const root = ReactDOM.createRoot(container);
    root.render(reactElement); 
  }
}

