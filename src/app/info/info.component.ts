import {Component, OnInit} from '@angular/core';
import {ToolbarAction, ToolbarService} from '../toolbar/toolbar.service';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-lifter-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

  text = '';
  options: any = {maxLines: 1000, printMargin: false};
  footer = '';

  constructor(private http: HttpClient, private toolbar: ToolbarService) {
  }

  ngOnInit() {
    this.toolbar.actions.next([
      new ToolbarAction(this, 'refresh', 'Refresh', ($this) => $this.refresh())
    ]);
    this.refresh();
  }

  refresh() {
    setTimeout(() => {
      this.toolbar.progressStart();
      this.http.get(environment.api('info')).subscribe((info) => {
        this.text = JSON.stringify(info, null, '  ');
        this.toolbar.progressStop();
      }, (response) => {
        this.text = JSON.stringify(response.error, null, '  ');
        this.footer = 'Info cannot be (fully) retrieved!';
        this.toolbar.progressStop();
      }, () => this.toolbar.progressStop());
    });
  }
}
