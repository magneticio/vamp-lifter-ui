import {Component, OnInit} from '@angular/core';
import {ToolbarAction, ToolbarService} from '../toolbar/toolbar.service';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import 'rxjs/Rx';

@Component({
  selector: 'app-lifter-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

  text = '';
  options: any = {maxLines: 1000, printMargin: false};

  constructor(private http: HttpClient, private snackBar: MdSnackBar, private toolbar: ToolbarService) {
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
        const config = new MdSnackBarConfig();
        config.duration = 2000;
        this.snackBar.open('Info cannot be (fully) retrieved!', null, config);
        this.toolbar.progressStop();
      }, () => this.toolbar.progressStop());
    });
  }
}
