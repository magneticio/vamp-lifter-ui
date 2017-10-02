import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {ToolbarAction, ToolbarService} from '../toolbar/toolbar.service';
import {MD_DIALOG_DATA, MdDialog, MdDialogConfig, MdDialogRef, MdSnackBar, MdSnackBarConfig} from '@angular/material';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/Rx';
import {CanDeactivate} from '@angular/router';

@Component({
  selector: 'app-lifter-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {

  config: string;
  base = '';
  text = '';
  options: any = {maxLines: 1000, printMargin: false};

  constructor(private http: HttpClient,
              private toolbar: ToolbarService,
              private dialog: MdDialog,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.getConfiguration(false, false).subscribe((text) => this.base = this.text = text, () => {
      this.showSnackBar('An error occurred! Check network connection and configuration parameters.');
    });
    this.toolbar.actions.next([
      new ToolbarAction(this, 'save', 'Save', ($this) => $this.save()),
      new ToolbarAction(this, 'cloud_download', 'Pull from KV Store', ($this) => $this.pull()),
      new ToolbarAction(this, 'cloud_upload', 'Push to KV Store', ($this) => $this.push()),
      new ToolbarAction(this, 'autorenew', 'Revert to original static configuration', ($this) => $this.refresh())
    ]);
  }

  save() {
    this.set(false, false, () => {
      this.showSnackBar('Configuration has been saved.');
    }, () => {
      this.showSnackBar('Configuration can\'t be saved - invalid input.');
    });
  }

  refresh() {
    this.getConfiguration(true, false).subscribe((text) => {
      if (text !== this.text) {
        const config = new MdDialogConfig();
        config.data = {
          question: 'Are you sure you want to replace the current configuration?'
        };
        const dialogRef = this.dialog.open(ConfigurationConfirmationDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.base = this.text = text;
            this.set(false, true);
          }
        });
      }
    });
  }

  pull() {
    this.getConfiguration(false, true).subscribe((text) => {
      if (text !== this.text) {
        const config = new MdDialogConfig();
        config.data = {
          question: 'Are you sure you want to replace the current configuration?'
        };
        const dialogRef = this.dialog.open(ConfigurationConfirmationDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.base = this.text = text;
            this.set(true, true);
          }
        });
      } else {
        this.showSnackBar('Configuration is successfully pulled from KV store.');
      }
    }, () => {
      this.showSnackBar('An error occurred! Check network connection and configuration parameters.');
    });
  }

  push() {
    this.set(true, true, () => {
      this.showSnackBar('Configuration is successfully stored to KV store.');
    }, () => {
      this.showSnackBar('An error occurred! Check network connection and configuration parameters.');
    });
  }

  dirty() {
    return this.text !== this.base;
  }

  private set(kv: boolean = false, force: boolean = false, success: () => any = () => {
  }, error: () => any = () => {
  }): void {
    this.toolbar.progressStart();
    this.setConfiguration(this.text, kv, force).subscribe(
      () => {
        this.base = this.text;
        success();
        this.toolbar.progressStop();
      },
      () => {
        error();
        this.toolbar.progressStop();
      },
      () => {
        this.base = this.text;
        success();
        this.toolbar.progressStop();
      }
    );
  }

  private getConfiguration(base: Boolean, kv: Boolean): Observable<string> {
    const headers = new HttpHeaders().set('Accept', 'application/x-yaml');
    let params = new HttpParams();
    params = kv ? params.append('key_value', 'true') : params;
    params = base ? params.append('static', 'true') : params;

    return this.http
      .get(environment.api('config'),
        {headers: headers, params: params, responseType: 'text'}
      ).map((body) => {
        this.config = body;
        return body;
      });
  }

  private setConfiguration(config: string, kv: boolean = false, force: boolean = false): Observable<any> {
    if (force || this.config !== config) {
      let params = new HttpParams();
      params = kv ? params.append('key_value', 'true') : params;
      return this.http.post(environment.api('config'), config, {params: params});
    }
    return Observable.from([]);
  }

  private showSnackBar(message: string) {
    const config = new MdSnackBarConfig();
    config.duration = 2000;
    this.snackBar.open(message, null, config);
  }
}

@Component({
  selector: 'app-lifter-configuration-dialog',
  templateUrl: './dialog.component.html',
})
export class ConfigurationConfirmationDialogComponent {

  constructor(public dialogRef: MdDialogRef<ConfigurationConfirmationDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Injectable()
export class SaveConfigurationGuard implements CanDeactivate<ConfigurationComponent> {

  constructor(private dialog: MdDialog) {}

  canDeactivate(component: ConfigurationComponent): Observable<boolean>|boolean {
    if (component.dirty()) {
      const config = new MdDialogConfig();
      config.data = {
        question: 'Are you sure you want to leave without saving the configuration?'
      };
      const dialogRef = this.dialog.open(ConfigurationConfirmationDialogComponent, config);
      return dialogRef.afterClosed();
    } else {
      return true;
    }
  }
}
