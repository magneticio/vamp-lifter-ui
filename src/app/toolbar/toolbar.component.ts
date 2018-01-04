import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToolbarAction, ToolbarService} from './toolbar.service';
import {NavigationEnd, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';


@Component({
  selector: 'app-lifter-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  actions: Array<ToolbarAction> = [];
  progress = false;

  @Output() onMenu: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private toolbar: ToolbarService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry
    .addSvgIcon('logo',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo.svg'))
  }

  ngOnInit() {
    this.router.events.filter((event) => event instanceof NavigationEnd).subscribe(() => {
      setTimeout(() => {
        this.actions.length = 0;
        this.toolbar.progressStop();
      });
    });
    this.toolbar.actions.subscribe((actions: Array<ToolbarAction>) => setTimeout(() => this.actions = actions));
    this.toolbar.progress.subscribe((enable: boolean) => {
      this.progress = enable;
    });
  }

  onMenuClicked(event: any): void {
    this.onMenu.emit(event);
  }
}
